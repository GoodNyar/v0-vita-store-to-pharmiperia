-- Stripe webhook idempotency (ADR-0005)
-- Apply via Supabase SQL editor or supabase db push when CLI migrations are set up.

CREATE TABLE IF NOT EXISTS stripe_webhook_events (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  processed_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE stripe_webhook_events ENABLE ROW LEVEL SECURITY;

-- No policies: only service-role (server/webhook) may read/write.