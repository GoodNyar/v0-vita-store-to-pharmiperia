# Backups

> Supabase managed Postgres (EU region).

---

## Supabase

- **Daily backups** — включены на Pro plan
- **PITR** — point-in-time recovery (если включено в проекте)
- Проверить в Supabase Dashboard → Database → Backups

---

## Critical tables

`orders`, `order_items`, `products`, `profiles`, `stripe_webhook_events`

---

## Restore procedure

1. Supabase Dashboard → restore to new project or PITR
2. Update `NEXT_PUBLIC_SUPABASE_URL` + keys in Vercel
3. Verify `/api/health` + test order read

---

## Code / config

- Git tags (`v1.0.0-rc.1`) — reproducible deploys
- Migrations in `supabase/migrations/` — schema source of truth