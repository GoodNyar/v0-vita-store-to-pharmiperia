# Phase 2 — Master Plan (архитектурная ревизия)

> Версия: **2.0** · Дата ревизии: 2026-07-03 · Статус: **утверждён к исполнению после «Начинай Phase 2»**  
> База: `v1.0-phase1-complete` · Оценка: **~12–14 недель** (1 dev) / **~7–9 недель** (2 dev) · **28 PR**

---

## 0. Результаты ревизии: скрытые зависимости и конфликты

### Блокеры, обнаруженные в коде (не были явны в Roadmap)

| # | Находка | Влияние |
|---|---------|---------|
| H1 | `order_items.product_id` всегда **`null`** при создании заказа (`lib/orders.ts`) | Stock decrement **невозможен** без отдельного PR |
| H2 | Витрина: **numeric id** (`lib/data.ts`) vs БД: **UUID** (`catalog-seed.ts` bridge) | Каталог из БД требует mapper legacy↔UUID во всём commerce |
| H3 | **25+ страниц** дублируют `CartProvider` при наличии root layout | Cleanup шире, чем оценка; merge-конфликты при параллельных PR |
| H4 | `cart-context` резолвит товар из `lib/data` при hydration | Смена каталога ломает localStorage cart без version bump |
| H5 | `favorites.product_id` — string; reviews — прямой Supabase в компоненте | Commerce strangler должен включить reviews рано или изолировать |
| H6 | CI `lint` **настроен**, но 43 errors — красный pipeline при strict merge | ESLint PR **до** крупных фич или lint → warning в CI временно |
| H7 | `images.unoptimized: true` | LCP/Core Web Vitals — отдельный PR в Phase 2 (не Phase 3) |

### Архитектурные конфликты

| Конфликт | Решение |
|----------|---------|
| ADR-0004 (commerce) vs спешка с Admin | Admin **только после** commerce orders/products |
| ADR-0006 (RSC) vs client-heavy витрина | Phase 2: **только content pages** RSC; shop RSC → Phase 3 |
| Client `purchase` vs server `purchase` | Server — источник истины; client — только funnel events |
| Bank links в footer уже обещаны | PR bank methods **или** правка copy — в одном релизе |

### Регрессии высокой вероятности

- Checkout price mismatch (data.ts vs DB seed)
- Favorites desync (numeric vs UUID)
- Sitemap/SEO URLs при смене источника каталога
- Webhook idempotency при добавлении stock + analytics side-effects

---

## 1. Задачи: merge / split / defer / add

### Объединить

| Было | Стало | Причина |
|------|-------|---------|
| P2-01 types + P2-02 scaffold | **PR-01…03** (всё равно 3 PR по размеру) | — |
| P2-05 UTM + server purchase | **PR-14** одна миграция `orders` | Одна миграция БД |
| hreflang + metadata helper | **PR-24** | Один контракт SEO |

### Разбить на несколько PR

| Задача | PR |
|--------|-----|
| Каталог из БД | PR-06…10 (mapper, listings, PLP, PDP, sitemap) |
| ESLint cleanup | PR-11, PR-13 |
| Admin v0 | PR-18, PR-19, PR-20 |
| Content RSC | PR-25a, PR-25b (по 4 страницы) |
| Returns | PR-22a schema, PR-22b UI (если >800 строк) |

### Перенести в Phase 3

| Item | Причина |
|------|---------|
| Shop RSC/ISR (home, category, product, search) | ADR-0006, 8–10 чн, зависит от стабильного commerce |
| Search v1 (pg_trgm, facets) | Триггер объёма SKU; Phase 2 только logging |
| Inngest / event bus | <3 подписчиков на `order.paid` |
| Server-side cart | ADR + migration cart storage |
| i18n namespace split (`lib/i18n/`) | 4–5 чн, не блокирует Phase 2 KPI |
| Admin v1 product CRUD | Phase 2 = v0 read/update orders+stock |
| Loyalty accrual в webhook | Страница есть; бизнес-логика Phase 3 |
| AI recommendations prod | ADR-0013 |
| Abandoned cart emails | Нужна server cart |

### Добавить в Phase 2 (новые PR)

| PR | Тема | Зачем |
|----|------|-------|
| **PR-05** | `order_items.product_id` UUID | Блокер stock (H1) |
| **PR-27** | Image optimization (`unoptimized: false`, `sizes`) | Playbook §8, CWV |
| **PR-28** | Security headers (CSP, HSTS baseline) | Audit 04 §13 |
| **PR-11…13** | ESLint green + `no-restricted-imports` | CI merge safety |

