# Phase 1 — Final Summary

> Дата закрытия: 2026-07-03 · Репозиторий: `pharmiperia-lv-update` · Диапазон: `94021ab`…`4467ee6`  
> Рекомендуемый Git tag (локально, без push): **`v1.0-phase1-complete`**

## Итог

| Метрика | Значение |
|---------|----------|
| Задач Phase 1 | **22 / 22 (100%)** |
| Коммитов Phase 1 (после init) | 17 |
| Вердикт инженерии | **CONDITIONAL GO** |
| Вердикт запуска (ops) | DNS / live Stripe / SMTP verify — вручную |

---

## Выполненные задачи (22)

| # | Задача | Коммит(ы) |
|---|--------|-----------|
| 1 | Git Repository | `94021ab` |
| 2 | CI/CD | `65f3a11` |
| 3 | Production build (typecheck) | `d1267cd` |
| 4 | Stripe lazy init | `c1ba2ec` |
| 5 | Stripe Webhook | `c1ba2ec` |
| 6 | Server Orders | `c1ba2ec` |
| 7 | Price Validation | `c1ba2ec` |
| 8 | Supabase Migration | `e82f081` |
| 9 | Catalog Database (seed) | `fc36423` |
| 10 | Money Type (ADR-0002) | `7f6e418` |
| 11 | URL Slugs + Localization (ADR-0003) | `b4b06c6` |
| 12 | Stripe Tax / PVN 21% (ADR-0008) | `ad2c513` |
| 13 | Order Emails (Resend) | `969b646` |
| 14 | Site env + Auth SMTP | `d16a3ae` |
| 15 | GDPR minimum (ADR-0009) | `0061260` |
| 16 | Sentry + error boundaries (ADR-0010) | `f59cc37` |
| 17 | Rate limiting (ADR-0011) | `36dd5a1` |
| 18 | CAPTCHA Turnstile (ADR-0012) | `c7ad982` |
| 19 | AI Protection (ADR-0013) | `69c3cae` |
| 20 | Monitoring health (ADR-0014) | `268d8d4` |
| 21 | Playwright e2e smoke (ADR-0015) | `1d3e2da` |
| 22 | Production Validation (ADR-0016) | `4467ee6` |

---

## Созданные файлы (79)

```
.env.example
.github/workflows/ci.yml
app/[locale]/account/orders/page.tsx
app/[locale]/checkout/error.tsx
app/[locale]/cookies/page.tsx
app/[locale]/error.tsx
app/[locale]/layout.tsx
app/actions/account.ts
app/actions/auth.ts
app/api/health/route.ts
app/api/webhooks/stripe/route.ts
app/global-error.tsx
app/not-found.tsx
components/auth-captcha.tsx
components/consent-gated-analytics.tsx
components/cookie-consent-banner.tsx
components/locale-html-lang.tsx
components/route-error.tsx
components/turnstile-widget.tsx
docs/adr/0008-stripe-tax-pvn-21-inclusive.md
docs/adr/0009-gdpr-minimum-phase-1.md
docs/adr/0010-sentry-error-boundaries-checkout-alerts.md
docs/adr/0011-rate-limit-api-endpoints.md
docs/adr/0012-captcha-auth-turnstile.md
docs/adr/0013-ai-protection-phase-1.md
docs/adr/0014-monitoring-health-budget-alerts.md
docs/adr/0015-playwright-e2e-checkout-smoke.md
docs/adr/0016-phase-1-production-validation.md
docs/reports/audits/11-phase-1-production-validation.md
e2e/checkout.spec.ts
e2e/helpers/consent.ts
e2e/helpers/env.ts
e2e/helpers/supabase.ts
eslint.config.mjs
instrumentation-client.ts
instrumentation.ts
lib/account/delete-user.ts
lib/ai/budget.ts
lib/ai/guard.ts
lib/ai/validate.ts
lib/captcha/shared.ts
lib/captcha/turnstile.ts
lib/catalog-seed.ts
lib/commerce/redirects.ts
lib/commerce/slugs.ts
lib/consent/storage.ts
lib/consent/types.ts
lib/email/config.ts
lib/email/order-confirmation-copy.ts
lib/email/order-confirmation.ts
lib/email/resend.ts
lib/features/ai.ts
lib/i18n/config.ts
lib/i18n/routes.ts
lib/money.ts
lib/monitoring/budget-alerts.ts
lib/monitoring/health.ts
lib/orders.ts
lib/rate-limit/identify.ts
lib/rate-limit/index.ts
lib/rate-limit/memory.ts
lib/sentry/capture-checkout.ts
lib/sentry/shared.ts
lib/site.ts
lib/stripe/money.ts
lib/stripe/tax.ts
lib/supabase/admin.ts
playwright.config.ts
scripts/validate-production.mjs
sentry.edge.config.ts
sentry.server.config.ts
supabase/.gitignore
supabase/config.toml
supabase/generate-seed.ts
supabase/migrations/20260703140000_money_minor_units.sql
supabase/migrations/20260703150000_order_tax.sql
supabase/migrations/20260703160000_order_confirmation_email.sql
supabase/seed.sql
```

