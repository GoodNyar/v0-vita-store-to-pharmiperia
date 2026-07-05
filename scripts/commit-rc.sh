#!/usr/bin/env bash
# Commit Release Candidate v1.0.0-rc.1 changes and create tag.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "=== git status ==="
git status --short

echo ""
echo "=== staging all changes ==="
git add -A

if git diff --cached --quiet; then
  echo "Nothing to commit."
else
  git commit -m "$(cat <<'EOF'
release(rc): v1.0.0-rc.1 — market-aware checkout and RC docs

Audit 22 P0:
- resolveMarketFromCookies on checkout/order path
- applyMarketPricingToCommerceProduct as single pricing source
- DB-backed shipping options in checkout UI

Audit 23:
- B-1: release artifact committed
- B-2: ISR vs market display documented as LV-only limitation

Docs: MASTER_STATUS, LAUNCH_CHECKLIST, KNOWN_LIMITATIONS, release notes
Pipeline: typecheck 0 / lint 0 errors / test 45/45 / build ok
EOF
)"
fi

bash scripts/tag-rc.sh

echo ""
echo "=== final state ==="
git status
echo ""
git log --oneline -1
echo ""
git tag -l 'v1.0.0-rc.1' -n9
echo ""
echo "HEAD hash: $(git rev-parse HEAD)"