### Предлагаемые ADR (только после утверждения — **не созданы**)

| ID | Тема | Когда нужен |
|----|------|-------------|
| ADR-0017 | Analytics: server purchase + consent client | Перед PR-14 |
| ADR-0018 | Admin RBAC v0 (`profiles.role`) | Перед PR-18 |
| ADR-0019 | Inventory decrement RPC + idempotency | Перед PR-17 |
| ADR-0020 | Baltic Stripe payment methods | Перед PR-23 |
| ADR-0021 | Image optimization + CWV budget | Перед PR-27 |

---

## 2. Окончательная последовательность PR (28)

Каждый PR: **~300–800 строк**, `tsc` + `build` + `validate:production` (static), merge-safe.

### Wave A — Data platform (недели 1–2)

| PR | Название | Зависимости | Риск | Строк | DoD | Откат |
|----|----------|-------------|------|-------|-----|-------|
| **01** | `lib/database.types.ts` + CI drift check | — | Low | ~250 | Types gen in CI; job fails on drift | Revert CI step |
| **02** | `lib/commerce` scaffold (`errors`, `types`, `index`) | 01 | Low | ~400 | Empty layer exports; no consumers broken | Delete folder |
| **03** | `commerce/favorites` + provider migration | 02 | Medium | ~550 | Favorites via commerce; e2e manual | Revert provider |
| **04** | `commerce/orders` read + account/orders page | 02 | Medium | ~600 | Orders list via commerce | Revert page |
| **05** | Fix `order_items.product_id` (UUID from catalog map) | 02, catalog-seed | **High** | ~350 | order_items populated on draft; test order in DB | Revert orders.ts |
| **06** | `commerce/products` queries + `Product` mapper (legacy↔UUID) | 01, 02 | **High** | ~700 | Unit-level mapper tests; 1 product fetch works | Feature flag |

### Wave B — Catalog strangler (недели 2–4)

| PR | Название | Зависимости | Риск | Строк | DoD | Откат |
|----|----------|-------------|------|-------|-----|-------|
| **07** | Home + popular + specials → commerce | 06 | **High** | ~650 | Prices match seed; add-to-cart works | `CATALOG_SOURCE=legacy` env |
| **08** | Category + brand pages → commerce | 06 | **High** | ~750 | Filters work lv/ru | Revert pages |
| **09** | Search page → commerce (no pg_trgm yet) | 06 | Medium | ~500 | Search still client filter or DB ilike | Revert |
| **10** | Product PDP + `cart-context` resolve via commerce | 06, 07 | **High** | ~700 | PDP + cart same price; bump cart storage v3 if needed | Cart version rollback |
| **11** | Sitemap + org-json-ld from commerce | 06 | Medium | ~400 | sitemap.xml valid URLs | Revert sitemap |

### Wave C — Code health (параллельно B, недели 2–3)

| PR | Название | Зависимости | Риск | Строк | DoD | Откат |
|----|----------|-------------|------|-------|-----|-------|
| **12** | ESLint batch 1 (errors → 0 on critical paths) | — | Low | ~500 | `pnpm lint` errors <10 | Revert |
| **13** | CartProvider dedup (remove page wrappers) | — | Low | ~450 | Single provider in layout | Revert mechanical |
| **14** | ESLint batch 2 + `no-restricted-imports` draft | 12, 03–04 | Medium | ~400 | Lint 0 errors | Toggle rule off |

### Wave D — Operations (недели 4–6)

| PR | Название | Зависимости | Риск | Строк | DoD | Откат |
|----|----------|-------------|------|-------|-----|-------|
| **15** | Analytics migration + server purchase + UTM | 05, ADR-0017 | Medium | ~600 | Webhook writes event; UTM on order | Migration down |
| **16** | Client analytics GA4/PostHog + consent | 15, ADR-0017 | Medium | ~550 | view_item/add_to_cart/begin_checkout fire with consent | `ANALYTICS_ENABLED=false` |
| **17** | Search query logging | 09 | Low | ~300 | Rows in `search_queries` | Disable insert |
| **18** | Stock decrement RPC + webhook | 05, 06, ADR-0019 | **High** | ~500 | Test order reduces stock once (idempotent) | Disable RPC |
| **19** | Admin RLS + `/admin` layout shell | 04, ADR-0018 | **High** | ~500 | Non-admin 403 on /admin | Remove policies |
| **20** | Admin orders list + status update | 19 | **High** | ~700 | Admin can set status on staging | Disable route |
| **21** | Admin products stock view (read-only) | 19, 06 | Medium | ~500 | Stock visible matches DB | Revert |

### Wave E — Communications & money UX (недели 6–7)