---

## Изменённые файлы (27)

```
.gitignore
app/actions/stripe.ts
app/api/chat/route.ts
app/api/recommendations/route.ts
app/auth/callback/route.ts
app/layout.tsx
app/robots.ts
app/sitemap.ts
components/ai-recommendations.tsx
components/brand-strip.tsx
components/cart-context.tsx
components/cart-drawer.tsx
components/favorites-provider.tsx
components/hero-banner.tsx
components/live-chat.tsx
components/org-json-ld.tsx
components/product-card.tsx
components/site-footer.tsx
components/site-header.tsx
components/stripe-checkout.tsx
docs/adr/README.md
docs/reports/README.md
lib/data.ts
lib/i18n.tsx
lib/stripe.ts
lib/supabase/proxy.ts
middleware.ts
next-env.d.ts
next.config.mjs
package.json
pnpm-lock.yaml
pnpm-workspace.yaml
```

---

## Удалённые файлы (6)

```
app/account/orders/page.tsx
components/quick-view-modal.tsx
scripts/001_create_tables.sql
scripts/002_rls_triggers.sql
scripts/003_add_profile_columns.sql
scripts/004_add_profile_address_columns.sql
```

---

## Переименованные / перемещённые (38 пар)

Витрина и аккаунт перенесены под `app/[locale]/`; схема БД — в `supabase/migrations/`.

| Было | Стало |
|------|-------|
| `app/page.tsx` | `app/[locale]/page.tsx` |
| `app/checkout/page.tsx` | `app/[locale]/checkout/page.tsx` |
| `app/products/[id]/page.tsx` | `app/[locale]/products/[slug]/page.tsx` |
| `app/products/[id]/layout.tsx` | `app/[locale]/products/[slug]/layout.tsx` |
| `app/category/[slug]/page.tsx` | `app/[locale]/category/[slug]/page.tsx` |
| `app/search/page.tsx` | `app/[locale]/search/page.tsx` |
| `app/auth/login/page.tsx` | `app/[locale]/auth/login/page.tsx` |
| `app/auth/sign-up/page.tsx` | `app/[locale]/auth/sign-up/page.tsx` |
| `app/account/page.tsx` | `app/[locale]/account/page.tsx` |
| … (+29 страниц контента/аккаунта с similarity 96–100%) | `app/[locale]/…` |
| `scripts/001_create_schema.sql` | `supabase/migrations/20260703120000_baseline.sql` |

Полный список пар: `git diff --name-status 94021ab..HEAD | grep '^R'`.

---

## ADR (Architecture Decision Records)

| # | Документ | Phase 1 |
|---|----------|---------|
| 0000 | `0000-adr-template.md` | шаблон |
| 0001 | `0001-edinyj-istochnik-kataloga-supabase.md` | принят (частично: seed, витрина ещё `lib/data.ts`) |
| 0002 | `0002-dengi-v-minornyh-edinicah.md` | ✅ реализован |
| 0003 | `0003-slagi-i-lokal-v-url.md` | ✅ реализован |
| 0004 | `0004-data-access-sloj-lib-commerce.md` | принят → Phase 2 |
| 0005 | `0005-stripe-webhook-istochnik-fakta-oplaty.md` | ✅ реализован |
| 0006 | `0006-rendering-rsc-first-isr.md` | принят → Phase 3 |
| 0007 | `0007-i18n-namespace-slovari-i-perevody-kontenta.md` | принят → Phase 2+ |
| 0008 | `0008-stripe-tax-pvn-21-inclusive.md` | ✅ реализован |
| 0009 | `0009-gdpr-minimum-phase-1.md` | ✅ реализован |
| 0010 | `0010-sentry-error-boundaries-checkout-alerts.md` | ✅ реализован |
| 0011 | `0011-rate-limit-api-endpoints.md` | ✅ реализован |
| 0012 | `0012-captcha-auth-turnstile.md` | ✅ реализован |
| 0013 | `0013-ai-protection-phase-1.md` | ✅ реализован |
| 0014 | `0014-monitoring-health-budget-alerts.md` | ✅ реализован |
| 0015 | `0015-playwright-e2e-checkout-smoke.md` | ✅ реализован |
| 0016 | `0016-phase-1-production-validation.md` | ✅ реализован |

