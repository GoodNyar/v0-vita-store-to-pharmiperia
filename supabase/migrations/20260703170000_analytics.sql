-- ADR-0017: server analytics events + UTM attribution on orders

ALTER TABLE orders
  ADD COLUMN utm_source TEXT,
  ADD COLUMN utm_medium TEXT,
  ADD COLUMN utm_campaign TEXT,
  ADD COLUMN analytics_event_id UUID;

CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  properties JSONB NOT NULL DEFAULT '{}'::jsonb,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_analytics_events_order_id ON analytics_events(order_id);
CREATE INDEX idx_analytics_events_event_name ON analytics_events(event_name);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at DESC);

ALTER TABLE orders
  ADD CONSTRAINT orders_analytics_event_id_fkey
  FOREIGN KEY (analytics_event_id) REFERENCES analytics_events(id) ON DELETE SET NULL;

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;