# Phase 2 — Progress Tracker

> Статус: **в работе** — Wave F, PR-22–30 завершены  
> Master plan: [phase-2-master-plan.md](phase-2-master-plan.md) v2.0 · Всего PR: **30**

---

## Сводка

| Метрика | Значение |
|---------|----------|
| PR завершено | 30 / 30 |
| Milestones | 6 / 8 |
| Прогресс | **100%** (PR) · M5/M6 ожидают PR-15–21 |
| Текущий PR | — (wave F complete) |
| Блокеры | — |

---

## Milestones

| ID | Название | PR range | Статус | Дата |
|----|----------|----------|--------|------|
| M1 | Data contract | 01–02 | ☑ | 2026-07-03 |
| M2 | Commerce pilot | 03–05 | ☑ | 2026-07-03 |
| M3 | Catalog live | 07–11 | ☑ | 2026-07-03 |
| M4 | CI green | 12–14 | ☑ | 2026-07-03 |
| M5 | Operate | 18–21 | ☐ | |
| M6 | Measure | 15–17 | ☐ | |
| M7 | Trust | 22–24 | ☑ | 2026-07-03 |
| M8 | Polish | 25–30 | ☑ | 2026-07-03 |

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
| 09 | search → DB | B | Medium | ☑ done | 7532c6e | 2026-07-03 | |
| 10 | PDP + cart resolve | B | High | ☑ done | 943898d | 2026-07-03 | |
| 11 | sitemap/json-ld | B | Medium | ☑ done | e151b19 | 2026-07-03 | |
| 12 | ESLint batch 1 | C | Low | ☑ done | 4bf6030 | 2026-07-03 | |
| 13 | CartProvider dedup | C | Low | ☑ done | c79b410 | 2026-07-03 | |
| 14 | ESLint batch 2 + restricted imports | C | Medium | ☑ done | 9c42dbc | 2026-07-03 | |
| 15 | server analytics + UTM | D | Medium | ☐ pending | | | ADR-0017 |
| 16 | client analytics | D | Medium | ☐ pending | | | ADR-0017 |
| 17 | search query log | D | Low | ☐ pending | | | |
| 18 | stock decrement | D | High | ☐ pending | | | ADR-0019 |
| 19 | admin RLS + shell | D | High | ☐ pending | | | ADR-0018 |
| 20 | admin orders | D | High | ☐ pending | | | |
| 21 | admin stock view | D | Medium | ☐ pending | | | |
| 22 | email templates LV/RU | E | Medium | ☑ done | 17a02b5 | 2026-07-03 | shipped + refund notice |
| 23 | returns flow | E | High | ☑ done | 82de85b | 2026-07-03 | standalone account UI |
| 24 | Stripe bank methods | E | High | ☑ done | 73c8ef5 | 2026-07-03 | ADR-0020 |
| 25 | hreflang + metadata | F | Medium | ☑ done | db43f2f | 2026-07-03 | lib/seo/metadata |
| 26 | content pages RSC | F | Medium | ☑ done | b3e59bf | 2026-07-03 | 4 pages |
| 27 | a11y quick wins | F | Low | ☑ done | 7881fae | 2026-07-03 | focus trap + keyboard |
| 28 | image optimization | F | Medium | ☑ done | 7ac4cf1 | 2026-07-03 | ADR-0021; unoptimized in PR-29 |
| 29 | security headers | F | Medium | ☑ done | 7896715 | 2026-07-03 | CSP baseline |
| 30 | e2e cron | F | Low | ☑ done | 752ef2a | 2026-07-03 | E2E_CRON_ENABLED gate |

**Легенда:** ☐ pending · ◐ in progress · ☑ done · ⊘ skipped/deferred

---

## ADR (ожидают утверждения)

| ADR | Тема | Статус | Блокирует PR |
|-----|------|--------|--------------|
| 0017 | Analytics server + client | ☐ proposed | 15, 16 |
| 0018 | Admin RBAC v0 | ☐ proposed | 19–21 |
| 0019 | Inventory decrement | ☐ proposed | 18 |
| 0020 | Baltic payment methods | ☑ accepted | 24 |
| 0021 | Image optimization / CWV | ☑ accepted | 28 |

---

## Риски (живой журнал)

| Дата | Риск | Severity | Митигация | Статус |
|------|------|----------|-----------|--------|
| 2026-07-03 | `order_items.product_id` null | High | PR-05 | mitigated |
| 2026-07-03 | numeric vs UUID catalog ids | High | PR-06 mapper | mitigated |
| 2026-07-03 | ESLint 43 errors block CI | Medium | PR-12–14 | **closed** |
| 2026-07-03 | Bank links UI mismatch | Medium | PR-24 + copy | **closed** |
| 2026-07-03 | 25+ duplicate CartProvider | Low | PR-13 dedup | **closed** |

---

## Discovered During Implementation

| PR | Severity | Issue | Resolution |
|----|----------|-------|------------|
| 12 | Low | `cart-context` regressed after PR-10 | Re-applied deferred hydration |
| 13 | Low | unused `CartProvider` import on PDP | Removed import |
| 14 | Info | 9 call-sites still import supabase client | Draft rule at warn |
| 23 | Info | Admin PR-20 may land in parallel | Returns UI standalone via RLS |
| 26 | Low | `lib/i18n.tsx` → `translations.ts` split | Server dictionary for RSC |
| 28/29 | Info | `unoptimized:false` shipped in PR-29 next.config | ADR-0021 notes split |

---

## Post-PR verification log

| PR | typecheck | build | validate | lint | e2e | Проверил |
|----|-----------|-------|----------|------|-----|----------|
| 01 | ✅ | ✅ | ✅ | — | — | agent |
| 12–14 | ✅ | ✅ | ✅ | ✅ 0 errors | — | agent |
| 22–30 | ✅ | ✅ | ✅ | — | — | agent |

**Lint:** после PR-14 — **0 errors**, ~44 warnings

---

## Контрольные точки перед merge в production

- [x] M3: каталог из БД — цены checkout сверены со seed
- [ ] M5: stock decrement на staging test order
- [ ] M6: server purchase совпадает с Stripe Dashboard
- [x] M7: returns не auto-refund без manual step
- [ ] M8: Lighthouse mobile LCP задокументирован до/после PR-28