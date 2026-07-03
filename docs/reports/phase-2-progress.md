# Phase 2 — Progress Tracker

> Статус: **в работе** — Wave D, PR-15–21 завершены  
> Master plan: [phase-2-master-plan.md](phase-2-master-plan.md) v2.0 · Всего PR: **30**

---

## Сводка

| Метрика | Значение |
|---------|----------|
| PR завершено | 21 / 30 |
| Milestones | 6 / 8 |
| Прогресс | **70%** |
| Текущий PR | 22 (ожидает подтверждения) |
| Блокеры | — |

---

## Milestones

| ID | Название | PR range | Статус | Дата |
|----|----------|----------|--------|------|
| M1 | Data contract | 01–02 | ☑ | 2026-07-03 |
| M2 | Commerce pilot | 03–05 | ☑ | 2026-07-03 |
| M3 | Catalog live | 07–11 | ☑ | 2026-07-03 |
| M4 | CI green | 12–14 | ☑ | 2026-07-03 |
| M5 | Operate | 18–21 | ☑ | 2026-07-03 |
| M6 | Measure | 15–17 | ☑ | 2026-07-03 |
| M7 | Trust | 22–24 | ☐ | |
| M8 | Polish | 25–30 | ☐ | |

---

## Pull Requests

| PR | Название | Wave | Риск | Статус | Коммит | Дата | Заметки |
|----|----------|------|------|--------|--------|------|---------|
| 01 | database.types + CI | A | Low | ☑ done | c9bbb1f | 2026-07-03 | CI job `db-types` |
| 02 | commerce scaffold | A | Low | ☑ done | 2cbd602 | 2026-07-03 | |
| 03 | commerce favorites | A | Medium | ☑ done | f4abd7b | 2026-07-03 | |
| 04 | commerce orders read | A | Medium | ☑ done | ad6dfbd | 2026-07-03 | |
| 05 | order_items.product_id fix | A | High | ☑ done | 36776f4 | 2026-07-03 | |
| 06 | commerce products + mapper | A | High | ☑ done | 82a1562 | 2026-07-03 | |
| 07 | home/popular/specials → DB | B | High | ☑ done | 7776b70 | 2026-07-03 | |
| 08 | category/brand → DB | B | High | ☑ done | cbb2e73 | 2026-07-03 | |
| 09 | search → DB | B | Medium | ☑ done | (local) | 2026-07-03 | |
| 10 | PDP + cart resolve | B | High | ☑ done | (local) | 2026-07-03 | |
| 11 | sitemap/json-ld | B | Medium | ☑ done | (local) | 2026-07-03 | |
| 12 | ESLint batch 1 | C | Low | ☑ done | 4bf6030 | 2026-07-03 | 43→0 errors on critical paths |
| 13 | CartProvider dedup | C | Low | ☑ done | c79b410 | 2026-07-03 | 18 pages deduped |
| 14 | ESLint batch 2 + restricted imports | C | Medium | ☑ done | 9147c83 | 2026-07-03 | draft `no-restricted-imports` warn |
| 15 | server analytics + UTM | D | Medium | ☑ done | 9e8feeb | 2026-07-03 | ADR-0017 |
| 16 | client analytics | D | Medium | ☑ done | 462e839 | 2026-07-03 | ADR-0017, `ANALYTICS_ENABLED=false` |
| 17 | search query log | D | Low | ☑ done | 21a4f6f | 2026-07-03 | |
| 18 | stock decrement | D | High | ☑ done | 93b80b3 | 2026-07-03 | ADR-0019 |
| 19 | admin RLS + shell | D | High | ☑ done | 7056b47 | 2026-07-03 | ADR-0018 |
| 20 | admin orders | D | High | ☑ done | d2ffe68 | 2026-07-03 | |
| 21 | admin stock view | D | Medium | ☑ done | 9eff6a3 | 2026-07-03 | read-only |
| 22 | email templates LV/RU | E | Medium | ☐ pending | | | |
| 23 | returns flow | E | High | ☐ pending | | | |
| 24 | Stripe bank methods | E | High | ☐ pending | | | ADR-0020 |
| 25 | hreflang + metadata | F | Medium | ☐ pending | | | |
| 26 | content pages RSC | F | Medium | ☐ pending | | | |
| 27 | a11y quick wins | F | Low | ☐ pending | | | |
| 28 | image optimization | F | Medium | ☐ pending | | | ADR-0021 |
| 29 | security headers | F | Medium | ☐ pending | | | |
| 30 | e2e cron | F | Low | ☐ pending | | | |

