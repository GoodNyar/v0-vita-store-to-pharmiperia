#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

git add -A

git commit -m "fix(release): BUGFIX-01 + BUGFIX-01B for v1.0.0-rc.2

BUGFIX-01:
- category locale + notFound; reset password flow
- additive cart merge; reuse draft orders
- placeholder.svg + CatalogImage; Baltic PMs opt-in

BUGFIX-01B (audit 24):
- remove nested LangProvider on 13 routes
- atomic merge_cart_item_atomic RPC + merge guards
- CatalogImage on cart/checkout/favorites/account

Docs: bugfix reports, MASTER_STATUS, RELEASE_CHECKLIST
Migration: 20260706130000_merge_cart_item_atomic.sql"

git tag -a v1.0.0-rc.2 -m "Release Candidate v1.0.0-rc.2

BUGFIX-01 + BUGFIX-01B (audit 24 partial closures).
LV-only RC. 24 migrations. 47/47 tests."

echo "Tagged v1.0.0-rc.2 at $(git rev-parse HEAD)"