# Отчёт 21 — Self-audit Phase 6

> Дата: 2026-07-06 · Метод: цикл «найти → исправить → перепроверить»

## Найдено и исправлено в ходе аудита

| # | Проблема | Исправление |
|---|----------|-------------|
| 1 | Checkout shipping seed (295/299/599) не совпадал с UI (350/320/295/299/599) | Миграция 23: 5 методов = `SHIPPING_OPTIONS` |
| 2 | `validate:production` grep `pharmiperia.lv` в тесте hreflang | URL заменён на `https://pharm.lv` |
| 3 | `resolveOrderLines` tests без mock `getMarketPriceForProduct` | Добавлен mock в оба order-line теста |
| 4 | `findShippingMethodByCost` в server-only модуле | Вынесен в `market-shipping-core.ts` |
| 5 | `requireStorefrontMarket` в server-only `storefront.ts` | Вынесен в `storefront-parse.ts` для unit-тестов |

## Проверено — проблем не найдено

- Идемпотентность webhook / order.paid не затронута
- Market resolution: header > cookie > geo > default (детерминировано)
- Price resolver: override → catalog fallback (без TOCTOU на чтении)
- Storefront API: read-only, rate-limited, version header
- RLS: markets/shipping/stations public read; prices public read; admin write
- Нет TODO/FIXME/HACK в новом коде

## Остатки (вне scope Phase 6)

- Mobile app, TMS, live carrier APIs, Stripe OSS live
- Checkout UI не читает shipping из DB (hardcoded options; server validates cost)
- Inventory reservations disabled (Phase 5 audit fix)

## Pipeline

См. `docs/roadmap/phase-6.md` — прогон `pnpm typecheck && lint && test && build && validate:production` + `db:types:check`.