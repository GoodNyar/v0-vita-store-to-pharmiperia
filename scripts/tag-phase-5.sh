#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

TAG="v5.0-phase5-complete"
COMMIT="$(git rev-parse --short HEAD)"

git tag -fa "$TAG" -m "Phase 5 complete — catalog foundation

Variants, PIM staging, inventory reservations, SQL search facets, keyset pagination, sitemap shards.
Commit: $COMMIT

See docs/reports/phase-5-final-summary.md"

echo "Updated tag $TAG at $COMMIT"
git show "$TAG" --no-patch