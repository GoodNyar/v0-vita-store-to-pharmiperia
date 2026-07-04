-- Phase 3 post-audit: prevent concurrent duplicate loyalty earn per order

CREATE UNIQUE INDEX IF NOT EXISTS loyalty_transactions_order_earn_unique
  ON loyalty_transactions (order_id, type)
  WHERE type = 'earn' AND order_id IS NOT NULL;