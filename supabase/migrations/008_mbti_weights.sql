-- MBTI 차원별 가중치 저장 (E/I, N/S, F/T, J/P 각 0~4)
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS mbti_weights SMALLINT[];
