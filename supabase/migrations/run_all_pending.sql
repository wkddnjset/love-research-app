-- ============================================
-- 사랑연구소 v2 통합 마이그레이션
-- Supabase Dashboard > SQL Editor에서 실행
-- 순서: 003_ex_partners → 003_v2 → 004_daily_questions
-- ============================================

-- =============================================
-- PART 1: Ex Partners 업그레이드 (003_ex_partners_upgrade)
-- =============================================
ALTER TABLE ex_partners ADD COLUMN IF NOT EXISTS style_answers JSONB DEFAULT '{}';
ALTER TABLE ex_partners ADD COLUMN IF NOT EXISTS good_points TEXT;
ALTER TABLE ex_partners ADD COLUMN IF NOT EXISTS conflict_detail TEXT;
ALTER TABLE ex_partners ALTER COLUMN satisfaction_score DROP NOT NULL;
ALTER TABLE ex_partners ALTER COLUMN satisfaction_score SET DEFAULT 5;

-- =============================================
-- PART 2: v2 마이그레이션 (003_v2_migration)
-- =============================================

-- user_profiles에 user_code 추가
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS user_code TEXT UNIQUE;

-- 코드 생성 함수
CREATE OR REPLACE FUNCTION generate_user_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  code TEXT := 'LR-';
  i INT;
BEGIN
  FOR i IN 1..6 LOOP
    code := code || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- 기존 유저 백필
DO $$
DECLARE
  rec RECORD;
  new_code TEXT;
  retries INT;
BEGIN
  FOR rec IN SELECT id FROM user_profiles WHERE user_code IS NULL LOOP
    retries := 0;
    LOOP
      new_code := generate_user_code();
      BEGIN
        UPDATE user_profiles SET user_code = new_code WHERE id = rec.id;
        EXIT;
      EXCEPTION WHEN unique_violation THEN
        retries := retries + 1;
        IF retries >= 5 THEN
          RAISE EXCEPTION 'Failed to generate unique code after 5 retries';
        END IF;
      END;
    END LOOP;
  END LOOP;
END $$;

-- user_code NOT NULL 적용
ALTER TABLE user_profiles ALTER COLUMN user_code SET NOT NULL;

-- 신규 가입 시 자동 코드 생성 트리거
CREATE OR REPLACE FUNCTION set_user_code()
RETURNS TRIGGER AS $$
DECLARE
  new_code TEXT;
  retries INT := 0;
BEGIN
  IF NEW.user_code IS NULL THEN
    LOOP
      new_code := generate_user_code();
      BEGIN
        NEW.user_code := new_code;
        RETURN NEW;
      EXCEPTION WHEN unique_violation THEN
        retries := retries + 1;
        IF retries >= 5 THEN
          RAISE EXCEPTION 'Failed to generate unique user code';
        END IF;
      END;
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_user_code_trigger ON user_profiles;
CREATE TRIGGER set_user_code_trigger
  BEFORE INSERT ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION set_user_code();

-- last_report_at (주 1회 업데이트 제한용)
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS last_report_at TIMESTAMPTZ;

-- compatibility_results (궁합 분석 결과)
CREATE TABLE IF NOT EXISTS compatibility_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  target_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  result JSONB NOT NULL DEFAULT '{}',
  score INTEGER,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE compatibility_results ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Users can view own compatibility results"
    ON compatibility_results FOR SELECT
    USING (auth.uid() = requester_id OR auth.uid() = target_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can create compatibility results"
    ON compatibility_results FOR INSERT
    WITH CHECK (auth.uid() = requester_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- matching_tickets (매칭 티켓)
CREATE TABLE IF NOT EXISTS matching_tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  purchase_type TEXT NOT NULL CHECK (purchase_type IN ('earlybird', 'regular')),
  price INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'unused' CHECK (status IN ('unused', 'used', 'refunded')),
  paddle_transaction_id TEXT,
  purchased_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE matching_tickets ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Users can view own matching tickets"
    ON matching_tickets FOR SELECT
    USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- analysis_results module_type 제약 업데이트
ALTER TABLE analysis_results DROP CONSTRAINT IF EXISTS analysis_results_module_type_check;
ALTER TABLE analysis_results
  ADD CONSTRAINT analysis_results_module_type_check
  CHECK (module_type IN ('compatibility', 'report'));

ALTER TABLE usage_logs DROP CONSTRAINT IF EXISTS usage_logs_module_type_check;
ALTER TABLE usage_logs
  ADD CONSTRAINT usage_logs_module_type_check
  CHECK (module_type IN ('compatibility', 'report'));

-- =============================================
-- PART 3: 데일리 질문 시스템 (004_daily_questions)
-- =============================================

CREATE TABLE IF NOT EXISTS daily_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  keyword TEXT NOT NULL,
  scheduled_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS daily_answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES daily_questions(id) ON DELETE CASCADE,
  answer TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, question_id)
);

ALTER TABLE daily_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_answers ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "daily_questions_select" ON daily_questions
    FOR SELECT TO authenticated USING (is_active = true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "daily_questions_admin_all" ON daily_questions
    FOR ALL USING (auth.uid() = created_by);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "daily_answers_select_own" ON daily_answers
    FOR SELECT TO authenticated USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "daily_answers_insert_own" ON daily_answers
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS idx_daily_questions_date ON daily_questions(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_daily_answers_user ON daily_answers(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_answers_question ON daily_answers(question_id);

-- ============================================
-- 완료! 실행 후 확인사항:
-- 1. user_profiles에 user_code 컬럼 확인
-- 2. compatibility_results 테이블 생성 확인
-- 3. matching_tickets 테이블 생성 확인
-- 4. daily_questions, daily_answers 테이블 생성 확인
-- ============================================
