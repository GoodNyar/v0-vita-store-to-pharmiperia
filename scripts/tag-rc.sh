#!/usr/bin/env bash
# Tag Release Candidate v1.0.0-rc.1
set -euo pipefail

TAG="v1.0.0-rc.1"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "ERROR: Working tree not clean. Commit first." >&2
  git status --short
  exit 1
fi

if git rev-parse "$TAG" >/dev/null 2>&1; then
  echo "ERROR: Tag $TAG already exists." >&2
  exit 1
fi

git tag -a "$TAG" -m "Release Candidate v1.0.0-rc.1

- Market-aware checkout (audit 22 H-1)
- Unified pricing via applyMarketPricingToCommerceProduct (M-1)
- DB-backed shipping in checkout UI (M-3)
- B-2 documented as LV-only ISR limitation

Pipeline: typecheck 0 / lint 0 errors / test 45/45 / build ok
Target market: Latvia (LV-only)"

echo "Tagged $TAG at $(git rev-parse --short HEAD)"
git show "$TAG" --no-patch