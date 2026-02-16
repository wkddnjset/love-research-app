-- ============================================
-- Stripe → Paddle 마이그레이션
-- subscriptions 테이블 컬럼 변경
-- ============================================

-- Stripe 컬럼 제거
ALTER TABLE subscriptions DROP COLUMN IF EXISTS stripe_payment_link_id;
ALTER TABLE subscriptions DROP COLUMN IF EXISTS stripe_customer_id;

-- Paddle 컬럼 추가
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS paddle_subscription_id text;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS paddle_customer_id text;
