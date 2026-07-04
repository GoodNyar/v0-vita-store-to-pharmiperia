#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

TAG="v4.0-phase4-complete"
COMMIT="$(git rev-parse --short HEAD)"

if git rev-parse "$TAG" >/dev/null 2>&1; then
  echo "Tag $TAG already exists at $(git rev-parse --short "$TAG")"
  exit 0
fi

git tag -a "$TAG" -m "Phase 4 complete — feature gaps closed

Promo checkout, server cart cutover, search_vector, retention cron.
Commit: $COMMIT

See docs/reports/phase-4-final-summary.md"

echo "Created tag $TAG at $COMMIT"
git show "$TAG" --no-patch