| PR | Название | Зависимости | Риск | Строк | DoD | Откат |
|----|----------|-------------|------|-------|-----|-------|
| **22** | Email templates LV/RU (shipped, refund notice) | 08 | Medium | ~650 | Resend test emails on staging | `EMAIL_ENABLED=false` |
| **23** | Returns flow (schema + account UI) | 20, ADR-0005 | **High** | ~750 | Refund request created; no auto-refund yet | Disable feature flag |
| **24** | Stripe Baltic payment methods | stable checkout, ADR-0020 | **High** | ~450 | Test mode shows methods; footer aligned | Revert session params |

### Wave F — SEO, perf, a11y, ops (недели 7–9)

| PR | Название | Зависимости | Риск | Строк | DoD | Откат |
|----|----------|-------------|------|-------|-----|-------|
| **25** | hreflang + `lib/seo/metadata` | 11 | Medium | ~450 | Valid hreflang on layout + PDP | Revert layout |
| **26** | Content pages RSC (delivery, returns, about, privacy) | 25 | Medium | ~800 | View source has content HTML | Revert per page |
| **27** | a11y: cart drawer focus trap + header keyboard | — | Low | ~500 | Manual keyboard test pass | Revert |
| **28** | Image optimization + `sizes` audit | ADR-0021 | Medium | ~450 | `unoptimized: false`; Lighthouse LCP baseline | Revert next.config |
| **29** | Security headers (CSP baseline) | — | Medium | ~350 | securityheaders.com B+ staging | Relax CSP |
| **30** | E2e cron workflow | 05, 10, ADR-0015 | Low | ~250 | Scheduled smoke green on staging | Disable workflow |

> **Нумерация PR:** 30 PR (уточнённый план v2); контрольные точки ниже по waves.

---

## 3. Контрольные точки (milestones)

| Milestone | После PR | Критерий |
|-----------|----------|----------|
| **M1 Data contract** | 01–02 | Types in CI |
| **M2 Commerce pilot** | 03–05 | Favorites + orders + product_id in DB |
| **M3 Catalog live** | 07–11 | Витрина из БД, checkout цены OK |
| **M4 CI green** | 12–14 | ESLint 0 errors |
| **M5 Operate** | 18–21 | Stock + admin on staging |
| **M6 Measure** | 15–17 | Analytics + search log |
| **M7 Trust** | 22–24 | Emails + returns + payments truth |
| **M8 Polish** | 25–30 | SEO, perf, a11y, cron |

---

## 4. Риск-реестр (сводка)

| Уровень | PR |
|---------|-----|
| **High** | 05, 06, 07, 08, 10, 18, 19, 20, 23, 24 |
| **Medium** | 03, 04, 09, 11, 14–17, 21, 22, 25, 26, 28, 29 |
| **Low** | 01, 02, 12, 13, 27, 30 |

---

## 5. Чеклист после каждого PR

```bash
pnpm typecheck
pnpm build                    # CI placeholders
pnpm validate:production      # VALIDATE_RUN_BUILD=false ok for speed
pnpm lint                     # после PR-14: обязательно 0 errors
pnpm test:e2e                 # если тронут checkout/cart/catalog (E2E_ENABLED)
```

| Область | Проверить |
|---------|-----------|
| Checkout | draft order + `order_items` + Stripe iframe |
| i18n | `/lv` и `/ru` smoke |
| Money | цены совпадают PDP → cart → checkout |
| GDPR | consent banner не сломан |
| SEO | canonical не наследуется с корня неверно |
| Security | no secrets in diff; RLS на новых таблицах |

---

## 6. Оптимальный порядок (критический путь)

```
01 → 02 → 03 → 04 → 05 → 06 → 07 → 08 → 09 → 10 → 11
                              ↘ 12 → 13 → 14 (parallel track)
05 → 18 (stock)
06 → 21 (admin stock view)
04 → 19 → 20 (admin)
11 → 15 → 16 → 17 (analytics)
20 → 22 → 23 (comms)
10 → 24 (bank links)
11 → 25 → 26 (SEO)
28 → 29 (perf/security)
30 (cron last)
```

**Параллельные треки (2 dev):**  
- **Track A:** 01–11 (commerce)  
- **Track B:** 12–14 (hygiene) → 25–29 (SEO/perf) → 30  

---

## 7. Связанные документы

- [Phase 2 Prerequisites](phase-2-prerequisites.md)
- [Phase 1 Final Summary](phase-1-final-summary.md)
- [Phase 2 Progress](phase-2-progress.md)
- [CTO Roadmap § Phase 2](05-cto-roadmap-12-mesyacev.md)