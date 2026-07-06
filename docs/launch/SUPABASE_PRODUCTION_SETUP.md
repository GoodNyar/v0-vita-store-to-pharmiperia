# Supabase Production Setup — Pharmiperia

> **Region:** EU (Frankfurt, `eu-central-1`) — GDPR requirement  
> **Migrations:** 24 SQL files in `supabase/migrations/`

---

## 1. Создать production project

1. [supabase.com/dashboard](https://supabase.com/dashboard) → **New Project**
2. **Organization:** Pharmiperia (или personal)
3. **Name:** `pharmiperia-production`
4. **Database Password:** сгенерировать сильный → **сохранить в password manager**
5. **Region:** **Europe (Frankfurt) — eu-central-1** ✅
6. **Pricing:** Pro recommended (daily backups, no pause)

### Keys

Project → **Settings → API**:

| Key | Env var |
|-----|---------|
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` |
| `anon` `public` | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| `service_role` `secret` | `SUPABASE_SERVICE_ROLE_KEY` |

> `service_role` — **только server-side** (Vercel env, never `NEXT_PUBLIC_`).

---

## 2. Применить 25 миграций

### Option A — Supabase CLI (рекомендуется)

```bash
# Install CLI if needed
pnpm add -g supabase

# Link project
supabase login
supabase link --project-ref <project-ref>

# Push all migrations
supabase db push
```

### Option B — SQL Editor (manual)

1. Dashboard → **SQL Editor**
2. Выполнить каждый файл из `supabase/migrations/` **в хронологическом порядке** (по timestamp в имени файла)
3. Всего: **25 migrations**

### Verify migrations

```sql
-- In SQL Editor
SELECT count(*) FROM supabase_migrations.schema_migrations;
-- Expected: 24

SELECT version FROM supabase_migrations.schema_migrations
ORDER BY version;
```

Или:

```bash
supabase migration list
```

### Ключевые миграции (для справки)

| Migration | Назначение |
|-----------|------------|
| `*_create_schema` | Tables: products, orders, cart, profiles |
| `*_rls_*` | Row Level Security policies |
| `*_stripe_webhook_events` | Webhook idempotency |
| `*_merge_cart_item_atomic` | Cart merge RPC (BUG-003B) |

---

## 3. Seed каталога

### Option A — seed script

```bash
# If project has seed command
pnpm db:seed
# or
supabase db seed
```

### Option B — SQL seed

1. SQL Editor → выполнить seed file (если есть в `supabase/seed.sql` или `scripts/`)
2. Проверить:

```sql
SELECT count(*) FROM products WHERE is_active = true;
-- Expected: > 0 for launch
```

### Option C — Admin import

Если есть admin panel — import catalog CSV.

### Images

Product images: `public/images/products/` — загрузить через deploy или Supabase Storage (если используется).

**Проверка:** открыть `https://pharm.lv/lv/products/<slug>` — image loads (не placeholder).

---

## 4. RLS verification

### Smoke tests (SQL Editor, as authenticated user via API preferred)

| Table | Test | Expected |
|-------|------|----------|
| `profiles` | User A reads own profile | ✅ Own data only |
| `profiles` | User A reads User B profile | ❌ Denied |
| `orders` | User reads own orders | ✅ Own orders |
| `orders` | Guest order via service role | ✅ Webhook can write |
| `cart_items` | User reads own cart | ✅ Own cart |
| `products` | Anonymous read active products | ✅ Public read |

### CLI RLS test (if available)

```bash
pnpm test -- --grep rls
```

### Manual API test

1. Register test user on staging/production
2. Create order → verify visible in `/account/orders`
3. Login as different user → order NOT visible

---

## 5. Auth redirect URLs

Dashboard → **Authentication → URL Configuration**:

| Setting | Value |
|---------|-------|
| Site URL | `https://pharm.lv` |
| Redirect URLs | `https://pharm.lv/auth/callback` |
| | `https://pharm.lv/**` (wildcard for locales) |

### Locale-aware redirects

Приложение использует:

```
/auth/callback?next=/{locale}/auth/update-password
```

Добавить в Redirect URLs:

```
https://pharm.lv/lv/auth/update-password
https://pharm.lv/ru/auth/update-password
https://pharm.lv/auth/callback
```

Или wildcard: `https://pharm.lv/**`

---

## 6. Reset password URL

### Проверка flow

1. `https://pharm.lv/lv/auth/forgot-password`
2. Enter registered email
3. Email from `noreply@pharm.lv` (via Resend SMTP)
4. Link format: `https://pharm.lv/auth/callback?token=...&type=recovery&next=/lv/auth/update-password`
5. Redirect to update password page
6. Set new password → login works

### Supabase email template

Dashboard → **Authentication → Email Templates → Reset Password**:

- Confirm redirect URL uses `{{ .SiteURL }}/auth/callback?next=/lv/auth/update-password`

Or use app's custom SMTP template if configured.

---

## 7. Auth SMTP (Resend)

См. [RESEND_SETUP.md](./RESEND_SETUP.md) — Supabase SMTP section.

---

## 8. Backup settings

### Pro plan (рекомендуется)

Project → **Settings → Database → Backups**:

| Setting | Value |
|---------|-------|
| Daily backups | ✅ Enabled (automatic on Pro) |
| Point-in-time recovery | ✅ Enable (Pro) |
| Retention | 7 days minimum |

### Free plan

- Manual exports: **Database → Backups → Download**
- Schedule weekly manual `pg_dump` via CLI:

```bash
supabase db dump -f backup-$(date +%Y%m%d).sql
```

### Pre-launch backup

Перед go-live:

```bash
supabase db dump -f pre-launch-backup.sql
```

Сохранить файл в secure storage.

---

## 9. Connection pooling (production)

Dashboard → **Settings → Database → Connection Pooling**:

- Enable **Supavisor** (transaction mode for serverless)
- Connection string for serverless: port `6543` (if using direct DB connection — rare in this app)

> Pharmiperia uses Supabase JS client (REST), not direct Postgres — pooling less critical but good practice.

---

## 10. Production blockers (Supabase)

| Blocker | Severity |
|---------|----------|
| Project not in EU region | 🔴 GDPR |
| Migrations < 24 | 🔴 Schema mismatch |
| RLS not enabled on user tables | 🔴 Security |
| Auth redirect URLs missing `pharm.lv` | 🔴 Auth broken |
| No `service_role` in Vercel | 🔴 Webhook fulfillment fails |
| Empty product catalog at go-live | 🟠 Business (not infra) |

---

## Статус

| Пункт | Статус |
|-------|--------|
| EU project created | ⬜ Не выполнено |
| 25 migrations applied | ⬜ Не выполнено |
| Catalog seeded | ⬜ Не выполнено |
| RLS smoke test pass | ⬜ Не выполнено |
| Auth URLs configured | ⬜ Не выполнено |
| Reset password flow tested | ⬜ Не выполнено |
| Backups enabled | ⬜ Не выполнено |
| Keys in Vercel Production | ⬜ Не выполнено |
