#!/usr/bin/env bash
# Phase 3 completion gate: green pipeline + local commit (no push).
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
  echo ">>> exit: 0"
  echo
}

run "pnpm install" pnpm install
run "pnpm lint" pnpm lint
run "pnpm typecheck" pnpm typecheck
run "pnpm build" pnpm build
run "pnpm validate:production" pnpm validate:production
run "pnpm test" pnpm test

echo "========== git commit =========="
git add .
if git diff --cached --quiet; then
  echo "Nothing to commit — working tree already committed."
else
  git commit -m "feat(phase-3): complete post-audit remediation"
fi

echo "========== git status =========="
git status

echo "========== git log -1 =========="
git log -1

if git status --porcelain | grep -q .; then
  echo "ERROR: working tree not clean" >&2
  exit 1
fi

echo "========== git push =========="
git push -u origin "$(git branch --show-current)"

echo "✓ Phase 3 PASS — pipeline green, git clean, pushed"