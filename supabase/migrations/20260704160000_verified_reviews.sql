-- Phase 3 PR-12: Verified purchase reviews (links review to paid order)
-- Note: is_verified_purchase already exists in baseline; do not duplicate.

ALTER TABLE reviews
  ADD COLUMN IF NOT EXISTS order_id UUID REFERENCES orders(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS reviews_order_id_idx ON reviews(order_id) WHERE order_id IS NOT NULL;