#!/usr/bin/env bash
# Verify lib/database.types.ts matches supabase/migrations (ADR-0001, ADR-0004).
# Requires: Docker (supabase start) or an already-running local Supabase stack.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

SUPABASE_BIN="${ROOT}/node_modules/.bin/supabase"
TYPES_FILE="${ROOT}/lib/database.types.ts"

if [[ ! -x "$SUPABASE_BIN" ]]; then
  echo "error: supabase CLI not found — run: pnpm install" >&2
  exit 1
fi

if [[ ! -f "$TYPES_FILE" ]]; then
  echo "error: missing ${TYPES_FILE} — run: pnpm db:reset && pnpm db:types" >&2
  exit 1
fi

echo "→ Ensuring local Supabase is running..."
if ! "$SUPABASE_BIN" status >/dev/null 2>&1; then
  echo "→ Starting Supabase (first run may pull images)..."
  "$SUPABASE_BIN" start
fi

echo "→ Resetting database from migrations..."
"$SUPABASE_BIN" db reset --yes

echo "→ Generating types for drift check..."
TMP_TYPES="$(mktemp)"
trap 'rm -f "$TMP_TYPES"' EXIT
"$SUPABASE_BIN" gen types typescript --local > "$TMP_TYPES"

if ! diff -q "$TMP_TYPES" "$TYPES_FILE" >/dev/null 2>&1; then
  echo "error: lib/database.types.ts is out of sync with supabase/migrations" >&2
  echo "       Fix: pnpm db:reset && pnpm db:types && git add lib/database.types.ts" >&2
  diff -u "$TYPES_FILE" "$TMP_TYPES" | head -100 || true
  exit 1
fi

echo "✓ database types are in sync with migrations"