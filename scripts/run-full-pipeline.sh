#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

export NEXT_PUBLIC_SITE_URL="${NEXT_PUBLIC_SITE_URL:-https://pharm.lv}"
export STRIPE_SECRET_KEY="${STRIPE_SECRET_KEY:-sk_test_ci_placeholder}"
export STRIPE_WEBHOOK_SECRET="${STRIPE_WEBHOOK_SECRET:-whsec_ci_placeholder}"
export NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="${NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:-pk_test_ci_placeholder}"
export NEXT_PUBLIC_SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL:-https://placeholder.supabase.co}"
export NEXT_PUBLIC_SUPABASE_ANON_KEY="${NEXT_PUBLIC_SUPABASE_ANON_KEY:-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ci_placeholder}"
export SUPABASE_SERVICE_ROLE_KEY="${SUPABASE_SERVICE_ROLE_KEY:-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ci_service_role_placeholder}"

run() {
  echo "========== $1 =========="
  shift
  "$@"
  echo ">>> exit: $?"
  echo
}

run "pnpm install" pnpm install
run "pnpm lint" pnpm lint
run "pnpm typecheck" pnpm typecheck
run "pnpm build" pnpm build
run "pnpm validate:production" pnpm validate:production
run "pnpm test" pnpm test

echo "✓ full pipeline passed"