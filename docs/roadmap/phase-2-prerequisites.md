# Phase 2 — Prerequisites

> Подготовительный документ перед стартом Phase 2. **Не изменяет код Phase 2.**  
> Базовая точка: tag **`v1.0-phase1-complete`** (рекомендуется создать локально на `4467ee6` или HEAD после prep-commit).

---

## 1. Обязательно проверить перед стартом Phase 2

### Инженерные гейты (локально)

```bash
pnpm typecheck          # ожидается: 0 errors
pnpm build              # ожидается: success (см. .env.example / CI placeholders)
pnpm validate:production
```

| Проверка | Ожидание |
|----------|----------|
| TypeScript | `exit 0` |
| Production build | `exit 0` |
| `validate:production` | `exit 0`, verdict **CONDITIONAL GO** |
| Git чистота | Phase 1 закоммичен; ветка `main` |

### Ops (если планируется приём заказов параллельно с Phase 2)

| # | Действие | Где |
|---|----------|-----|
| 1 | Домен `pharm.lv` → Vercel, www-редирект | DNS registrar |
| 2 | Resend: verify domain, SPF/DKIM/DMARC | Resend Dashboard |
| 3 | Supabase EU: migrations applied (`pnpm db:push`) | Supabase Dashboard |
| 4 | Stripe **live** keys + webhook `https://pharm.lv/api/webhooks/stripe` | Stripe Dashboard |
| 5 | `SENTRY_DSN` + alert `commerce.checkout=true` | Sentry |
| 6 | Uptime poll `GET /api/health` каждые 1–5 min | UptimeRobot / Better Stack |
| 7 | `E2E_ENABLED=true` smoke на **staging** | Локально / CI secrets |

### Архитектурная готовность

- [ ] Прочитан [Phase 1 Final Summary](phase-1.md)
- [ ] Прочитан [CTO Roadmap Phase 2](CTO-roadmap.md) § недели 4–8
- [ ] Приняты ADR-0004 (data-access) и ADR-0006 (RSC) как **не начинать Phase 3 до завершения Phase 2 scope**
- [ ] Staging environment определён (отдельный Supabase + Stripe test) — **рекомендуется до первого PR Phase 2**

---

## 2. Внешние сервисы — что НЕ подключать на старте Phase 2

Следующие интеграции **намеренно отложены** — не включать «про запас» при разработке Phase 2:

| Сервис | Почему не сейчас | Когда |
|--------|------------------|-------|
| **GA4 / PostHog** | Первая задача Phase 2 — спроектировать события поверх webhook | Phase 2 (аналитика) |
| **OpenAI (prod)** | AI выключен ADR-0013; recommendations → Phase 3 | Phase 3 AI v2 |
| **Meilisearch / Typesense** | Триггер: >5–10k SKU | Phase 4 |
| **Inngest / очереди** | Нужен каркас после admin + commerce layer | Phase 3 |
| **Банклинки SEB/Swedbank/…** | Отдельная задача Phase 2 после live Stripe | Phase 2 payments |
| **Helpdesk / Intercom** | Phase 3 | Phase 3 |
| **Мобильное приложение** | Нет Storefront API | Phase 5 |

**Можно использовать в dev/staging (не prod) для Phase 2 работы:**

- Supabase **test** project
- Stripe **test** mode
- Resend **test** API key
- Turnstile **test** keys (уже в `.env.example`)
- Upstash Redis (для rate limit в preview)

---

## 3. ENV — что должно существовать

### Обязательные для локальной разработки Phase 2

