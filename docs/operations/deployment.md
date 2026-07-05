# Deployment

> Vercel + Supabase EU. Pre-deploy: `pnpm validate:production`.

---

## Environments

| Env | Branch/tag | Stripe | Supabase |
|-----|------------|--------|----------|
| Local | any | test keys | `pnpm db:start` |
| Staging | preview / RC tag | test keys | staging project |
| Production | `v1.0.0` | live keys | EU production |

---

## Pre-deploy gate

```bash
pnpm typecheck && pnpm lint && pnpm test && pnpm build
pnpm validate:production
```

Скрипт: `scripts/validate-production.mjs` (ADR-0016).

---

## Vercel

1. Link project: `vercel link`
2. Env vars — см. `.env.example`, [../release/LAUNCH_CHECKLIST.md](../release/LAUNCH_CHECKLIST.md)
3. Deploy: push to main or `vercel deploy --prebuilt`

**Build:** `bash scripts/build.sh` (via `pnpm build`)

---

## Database

```bash
pnpm db:push          # apply migrations to linked project
pnpm db:types:remote  # regenerate types
pnpm db:types:check   # CI drift check
```

23 migrations in `supabase/migrations/`.

---

## RC checkout

```bash
git checkout v1.0.0-rc.1
pnpm install && pnpm build
```

---

## Rollback

- Vercel: promote previous deployment
- DB: migrations are forward-only; use PITR for data ([backups.md](backups.md))