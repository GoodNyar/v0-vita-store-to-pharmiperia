-- PR-22: columns for shipped + refund transactional emails (idempotent sends)

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS tracking_number TEXT,
  ADD COLUMN IF NOT EXISTS shipped_email_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS refund_notice_sent_at TIMESTAMPTZ;

COMMENT ON COLUMN orders.tracking_number IS 'Carrier tracking number; may be set before shipped email';
COMMENT ON COLUMN orders.shipped_email_sent_at IS 'Idempotency marker for order shipped email';
COMMENT ON COLUMN orders.refund_notice_sent_at IS 'Idempotency marker for refund notice email';