#!/usr/bin/env bash
# Phase 2 PR verification (works when repo path contains ':' and pnpm exec fails).
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

TSC="${ROOT}/node_modules/.bin/tsc"
NEXT="${ROOT}/node_modules/.bin/next"
ESLINT="${ROOT}/node_modules/.bin/eslint"

run_tsc() {
  echo "→ tsc --noEmit"
  "$TSC" --noEmit
}

run_build() {
  echo "→ next build"
  "$NEXT" build
}

run_validate() {
  echo "→ validate:production"
  VALIDATE_RUN_BUILD=false VALIDATE_RUN_TYPECHECK=false node scripts/validate-production.mjs
}

run_lint() {
  echo "→ eslint"
  "$ESLINT" . "$@"
}

case "${1:-all}" in
  tsc) run_tsc ;;
  build) run_build ;;
  validate) run_validate ;;
  lint) shift; run_lint "$@" ;;
  all)
    run_tsc
    run_build
    run_validate
    ;;
  quick)
    run_tsc
    run_validate
    ;;
  *) echo "usage: $0 {tsc|build|validate|lint|all|quick}" >&2; exit 1 ;;
esac

echo "✓ phase2-check: ${1:-all} passed"