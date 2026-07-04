-- Phase 3 PR-14: Admin audit log

CREATE TABLE admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX admin_audit_log_created_at_idx ON admin_audit_log(created_at DESC);
CREATE INDEX admin_audit_log_entity_idx ON admin_audit_log(entity_type, entity_id);

ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_audit_log_admin_select" ON admin_audit_log
  FOR SELECT
  USING (is_admin());

CREATE POLICY "admin_audit_log_admin_insert" ON admin_audit_log
  FOR INSERT
  WITH CHECK (is_admin());