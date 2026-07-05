# Phase 6 Master Plan (international foundation)

> Baseline: `v5.0-phase5-complete` · Tag: `v6.0-phase6-complete`

## Scope (выполнено)

1. Migration `20260706120000` — markets, price lists, shipping, parcel stations, orders.market_code
2. `lib/commerce` — markets, resolve-market, market-pricing, market-shipping, carriers, storefront
3. Storefront API v1 — 5 read-only endpoints, rate limit 60/min
4. Checkout — market VAT, market shipping validation, market prices
5. Middleware geo-routing — `pharm_market` cookie
6. Hreflang matrix — lt-LT, et-EE, en expansion tags
7. ADR-0028, unit tests, self-audit, tag

## Отложено (триггер LT/EE traffic)

- Mobile app (React Native/Expo)
- TMS + full lt/et/en UI
- Stripe multi-currency + VAT OSS live
- Omniva/DPD live APIs
- Per-market domains + edge routing