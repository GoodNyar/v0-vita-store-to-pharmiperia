#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

TAG="v6.0-phase6-complete"
COMMIT="$(git rev-parse --short HEAD)"

git tag -fa "$TAG" -m "Phase 6 complete — international foundation

Markets (LV/LT/EE), price lists, Storefront API v1, OSS prep, carriers seed, geo-routing.
Commit: $COMMIT

See docs/roadmap/phase-6.md"

echo "Updated tag $TAG at $COMMIT"
git show "$TAG" --no-patch