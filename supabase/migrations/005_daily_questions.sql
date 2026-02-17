-- ============================================
-- 004: 데일리 연애 질문 시스템
-- ============================================

-- 데일리 질문 테이블 (관리자가 사전 등록)
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

-- 데일리 답변 테이블 (유저 답변)
CREATE TABLE IF NOT EXISTS daily_answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES daily_questions(id) ON DELETE CASCADE,
  answer TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, question_id)
);

-- RLS
ALTER TABLE daily_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_answers ENABLE ROW LEVEL SECURITY;

-- 질문은 모든 인증된 유저가 조회 가능
CREATE POLICY "daily_questions_select" ON daily_questions
  FOR SELECT TO authenticated USING (is_active = true);

-- 질문 등록/수정은 관리자만 (서버사이드에서 service_role로 처리)
CREATE POLICY "daily_questions_admin_all" ON daily_questions
  FOR ALL USING (auth.uid() = created_by);

-- 답변은 본인만 조회/등록
CREATE POLICY "daily_answers_select_own" ON daily_answers
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "daily_answers_insert_own" ON daily_answers
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_daily_questions_date ON daily_questions(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_daily_answers_user ON daily_answers(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_answers_question ON daily_answers(question_id);