---

## Новые npm scripts (11)

Добавлены относительно `94021ab` (было только `dev`, `build`, `start`, `lint`):

| Скрипт | Назначение |
|--------|------------|
| `typecheck` | `tsc --noEmit` |
| `db:start` | Локальный Supabase (Docker) |
| `db:stop` | Остановка Supabase |
| `db:reset` | Миграции + seed |
| `db:push` | Push миграций на remote |
| `db:types` | `supabase gen types` (local) |
| `db:types:remote` | `supabase gen types` (cloud) |
| `db:seed:generate` | Регенерация `seed.sql` из `lib/data.ts` |
| `test:e2e` | Playwright |
| `test:e2e:ui` | Playwright UI mode |
| `test:e2e:install` | Установка Chromium |
| `validate:production` | Phase 1 gates (`scripts/validate-production.mjs`) |

---

## GitHub Actions

| Workflow | Файл | Триггер |
|----------|------|---------|
| **CI** | `.github/workflows/ci.yml` | `push` / `pull_request` → `main` |

Job: `quality` (ubuntu-latest, Node 22, pnpm 9, timeout 15 min).

---

## CI-проверки

| Шаг | Команда | Блокирует merge |
|-----|---------|-----------------|
| Install | `pnpm install --frozen-lockfile` | да |
| Typecheck | `pnpm run typecheck` | да |
| Lint | `pnpm run lint` | да* |
| Build | `pnpm run build` (CI env placeholders) | да |
| Production validation | `pnpm run validate:production` (static only: `VALIDATE_RUN_BUILD=false`, `VALIDATE_RUN_TYPECHECK=false`) | да |

\*Lint в CI настроен, но локально **43 errors** — известный техдолг Phase 2; build и typecheck проходят.

CI env placeholders: `NEXT_PUBLIC_SITE_URL`, Stripe, Supabase keys (см. `ci.yml`).

---

## Production validation checks (`pnpm validate:production`)

### Pass (обязательные, 33 при полном прогоне)

| ID | Проверка |
|----|----------|
| `ci-workflow` | `.github/workflows/ci.yml` существует |
| `env-example` | `.env.example` существует |
| `no-ignore-build-errors` | Нет `ignoreBuildErrors` в `next.config.mjs` |
| `stripe-webhook` | `app/api/webhooks/stripe/route.ts` |
| `health-endpoint` | `app/api/health/route.ts` |
| `orders-module` | `lib/orders.ts` |
| `money-module` | `lib/money.ts` |
| `site-env-config` | `lib/site.ts` |
| `rate-limit` | `lib/rate-limit/index.ts` |
| `captcha` | `lib/captcha/turnstile.ts` |
| `sentry-checkout` | `lib/sentry/capture-checkout.ts` |
| `monitoring-health` | `lib/monitoring/health.ts` |
| `ai-flags` | `lib/features/ai.ts` |
| `cookie-consent` | `components/cookie-consent-banner.tsx` |
| `playwright-config` | `playwright.config.ts` |
| `e2e-checkout` | `e2e/checkout.spec.ts` |
| `locale-error-boundary` | `app/[locale]/error.tsx` |
| `checkout-error-boundary` | `app/[locale]/checkout/error.tsx` |
| `supabase-baseline` | `supabase/migrations/20260703120000_baseline.sql` |
| `supabase-seed` | `supabase/seed.sql` |
| `adr-index` | ≥ 15 ADR в `docs/adr/` |
| `no-legacy-domain-hardcode` | Нет `pharmiperia.lv` в app/lib source |
| `site-url-env-driven` | `lib/site.ts` → `NEXT_PUBLIC_SITE_URL` |
| `ai-opt-in-flags` | AI только при `NEXT_PUBLIC_*=true` |
| `env-doc-*` | `.env.example` документирует 7 ключевых переменных |
| `typecheck` | `tsc --noEmit` (если не отключён) |
| `production-build` | `next build` (если не отключён) |

