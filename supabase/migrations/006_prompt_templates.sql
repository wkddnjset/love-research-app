-- 006: AI 프롬프트 템플릿 테이블
-- 관리자가 AI 분석 프롬프트를 동적으로 관리할 수 있도록 지원

CREATE TABLE prompt_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  module_type TEXT NOT NULL UNIQUE CHECK (module_type IN ('report', 'compatibility')),
  system_prompt TEXT NOT NULL,
  user_prompt_template TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE prompt_templates ENABLE ROW LEVEL SECURITY;

-- 서버사이드 전용 접근 (admin API에서 requireAdmin 체크)
CREATE POLICY "prompt_templates_all" ON prompt_templates FOR ALL USING (true);
