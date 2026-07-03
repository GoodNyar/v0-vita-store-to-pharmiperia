-- Phase 2 PR-17: search query logging (no pg_trgm yet)

CREATE TABLE search_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'lv',
  results_count INTEGER NOT NULL DEFAULT 0,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_search_queries_created_at ON search_queries(created_at DESC);
CREATE INDEX idx_search_queries_query ON search_queries(query);

ALTER TABLE search_queries ENABLE ROW LEVEL SECURITY;