### Warnings (не блокируют exit 0)

| ID | Описание |
|----|----------|
| `image-unoptimized` | `images.unoptimized: true` в `next.config.mjs` |
| `eslint-debt` | ESLint может иметь ошибки |
| `ops-domain-dns` | DNS / MX / SPF / DKIM / DMARC для `pharm.lv` |
| `ops-stripe-live` | Live Stripe + webhook URL |
| `ops-uptime-monitor` | Внешний poll `/api/health` |
| `ops-e2e-staging` | E2E на staging с test keys |
| `ops-sentry-dsn` | Sentry DSN в production env |

---

## Финальная верификация (2026-07-03)

| Проверка | Результат |
|----------|-----------|
| `tsc --noEmit` | ✅ 0 errors (`exit 0`) |
| `next build` | ✅ success (`exit 0`) |
| `validate:production` | ✅ 33 passed, 7 warnings, 0 failed — **CONDITIONAL GO** (`exit 0`) |
| `eslint .` | ⚠️ 88 problems (43 errors, 45 warnings) — техдолг |

---

## Известные warnings

1. `images.unoptimized: true` — LCP на мобильных (Playbook §8).
2. ESLint 43 errors — не блокирует build/typecheck.
3. Ops: DNS, live Stripe, uptime SaaS, Sentry DSN, e2e на staging — не в репозитории.
4. E2E в CI пропускается без `E2E_ENABLED=true`.
5. Rate limit in-memory fallback без Upstash — не multi-instance safe.
6. `EMAIL_ENABLED=false` по умолчанию — письма только при явном включении.
7. AI chat/recommendations выключены по умолчанию (ADR-0013).

---

## Технический долг после Phase 1

| Severity | Issue | Рекомендуемая фаза |
|----------|-------|-------------------|
| Medium | ESLint 43 errors в CI job `lint` | Phase 2 |
| Medium | `images.unoptimized: true` | Phase 2 |
| Medium | Витрина читает `lib/data.ts`, не Supabase (ADR-0001 partial) | Phase 2 (`lib/commerce`) |
| Medium | Дубли `CartProvider` на отдельных страницах | Phase 2 cleanup |
| Low | Нет `loading.tsx` на многих route-сегментах | Phase 2 |
| Low | hreflang не реализован | Phase 2 SEO |
| Low | Банклинки в футере без реализации в чекауте | Phase 2 |
| Low | `pnpm-workspace.yaml` — артефакт монорепо | Phase 2 cleanup |
| Low | Unit-тесты `lib/money` отсутствуют | Phase 2 |

---

## Сознательно перенесено в Phase 2 и далее

### Phase 2 (Roadmap § недели 4–8)

- GA4/PostHog + серверный `purchase` из webhook
- Полный набор транзакционных писем (2 языка)
- Банковские линки Латвии в чекауте
- Процесс возвратов
- **Data-access `lib/commerce`** + `supabase gen types` в CI (ADR-0004)
- Admin v0 (`/admin`, RLS admin, заказы, сток)
- Декремент стока в webhook
- Синтетический e2e по крону
- Search Console, контент → RSC, hreflang
- a11y quick wins (focus trap, клавиатурные меню)
- ESLint зелёный в CI, чистка мёртвого кода

### Phase 3+

- RSC/ISR витрина (ADR-0006)
- Серверная корзина, событийный каркас (Inngest/Queues)
- Брошенные корзины, промо, лояльность, отзывы verified
- Admin v1, поиск v1 (pg_trgm), AI v2
- Полный e2e-набор в CI

### Phase 4–5 (по триггерам)

- PIM/фиды, 100k SKU, Meilisearch
- Market model, мультивалютность, мобильное приложение

---

## Связанные документы

- [Phase 2 Prerequisites](phase-2-prerequisites.md)
- [Production Validation (task 22)](11-phase-1-production-validation.md)
- [CTO Roadmap](CTO-roadmap.md)
- [Engineering Playbook](../architecture/ENGINEERING_PLAYBOOK.md)
- [ADR index](../adr/README.md)