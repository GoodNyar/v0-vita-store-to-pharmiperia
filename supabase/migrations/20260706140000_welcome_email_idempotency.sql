ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS welcome_email_sent_at TIMESTAMPTZ;

COMMENT ON COLUMN profiles.welcome_email_sent_at IS
  'Atomic idempotency marker for the post-confirmation welcome email';
