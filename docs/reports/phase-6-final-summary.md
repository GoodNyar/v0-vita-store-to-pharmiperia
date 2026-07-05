# Phase 6 — Final Summary

> **Статус:** ✅ **ЗАКРЫТА (foundation scope)** · Tag: **`v6.0-phase6-complete`**  
> **Baseline:** `v5.0-phase5-complete` · **ADR:** [0028](../adr/0028-phase6-international-foundation.md)

---

## Executive Summary

Phase 6 заложила **международный фундамент** для Baltics (LV/LT/EE): модель Market, прайс-листы, market-aware checkout, Storefront API v1, geo-routing, hreflang-расширение и seed перевозчиков — без mobile app и live carrier APIs (триггер LT/EE traffic).

---

## 1. Изменения

| # | Область | Результат |
|---|---------|-----------|
| 1 | Markets schema | `markets` + seed LV/LT/EE |
| 2 | Price lists | `market_product_prices` + resolver |
| 3 | Shipping per market | `market_shipping_methods` + checkout validation |
| 4 | Parcel stations | `parcel_stations` seed (Omniva/DPD LT/EE) |
| 5 | Orders attribution | `orders.market_code` + market VAT |
| 6 | Storefront API v1 | 5 endpoints, rate-limited |
| 7 | Geo-routing | `pharm_market` cookie in middleware |
| 8 | Hreflang matrix | lt-LT, et-EE, en tags |

---

## 2. Миграции

| Файл | Назначение |
|------|------------|
| `20260706120000_phase6_international_foundation.sql` | markets, prices, shipping, stations, orders.market_code |

**Всего миграций:** 23

---

## 3. Тесты

| До | После |
|----|-------|
| 29 unit | **44 unit** (+ markets, pricing, shipping, hreflang, storefront parse) |

---

## 4. Сознательно отложено

- React Native / Expo mobile app
- TMS + полные UI-словари lt/et/en
- Stripe multi-currency live + VAT OSS registration
- Omniva/DPD live APIs
- Per-market domains (pharmiperia.lt / .ee)
- Inventory reservations full lifecycle (Phase 5 defer)