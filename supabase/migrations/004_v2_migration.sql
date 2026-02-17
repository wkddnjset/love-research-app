-- ============================================
-- 사랑연구소 v2 마이그레이션
-- 유저 고유코드, 궁합 결과, 매칭 티켓
-- ============================================

-- 1. user_profiles에 user_code 추가
ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS user_code TEXT UNIQUE;

-- 기존 유저에 코드 백필 (PL/pgSQL 함수)
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
ALTER TABLE user_profiles
  ALTER COLUMN user_code SET NOT NULL;

-- user_code 기본값: 신규 가입 시 트리거
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

CREATE TRIGGER set_user_code_trigger
  BEFORE INSERT ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION set_user_code();

-- user_profiles에 last_report_at 추가 (주 1회 업데이트 제한용)
ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS last_report_at TIMESTAMPTZ;

-- 2. compatibility_results (궁합 분석 양방향 결과)
CREATE TABLE IF NOT EXISTS compatibility_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  target_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  result JSONB NOT NULL DEFAULT '{}',
  score INTEGER,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE compatibility_results ENABLE ROW LEVEL SECURITY;

-- 요청자 또는 대상 유저 모두 조회 가능
CREATE POLICY "Users can view own compatibility results"
  ON compatibility_results
  FOR SELECT USING (
    auth.uid() = requester_id OR auth.uid() = target_id
  );

CREATE POLICY "Users can create compatibility results"
  ON compatibility_results
  FOR INSERT WITH CHECK (auth.uid() = requester_id);

-- 3. matching_tickets (매칭 티켓)
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

CREATE POLICY "Users can view own matching tickets"
  ON matching_tickets
  FOR SELECT USING (auth.uid() = user_id);

-- 4. analysis_results module_type 제약 업데이트
-- 기존 CHECK 제약 삭제 후 재생성 (v2: compatibility, report만)
ALTER TABLE analysis_results DROP CONSTRAINT IF EXISTS analysis_results_module_type_check;
ALTER TABLE analysis_results
  ADD CONSTRAINT analysis_results_module_type_check
  CHECK (module_type IN ('compatibility', 'report'));

-- usage_logs도 동일하게
ALTER TABLE usage_logs DROP CONSTRAINT IF EXISTS usage_logs_module_type_check;
ALTER TABLE usage_logs
  ADD CONSTRAINT usage_logs_module_type_check
  CHECK (module_type IN ('compatibility', 'report'));
