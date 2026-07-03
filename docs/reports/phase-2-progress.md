# Phase 2 — Progress Tracker

> Статус: **в работе** — Wave A, PR-01 завершён  
> Master plan: [phase-2-master-plan.md](phase-2-master-plan.md) v2.0 · Всего PR: **30**

---

## Сводка

| Метрика | Значение |
|---------|----------|
| PR завершено | 1 / 30 |
| Milestones | 0 / 8 |
| Прогресс | **3%** |
| Текущий PR | 02 (ожидает подтверждения) |
| Блокеры | — |

---

## Milestones

| ID | Название | PR range | Статус | Дата |
|----|----------|----------|--------|------|
| M1 | Data contract | 01–02 | ◐ | PR-01 done |
| M2 | Commerce pilot | 03–05 | ☐ | |
| M3 | Catalog live | 07–11 | ☐ | |
| M4 | CI green | 12–14 | ☐ | |
| M5 | Operate | 18–21 | ☐ | |
| M6 | Measure | 15–17 | ☐ | |
| M7 | Trust | 22–24 | ☐ | |
| M8 | Polish | 25–30 | ☐ | |

---

## Pull Requests

| PR | Название | Wave | Риск | Статус | Коммит | Дата | Заметки |
|----|----------|------|------|--------|--------|------|---------|
| 01 | database.types + CI | A | Low | ☑ done | (local) | 2026-07-03 | CI job `db-types` |
| 02 | commerce scaffold | A | Low | ☐ pending | | | |
| 03 | commerce favorites | A | Medium | ☐ pending | | | |
| 04 | commerce orders read | A | Medium | ☐ pending | | | |
| 05 | order_items.product_id fix | A | High | ☐ pending | | | **блокер stock** |
| 06 | commerce products + mapper | A | High | ☐ pending | | | |
| 07 | home/popular/specials → DB | B | High | ☐ pending | | | |
| 08 | category/brand → DB | B | High | ☐ pending | | | |
| 09 | search → DB | B | Medium | ☐ pending | | | |
| 10 | PDP + cart resolve | B | High | ☐ pending | | | |
| 11 | sitemap/json-ld | B | Medium | ☐ pending | | | |
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
| 2026-07-03 | `order_items.product_id` null | High | PR-05 до PR-18 | open |
| 2026-07-03 | numeric vs UUID catalog ids | High | PR-06 mapper + cart v3 | open |
| 2026-07-03 | ESLint 43 errors block CI | Medium | PR-12–14 early | open |
| 2026-07-03 | Bank links UI mismatch | Medium | PR-24 + copy | open |

---

## Discovered During Implementation

_Заполняется по мере выполнения PR._

| PR | Severity | Issue | Resolution |
|----|----------|-------|------------|
| | | | |

---

## Post-PR verification log

| PR | typecheck | build | validate | lint | e2e | Проверил |
|----|-----------|-------|----------|------|-----|----------|
| 01 | ✅ pass | ✅ pass | ✅ pass | — | — | agent |

---

## Контрольные точки перед merge в production

- [ ] M3: каталог из БД — цены checkout сверены со seed
- [ ] M5: stock decrement на staging test order
- [ ] M6: server purchase совпадает с Stripe Dashboard
- [ ] M7: returns не auto-refund без manual step
- [ ] M8: Lighthouse mobile LCP задокументирован до/после PR-28