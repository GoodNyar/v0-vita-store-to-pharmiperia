#!/usr/bin/env bash
# Annotated tag for Phase 3 completion baseline (Phase 4 entry point).
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

TAG="v3.0-phase3-complete"
COMMIT="$(git rev-parse --short HEAD)"

if git rev-parse "$TAG" >/dev/null 2>&1; then
  echo "Tag $TAG already exists at $(git rev-parse --short "$TAG")"
  exit 0
fi

git tag -a "$TAG" -m "Phase 3 complete (30/30 PR, pipeline green)

Baseline for Phase 4 — catalog scale, PIM feeds, dedicated search.
Commit: $COMMIT
Branch: $(git branch --show-current)

See docs/reports/phase-3-final-summary.md and phase-4-prerequisites.md"

echo "Created tag $TAG at $COMMIT"
git show "$TAG" --no-patch