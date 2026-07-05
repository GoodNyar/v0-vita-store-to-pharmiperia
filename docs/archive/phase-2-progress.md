# Phase 2 — Progress Tracker

> **ARCHIVED** — PR-трекер закрыт. Итог: [../roadmap/phase-2.md](../roadmap/phase-2.md). См. [archive/README.md](README.md).

> Статус: **завершена** · Tag: `v2.0-phase2-complete`  
> Master plan: [../roadmap/phase-2-master-plan.md](../roadmap/phase-2-master-plan.md) v2.0 · Итог: [../roadmap/phase-2.md](../roadmap/phase-2.md)

---

## Сводка

| Метрика | Значение |
|---------|----------|
| PR завершено | **30 / 30** |
| Milestones | **8 / 8** (engineering) |
| Прогресс | **100%** |
| Ветка | `phase-2/pr-02-commerce-scaffold` |
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
| M7 | Trust | 22–24 | ☑ | 2026-07-03 |
| M8 | Polish | 25–30 | ☑ | 2026-07-03 |

---

## Pull Requests

| PR | Название | Wave | Статус | Коммит |
|----|----------|------|--------|--------|
| 01 | database.types + CI | A | ☑ | c9bbb1f |
| 02 | commerce scaffold | A | ☑ | 2cbd602 |
| 03 | commerce favorites | A | ☑ | f4abd7b |
| 04 | commerce orders read | A | ☑ | ad6dfbd |
| 05 | order_items.product_id fix | A | ☑ | 36776f4 |
| 06 | commerce products + mapper | A | ☑ | 82a1562 |
| 07 | home/popular/specials → DB | B | ☑ | 7776b70 |
| 08 | category/brand → DB | B | ☑ | cbb2e73 |
| 09 | search → DB | B | ☑ | 7532c6e |
| 10 | PDP + cart resolve | B | ☑ | 943898d |
| 11 | sitemap/json-ld | B | ☑ | e151b19 |
| 12 | ESLint batch 1 | C | ☑ | 4bf6030 |
| 13 | CartProvider dedup | C | ☑ | c79b410 |
| 14 | ESLint batch 2 | C | ☑ | 9c42dbc |
| 15 | server analytics + UTM | D | ☑ | 9e8feeb |
| 16 | client analytics | D | ☑ | 462e839 |
| 17 | search query log | D | ☑ | 21a4f6f |
| 18 | stock decrement | D | ☑ | 93b80b3 |
| 19 | admin RLS + shell | D | ☑ | 7056b47 |
| 20 | admin orders | D | ☑ | d2ffe68 |
| 21 | admin stock view | D | ☑ | 9eff6a3 |
| 22 | email templates LV/RU | E | ☑ | 17a02b5 |
| 23 | returns flow | E | ☑ | 82de85b |
| 24 | Stripe bank methods | E | ☑ | 73c8ef5 |
| 25 | hreflang + metadata | F | ☑ | db43f2f |
| 26 | content pages RSC | F | ☑ | b3e59bf |
| 27 | a11y quick wins | F | ☑ | 7881fae |
| 28 | image optimization | F | ☑ | 7ac4cf1 |
| 29 | security headers | F | ☑ | 7896715 |
| 30 | e2e cron | F | ☑ | 752ef2a |

---

## ADR Phase 2

| ADR | Тема | Статус |
|-----|------|--------|
| 0017 | Analytics server + client | ☑ принят |
| 0018 | Admin RBAC v0 | ☑ принят |
| 0019 | Inventory decrement | ☑ принят |
| 0020 | Baltic payment methods | ☑ принят |
| 0021 | Image optimization / CWV | ☑ принят |

---

## Post-PR verification (финал)

| Check | Результат |
|-------|-----------|
| `tsc --noEmit` | ✅ |
| `next build` | ✅ |
| `validate:production` | ✅ CONDITIONAL GO |
| `eslint` | ✅ 0 errors, 46 warnings |
| `test:commerce` | ✅ 4/4 |

---

## Staging ops (перед production merge)

- [ ] `pnpm db:push` — 6 Phase 2 migrations
- [ ] `pnpm db:types` + commit drift check
- [ ] Test order → stock decrement once
- [ ] Server `purchase` в `analytics_events`
- [ ] Lighthouse LCP до/после
- [ ] `profiles.role = 'admin'` для тестового пользователя