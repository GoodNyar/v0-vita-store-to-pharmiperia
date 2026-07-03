-- Phase 1 task 13: order confirmation email (Resend) — locale + idempotent send tracking

ALTER TABLE orders
  ADD COLUMN locale TEXT NOT NULL DEFAULT 'lv',
  ADD COLUMN confirmation_email_sent_at TIMESTAMPTZ;

ALTER TABLE orders
  ADD CONSTRAINT orders_locale_check CHECK (locale IN ('lv', 'ru'));

COMMENT ON COLUMN orders.locale IS 'Storefront locale at checkout (lv | ru) for transactional emails';
COMMENT ON COLUMN orders.confirmation_email_sent_at IS 'When order confirmation email was sent via Resend';