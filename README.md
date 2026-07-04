# Pharmiperia — интернет-аптека (Латвия)

Next.js 16 витрина + Supabase commerce-ядро + Stripe Embedded Checkout. Проект развивается по [12-месячному CTO Roadmap](docs/reports/05-cto-roadmap-12-mesyacev.md) в пять фаз.

## Текущий статус

| Phase | Git tag | Статус | Документ |
|-------|---------|--------|----------|
| **1** — Launch readiness | `v1.0-phase1-complete` | ✅ Закрыта | [phase-1-final-summary](docs/reports/phase-1-final-summary.md) |
| **2** — Data layer & admin v0 | `v2.0-phase2-complete` | ✅ Закрыта | [phase-2-final-summary](docs/reports/phase-2-final-summary.md) |
| **3** — Retention & events | `v3.0-phase3-complete` | ✅ **Baseline** | [phase-3-final-summary](docs/reports/phase-3-final-summary.md) |
| **4** — Feature gaps | `v4.0-phase4-complete` | ✅ **Закрыта** | [phase-4-final-summary](docs/reports/phase-4-final-summary.md) |
| **5** — 100k SKU & PIM | — | 🔜 По триггеру | [phase-4-prerequisites](docs/reports/phase-4-prerequisites.md) |

**Активная ветка:** `phase-2/pr-02-commerce-scaffold` (Phase 3 смержена в неё, commit `2195a70`).

**Baseline Phase 4:** сброситься на тег и читать prerequisites перед первым PR:

```bash
git checkout phase-2/pr-02-commerce-scaffold
git pull   # когда origin настроен
git tag -l 'v3.0-phase3-complete'   # локальный annotated tag
git checkout -b phase-4/pr-01-foundation v3.0-phase3-complete
```

Создать тег локально (если ещё нет):

```bash
bash scripts/tag-phase-3.sh
```

## Стек

- **Framework:** Next.js 16 (App Router, RSC, ISR + cache tags)
- **DB / Auth:** Supabase (Postgres, RLS, EU)
- **Payments:** Stripe (Embedded Checkout, webhooks, Tax)
- **Email:** Resend
- **Observability:** Sentry
- **i18n:** `/lv`, `/ru` в URL

## Быстрый старт

```bash
pnpm install
cp .env.example .env.local   # заполнить ключи
pnpm db:start                # локальный Supabase (Docker)
pnpm db:reset                # 18 миграций + seed
pnpm dev
```

Открыть [http://localhost:3000/lv](http://localhost:3000/lv).

## Команды

| Команда | Назначение |
|---------|------------|
| `pnpm dev` | Dev-сервер |
| `pnpm build` | Production build |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` | ESLint |
| `pnpm test` | Unit-тесты commerce (18) |
| `pnpm validate:production` | Pre-deploy checklist |
| `pnpm db:reset` | Миграции + seed |
| `pnpm db:types` | Сгенерировать `lib/database.types.ts` |
| `bash scripts/complete-phase-3.sh` | Полный pipeline + commit gate |

## Архитектура (кратко)

```
app/[locale]/     → витрина (RSC + ISR)
app/api/          → webhooks, публичные API
app/admin/        → RBAC admin v1
lib/commerce/     → единственный data-access слой
lib/events/       → order.paid и side-effects
lib/cache/        → unstable_cache + revalidateTag
supabase/         → миграции (не scripts/)
```

Правила разработки: [ENGINEERING_PLAYBOOK](docs/ENGINEERING_PLAYBOOK.md) · ADR: [docs/adr/](docs/adr/README.md).

## Phase 3 — что в baseline

- Событийный каркас `order.paid` (письмо, сток, лояльность)
- Серверная корзина + merge guest→auth
- ISR cache tags на каталоге
- Промо RPC, лояльность, verified reviews
- Admin v1 (CRUD товаров, promo, audit log, RBAC v1)
- Поиск v1 (pg_trgm + фасеты)
- Retention emails (abandoned cart, welcome, review request)
- 18 unit-тестов commerce

## Phase 4 — что закрыто

- Promo code в checkout (validate → discount → consume on paid)
- Server cart cutover для авторизованных пользователей
- Retention cron: abandoned cart + review request
- Поиск по `search_vector` (RPC) + исправленные facets
- Убраны silent legacy fallbacks в catalog-source

Tag: `bash scripts/tag-phase-4.sh`

## Phase 5 (бывший CTO Phase 4) — когда начинать

**Триггер:** подписан крупный поставщик с товарным фидом → PIM, variants, Meilisearch.

См. [phase-4-prerequisites.md](docs/reports/phase-4-prerequisites.md).

## Документация

| Раздел | Путь |
|--------|------|
| Все отчёты и фазы | [docs/reports/](docs/reports/README.md) |
| CTO Roadmap | [05-cto-roadmap-12-mesyacev.md](docs/reports/05-cto-roadmap-12-mesyacev.md) |
| Phase 3 план | [phase-3-master-plan.md](docs/reports/phase-3-master-plan.md) |

## Происхождение

Изначально сгенерирован в [v0](https://v0.app). Дальнейшая разработка — по инженерному playbook и stacked PR по фазам.