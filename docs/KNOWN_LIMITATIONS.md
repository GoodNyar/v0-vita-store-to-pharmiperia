# Known Limitations — v1.0.0-rc.1

> Зафиксированные ограничения релиза. Не баги — осознанный scope для **LV-only v1.0**.

---

## KL-1 · Per-market display pricing vs ISR (B-2)

**Статус:** Accepted for LV-only launch  
**Влияние на LV v1.0:** Нет (при отсутствии `market_product_prices` overrides)

### Описание

Каталожные страницы (главная, категории, бренды, PDP, search) используют ISR с `revalidate = 3600`. В build-таблице они отмечены как `●` (SSG), не `ƒ` (dynamic).

Серверный слой `catalog-source.ts` применяет `applyMarketPricingToCommerceProduct` через `resolveMarketFromCookies()`, но **под ISR HTML цена запекается при prerender/revalidate** — без per-request вариации по cookie `pharm_market`.

### Где market-aware работает корректно

| Путь | Market-aware |
|------|--------------|
| Checkout (`ƒ /[locale]/checkout`) | ✅ Да |
| `createDraftOrder` / Stripe session | ✅ Да |
| Storefront API v1 (`?market=`) | ✅ Да |
| Server cart sync | ✅ Да |
| ISR catalog pages (●) | ⚠️ LV-baked до revalidate |

### Когда станет проблемой

При запуске **LT/EE** или при добавлении **market price overrides** в `market_product_prices`: витрина может показать LV-цену, а checkout спишет рыночную.

### Mitigation для v1.0

- Запуск только для **Латвии** (один рынок, один VAT 21%)
- Таблица `market_product_prices` без production overrides
- Документировано в Release Notes и Launch Checklist

### Remediation (post-v1.0 / pre LT-EE)

- Сегментация ISR-кэша по рынку, или
- Перевод каталога на dynamic rendering для цен, или
- Client-side price hydration из Storefront API

**Ссылка:** [Отчёт 23, B-2](reports/23-final-release-candidate-audit.md)

---

## KL-2 · LT/EE parcel stations в веб-checkout (L-3)

**Статус:** Deferred  
**Влияние на LV v1.0:** Нет

Веб-checkout использует хардкод латвийских Omniva-станций. LT/EE станции доступны только через Storefront API (`/api/storefront/v1/parcel-stations`).

---

## KL-3 · Inventory reservations

**Статус:** Disabled (`INVENTORY_RESERVATIONS_ENABLED` ≠ `true`)  
**Влияние на LV v1.0:** Нет (резервации не создаются)

Включение флага без полного lifecycle (consume on paid, cron expiry, checkout gate) вернёт дефект Phase 5.

---

## KL-4 · CSP `unsafe-inline`

**Статус:** Deferred (Phase 2)  
**Влияние на LV v1.0:** Low security debt

Nonce-based CSP не внедрён.

---

## KL-5 · Runtime DB verification

**Статус:** Pending staging  
**Влияние на LV v1.0:** Требует Bug Bash на staging

`supabase db:reset` + сквозной checkout не прогонялись в CI-агенте. Обязательно на staging перед GA.