| Variable | Назначение |
|----------|------------|
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` или staging URL |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server writes (orders, webhooks) — **never client** |
| `STRIPE_SECRET_KEY` | `sk_test_…` на dev |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_…` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_…` (Stripe CLI `listen` локально) |

### Рекомендуемые для полного Phase 2 dev

| Variable | Назначение |
|----------|------------|
| `SUPABASE_PROJECT_ID` | `pnpm db:types:remote` |
| `RESEND_API_KEY` | Order emails (task 13) |
| `EMAIL_ENABLED` | `true` на staging для теста писем |
| `UPSTASH_REDIS_REST_URL` / `TOKEN` | Rate limit multi-instance |
| `RATE_LIMIT_ENABLED` | `true` на preview/prod |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | Auth CAPTCHA |
| `SENTRY_DSN` / `NEXT_PUBLIC_SENTRY_DSN` | На staging/preview |
| `MONITORING_HEALTH_TOKEN` | Deep health check |

### Опциональные / выключены по умолчанию

| Variable | Default policy |
|----------|----------------|
| `NEXT_PUBLIC_AI_RECOMMENDATIONS_ENABLED` | **false** — не включать до Phase 3 |
| `NEXT_PUBLIC_AI_CHAT_ENABLED` | **false** |
| `OPENAI_API_KEY` | Не задавать без явной задачи |
| `E2E_ENABLED` | `true` только на staging / локально с keys |
| `STRIPE_TAX_ENABLED` | `true` когда Stripe Tax настроен в Dashboard |

Полный список: [`.env.example`](../../.env.example).

---

## 4. Архитектурные ограничения Phase 1 для Phase 2

Следующие решения **нельзя нарушать** без нового ADR:

### Деньги и заказы

| ADR | Ограничение |
|-----|-------------|
| **ADR-0002** | Все суммы — `Money` (центы + `EUR`); float запрещён |
| **ADR-0005** | Факт оплаты — **только** Stripe webhook; UI не ставит `paid` |
| **ADR-0008** | Цены tax-inclusive; PVN 21% через Stripe Tax |

### URL и i18n

| ADR | Ограничение |
|-----|-------------|
| **ADR-0003** | Локаль в пути (`/lv`, `/ru`); слаги товаров, не numeric ID |
| **ADR-0007** | Контент в БД — цель; пока UI-словари в `lib/i18n.tsx` |

### Данные

| ADR | Ограничение |
|-----|-------------|
| **ADR-0001** | Каталог в Supabase — источник истины; `lib/data.ts` — legacy до миграции B6 |
| **ADR-0004** | Новые запросы к БД — через `lib/commerce`; прямой `createClient()` в компонентах запрещён |

### Безопасность и ops

| ADR | Ограничение |
|-----|-------------|
| **ADR-0009** | Cookie consent обязателен; удаление аккаунта реализовано |
| **ADR-0010** | Checkout errors → Sentry tag `commerce.checkout` |
| **ADR-0011** | Публичные API (`/api/chat`, `/api/recommendations`) — rate limit |
| **ADR-0012** | Auth — Turnstile verify server-side |
| **ADR-0013** | AI opt-in only; budget cap на сервере |
| **ADR-0014** | `/api/health` — контракт uptime-монитора |
| **ADR-0015** | E2E smoke path — не ломать без обновления spec |
| **ADR-0016** | `validate:production` — регрессия перед релизом |

### Домен

- Production host **только** через `NEXT_PUBLIC_SITE_URL` (`lib/site.ts`).
- Хардкод `pharm.lv` / `pharmiperia.lv` в source — запрещён.

### Playbook

- `ignoreBuildErrors` — MUST NOT вернуть.
- Провайдеры (Cart, Lang, Auth) — один раз в root layout; не дублировать на новых страницах Phase 2.
- `"use client"` на страницах — исключение; новые витринные страницы — RSC-first (Phase 2 SEO).

---

## 5. Рекомендуемый порядок старта Phase 2

1. Создать локальный tag: `git tag -a v1.0-phase1-complete -m "Phase 1 complete (22/22)"`
2. Ветка `phase-2` или stacked PRs от `main`
3. Первая инженерная задача по Roadmap: **аналитика** или **`lib/commerce`** (ADR-0004) — по приоритету владельца продукта; оба не блокируют друг друга, но admin зависит от commerce layer
4. Параллельно ops-чеклист §1 — если нужен live трафик

---

## 6. Критерий «можно начинать Phase 2»

- ✅ Phase 1 summary и prerequisites прочитаны
- ✅ `typecheck` + `build` + `validate:production` зелёные
- ✅ Tag `v1.0-phase1-complete` создан (локально)
- ✅ Staging Supabase + Stripe test определены
- ⬜ Ops для prod — по необходимости, не блокирует разработку Phase 2