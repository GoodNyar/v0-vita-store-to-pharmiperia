# Pharmiperia — интернет-аптека (Латвия)

Next.js 16 витрина + Supabase commerce-ядро + Stripe Embedded Checkout. Проект развивается по [12-месячному CTO Roadmap](docs/roadmap/CTO-roadmap.md) в пять фаз.

## Текущий статус

| Стадия | Git tag | Статус | Документ |
|--------|---------|--------|----------|
| **Release Candidate** | **`v1.0.0-rc.1`** | 🟢 RC зафиксирован | [Release Notes](docs/release/v1.0.0-rc.1.md) · [MASTER_STATUS](docs/release/MASTER_STATUS.md) |

| Phase | Git tag | Статус | Документ |
|-------|---------|--------|----------|
| **1** — Launch readiness | `v1.0-phase1-complete` | ✅ Закрыта | [phase-1-final-summary](docs/roadmap/phase-1.md) |
| **2** — Data layer & admin v0 | `v2.0-phase2-complete` | ✅ Закрыта | [phase-2-final-summary](docs/roadmap/phase-2.md) |
| **3** — Retention & events | `v3.0-phase3-complete` | ✅ Закрыта | [phase-3-final-summary](docs/roadmap/phase-3.md) |
| **4** — Feature gaps | `v4.0-phase4-complete` | ✅ Закрыта | [phase-4-final-summary](docs/roadmap/phase-4.md) |
| **5** — Catalog foundation | `v5.0-phase5-complete` | ✅ Закрыта | [phase-5-final-summary](docs/roadmap/phase-5.md) |
| **6** — International foundation | `v6.0-phase6-complete` | ✅ Закрыта (checkout fixes → RC) | [phase-6-final-summary](docs/roadmap/phase-6.md) |

**Целевой рынок v1.0:** Латвия (LV-only) · [Known Limitations](docs/release/KNOWN_LIMITATIONS.md) · [Launch Checklist](docs/release/LAUNCH_CHECKLIST.md)

Checkout RC:

```bash
git checkout v1.0.0-rc.1
pnpm install && pnpm typecheck && pnpm test && pnpm build
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
pnpm db:reset                # 22 миграции + seed
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
| `pnpm test` | Unit-тесты commerce (45) |
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

Правила разработки: [ENGINEERING_PLAYBOOK](docs/architecture/ENGINEERING_PLAYBOOK.md) · ADR: [docs/adr/](docs/adr/README.md).

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

## Phase 5 — что закрыто (foundation)

- Schema: `product_variants`, feed staging, `inventory_reservations`
- SQL search facets (полный match-set, не top-50)
- Keyset pagination, sitemap shards (45k)
- Meilisearch adapter stub (env-gated)
- Promo consume observability

**Полный PIM publish + Meilisearch prod** — по триггеру поставщика. См. [phase-5-final-summary](docs/roadmap/phase-5.md).

Tag: `bash scripts/tag-phase-5.sh`

## Документация

**Точка входа:** [docs/README.md](docs/README.md) · [PROJECT_MAP](docs/PROJECT_MAP.md) · [architecture overview](docs/architecture/architecture-overview.md)

| Раздел | Путь |
|--------|------|
| Архитектура & Playbook | [docs/architecture/](docs/architecture/README.md) |
| ADR | [docs/adr/](docs/adr/README.md) |
| Roadmap & фазы | [docs/roadmap/](docs/roadmap/README.md) |
| Аудиты & отчёты | [docs/reports/](docs/reports/README.md) |
| Release & launch | [docs/release/](docs/release/README.md) |
| Business | [docs/business/](docs/business/README.md) |
| Operations | [docs/operations/](docs/operations/README.md) |

## Происхождение

Изначально сгенерирован в [v0](https://v0.app). Дальнейшая разработка — по инженерному playbook и stacked PR по фазам.