**Легенда:** ☐ pending · ◐ in progress · ☑ done · ⊘ skipped/deferred

---

## ADR (ожидают утверждения)

| ADR | Тема | Статус | Блокирует PR |
|-----|------|--------|--------------|
| 0017 | Analytics server + client | ☑ принят | — |
| 0018 | Admin RBAC v0 | ☑ принят | — |
| 0019 | Inventory decrement | ☑ принят | — |
| 0020 | Baltic payment methods | ☐ proposed | 24 |
| 0021 | Image optimization / CWV | ☐ proposed | 28 |

---

## Риски (живой журнал)

| Дата | Риск | Severity | Митигация | Статус |
|------|------|----------|-----------|--------|
| 2026-07-03 | `order_items.product_id` null | High | PR-05 до PR-18 | mitigated |
| 2026-07-03 | numeric vs UUID catalog ids | High | PR-06 mapper + cart v3 | mitigated |
| 2026-07-03 | ESLint 43 errors block CI | Medium | PR-12–14 early | **closed** |
| 2026-07-03 | Bank links UI mismatch | Medium | PR-24 + copy | open |
| 2026-07-03 | 25+ duplicate CartProvider | Low | PR-13 dedup | **closed** |
| 2026-07-03 | Stock oversell race on last SKU | Medium | RPC raises; manual refund ops | open |

---

## Discovered During Implementation

| PR | Severity | Issue | Resolution |
|----|----------|-------|------------|
| 12 | Low | `cart-context` regressed after PR-10 commerce fetch | Re-applied deferred hydration `setTimeout(0)` |
| 13 | Low | `product-page-content` had unused `CartProvider` import | Removed import |
| 14 | Info | 9 call-sites still import `@/lib/supabase/client` outside `lib/` | Draft rule at `warn` until strangler complete |
| 15 | Info | `database.types.ts` updated manually for new tables | Regenerate via `pnpm db:types` after `db:push` on staging |
| 19 | Info | Admin role assigned manually in Supabase (`profiles.role = 'admin'`) | Documented in ADR-0018 |

---

## Post-PR verification log

| PR | typecheck | build | validate | lint | e2e | Проверил |
|----|-----------|-------|----------|------|-----|----------|
| 01 | ✅ pass | ✅ pass | ✅ pass | — | — | agent |
| 12–14 | ✅ pass | ✅ pass | ✅ pass | ✅ 0 errors | — | agent |
| 15–17 | ✅ pass | ✅ pass | ✅ pass | — | — | agent |
| 18–21 | ✅ pass | ✅ pass | ✅ pass | — | — | agent |

**Lint:** до PR-12 — **43 errors**, 42 warnings · после PR-14 — **0 errors**, ~44 warnings (вкл. draft `no-restricted-imports`)

---

## Контрольные точки перед merge в production

- [x] M3: каталог из БД — цены checkout сверены со seed
- [ ] M5: stock decrement на staging test order
- [ ] M6: server purchase совпадает с Stripe Dashboard
- [ ] M7: returns не auto-refund без manual step
- [ ] M8: Lighthouse mobile LCP задокументирован до/после PR-28

---

## Migrations added (PR-15–21)

| Migration | PR | Описание |
|-----------|-----|----------|
| `20260703170000_analytics.sql` | 15 | `analytics_events`, UTM columns on `orders` |
| `20260703180000_search_queries.sql` | 17 | `search_queries` table |
| `20260703190000_inventory_decrement.sql` | 18 | `inventory_adjusted_at`, `decrement_stock()` RPC |
| `20260703200000_admin_rbac.sql` | 19 | `profiles.role`, `is_admin()`, admin RLS policies |