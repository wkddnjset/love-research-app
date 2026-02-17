-- daily_answers에 UPDATE 정책 추가 (답변 수정 허용)
CREATE POLICY "daily_answers_update_own" ON daily_answers
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
