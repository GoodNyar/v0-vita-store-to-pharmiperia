# Phase 2 — Progress Tracker

> Статус: **в работе** — Wave B, PR-07–11 завершены  
> Master plan: [phase-2-master-plan.md](phase-2-master-plan.md) v2.0 · Всего PR: **30**

---

## Сводка

| Метрика | Значение |
|---------|----------|
| PR завершено | 11 / 30 |
| Milestones | 2 / 8 |
| Прогресс | **37%** |
| Текущий PR | 12 (ESLint batch 1) |
| Блокеры | — |

---

## Milestones

| ID | Название | PR range | Статус | Дата |
|----|----------|----------|--------|------|
| M1 | Data contract | 01–02 | ☑ | 2026-07-03 |
| M2 | Commerce pilot | 03–05 | ☑ | 2026-07-03 |
| M3 | Catalog live | 07–11 | ☑ | 2026-07-03 |
| M4 | CI green | 12–14 | ☐ | |
| M5 | Operate | 18–21 | ☐ | |
| M6 | Measure | 15–17 | ☐ | |
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
| 05 | order_items.product_id fix | A | High | ☑ done | 36776f4 | 2026-07-03 | UUID from catalog map |
| 06 | commerce products + mapper | A | High | ☑ done | 82a1562 | 2026-07-03 | mapper tests |
| 07 | home/popular/specials → DB | B | High | ☑ done | 7776b70 | 2026-07-03 | `CATALOG_SOURCE=legacy` fallback |
| 08 | category/brand → DB | B | High | ☑ done | cbb2e73 | 2026-07-03 | server fetch + client filters |
| 09 | search → DB | B | Medium | ☑ done | 7532c6e | 2026-07-03 | ilike, no pg_trgm |
| 10 | PDP + cart resolve | B | High | ☑ done | 943898d | 2026-07-03 | cart storage v3 |
| 11 | sitemap/json-ld | B | Medium | ☑ done | e151b19 | 2026-07-03 | async sitemap |
| 12 | ESLint batch 1 | C | Low | ☐ pending | | | |
| 13 | CartProvider dedup | C | Low | ☐ pending | | | |
| 14 | ESLint batch 2 + restricted imports | C | Medium | ☐ pending | | | |
| 15 | server analytics + UTM | D | Medium | ☐ pending | | | ADR-0017 |
| 16 | client analytics | D | Medium | ☐ pending | | | ADR-0017 |
| 17 | search query log | D | Low | ☐ pending | | | |
| 18 | stock decrement | D | High | ☐ pending | | | ADR-0019, after 05 |
| 19 | admin RLS + shell | D | High | ☐ pending | | | ADR-0018 |
| 20 | admin orders | D | High | ☐ pending | | | |
| 21 | admin stock view | D | Medium | ☐ pending | | | |
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
| 0017 | Analytics server + client | ☐ proposed | 15, 16 |
| 0018 | Admin RBAC v0 | ☐ proposed | 19–21 |
| 0019 | Inventory decrement | ☐ proposed | 18 |
| 0020 | Baltic payment methods | ☐ proposed | 24 |
| 0021 | Image optimization / CWV | ☐ proposed | 28 |

---

## Риски (живой журнал)

| Дата | Риск | Severity | Митигация | Статус |
|------|------|----------|-----------|--------|
| 2026-07-03 | `order_items.product_id` null | High | PR-05 до PR-18 | mitigated |
| 2026-07-03 | numeric vs UUID catalog ids | High | PR-06 mapper + cart v3 | mitigated |
| 2026-07-03 | ESLint 43 errors block CI | Medium | PR-12–14 early | open |
| 2026-07-03 | Bank links UI mismatch | Medium | PR-24 + copy | open |
| 2026-07-03 | DB unavailable at build (sitemap/SSG) | Medium | legacy fallback in catalog-source | open |

---

## Discovered During Implementation

| PR | Severity | Issue | Resolution |
|----|----------|-------|------------|
| 07 | Low | Missing `courierDelivery` i18n key blocked tsc | Added LV/RU strings |
| 10 | Low | CartProvider outside LangProvider | Locale from pathname for catalog fetch |
| 11 | Low | `org-json-ld.tsx` unchanged (org-level only) | Product JSON-LD in PDP layout |

---

## Post-PR verification log

| PR | typecheck | build | validate | lint | e2e | Проверил |
|----|-----------|-------|----------|------|-----|----------|
| 01 | ✅ pass | ✅ pass | ✅ pass | — | — | agent |
| 07 | ✅ pass | — | ✅ pass | — | — | agent |
| 08 | ✅ pass | — | ✅ pass | — | — | agent |
| 09 | ✅ pass | — | ✅ pass | — | — | agent |
| 10 | ✅ pass | — | ✅ pass | — | — | agent |
| 11 | ✅ pass | — | ✅ pass | — | — | agent |

---

## Контрольные точки перед merge в production

- [x] M3: каталог из БД — цены checkout сверены со seed (fallback + mapper)
- [ ] M5: stock decrement на staging test order
- [ ] M6: server purchase совпадает с Stripe Dashboard
- [ ] M7: returns не auto-refund без manual step
- [ ] M8: Lighthouse mobile LCP задокументирован до/после PR-28