# ADR-0028: Phase 6 international foundation (markets, Storefront API, OSS prep)

**Статус:** принят · **Дата:** 2026-07-06 · **Фаза:** 6

## Контекст

CTO Roadmap Phase 6 требует модель **Market** (страна → валюта, локали, доставка, налоги), мультивалютные прайс-листы, VAT OSS, hreflang-матрицу, перевозчиков LT/EE и публичный **Storefront API** для будущего мобильного клиента. Полная экспансия (React Native, live Omniva/DPD API, Stripe multi-currency prod) — по бизнес-триггеру LT/EE.

## Решение

1. **Schema (миграция 23):** `markets`, `market_product_prices`, `market_shipping_methods`, `parcel_stations`; `orders.market_code` для OSS-отчётности.
2. **Commerce layer:** `markets-config`, `resolve-market`, `market-pricing`, `market-shipping`, `carriers`, `storefront` + `storefront-parse`.
3. **Storefront API v1:** `GET /api/storefront/v1/{markets,products,shipping-methods,parcel-stations}` — rate-limited, версия в заголовке `X-Pharmiperia-Api-Version`.
4. **Checkout:** market-aware цены (`market_product_prices` → fallback catalog), VAT по `vat_rate_bps` рынка, валидация доставки из `market_shipping_methods`.
5. **Geo-routing:** middleware выставляет cookie `pharm_market` (header → cookie → geo → default `lv`).
6. **SEO:** hreflang-матрица расширена на lt-LT / et-EE / en (контент пока на lv/ru URL).

## Последствия

- Балтийские рынки LV/LT/EE засеяны; EUR-only (мультивалютность — типы Money готовы, валюта пока EUR).
- OSS включён для LT/EE в конфиге; фактическая регистрация Stripe Tax OSS — ops-триггер.
- Parcel stations — статический seed; live API Omniva/DPD — отдельный PR при ключах.

## Отложено (триггер LT/EE traffic)

- React Native / Expo приложение
- TMS + полные словари lt/et/en
- Stripe multi-currency live + VAT OSS registration
- Live carrier APIs + locker maps
- Edge routing per-market domains (pharmiperia.lt)