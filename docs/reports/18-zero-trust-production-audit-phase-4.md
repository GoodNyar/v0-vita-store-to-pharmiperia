# Отчёт 18 — Zero-Trust Production Audit (Phase 4)

> Дата: 2026-07-04 · Роль: независимый Principal Engineer, нулевое доверие
> Метод: код/миграции прочитаны с нуля; отчёты 16–17 и ADR трактуются как непроверенные утверждения. Прогнано лично: `tsc --noEmit`, `eslint .`, `next build`, `node --test` (полный набор), `validate:production`. Не удалось выполнить: `supabase db:reset` — CLI не установлен (`which supabase` пуст), Docker присутствует; миграции проверены **статически**.

---

# Executive Summary

**Overall verdict: CONDITIONAL PASS**

**Confidence: 80%** — статический анализ, компиляция, сборка и unit-прогон выполнены лично; БД-инварианты (RLS, RPC-поведение при конкуренции, применимость 20 миграций) проверены только чтением SQL, не рантаймом.

**Production readiness: ~72%**

Проект качественно вырос между Phase 3 и Phase 4. Из моего отчёта 15 подтверждённо **закрыты**: `tsc` теперь чист (было 19 ошибок → 0), `next build` проходит (exit 0), webhook получил release-claim (был мой Critical C-1), loyalty получил UNIQUE-индекс, кэш-инвалидация подключена через `catalog-source`, rate-limit получил Upstash-бэкенд, retention-cron реально вызывается, search использует вектор с ilike-fallback. Это добросовестная работа, не косметика.

Но zero-trust прогон вскрыл **свежий High, внесённый round-2 фиксом самого Grok**, **1 падающий тест** (CI будет красным) и то, что **Phase 4 не закоммичена и тега `v4.0-phase4-complete` не существует** — вопреки шапке отчёта 17.

| Ось | Вердикт |
|---|---|
| Компиляция / сборка | **PASS** (tsc 0, build exit 0) |
| Тесты | **FAIL** (22/23; 1 падает → CI red) |
| Webhook идемпотентность | **CONDITIONAL** (claim/release ок, но см. C-1 ниже) |
| Promo / Stripe reconciliation | **PASS** для 1–50%; WARNING extreme % + max_uses TOCTOU |
| RLS / RBAC / secrets | **PASS** |
| Search / SQL-инъекции | **PASS** |
| Server cart | **WARNING** (checkout не читает серверную корзину) |
| Git / process | **FAIL** (Phase 4 вне git, тег отсутствует) |

---

# Findings

## Critical

### C-1 · `alreadyPaid`-guard теряет декремент склада (и письмо) при прерывании цепочки side-effects
**Почему проблема:** порядок в `fulfillOrderFromCheckoutSession` — сначала помечает заказ `paid`, возвращает `alreadyPaid:false`, затем `handleOrderPaid` выполняет email → stock → loyalty. Если декремент бросает **не-insufficient** ошибку (например RPC `RAISE 'Product not found'`), исключение выходит из `handleOrderPaid` → webhook `catch` → `releaseStripeEventClaim` → 500 → Stripe ретраит. На ретрае `fulfillOrderFromCheckoutSession` видит заказ уже `paid` → возвращает `alreadyPaid:true`, и `handleOrderPaid` по round-2-фиксу (A4-M5) **пропускает email, stock и loyalty целиком**. Склад не списывается никогда, а заказ при этом **не** помечается `needs_attention` (это только для insufficient-stock). Тихий inventory drift на оплаченном заказе.
**Файл:** `lib/events/order-paid.ts` — `handleOrderPaid`, ветка `if (!alreadyPaid)`.
**Точная причина:** guard конфлантит «строка заказа уже `paid`» с «все side-effects уже выполнены» — это разные факты.
**Точный фикс:** отслеживать завершённость каждого эффекта отдельно (флаги `inventory_adjusted_at` уже есть у стока, `confirmation_email_sent_at` — у письма, UNIQUE — у loyalty), и в `handleOrderPaid` выполнять их **идемпотентно всегда**, не гейтить по `alreadyPaid`. Именно потому что каждый шаг уже идемпотентен, `alreadyPaid`-skip не нужен и вреден. `alreadyPaid` должен влиять только на аналитику/навигацию, а не на исполнение эффектов.

## High

### H-1 · Падающий unit-тест → CI красный, «pnpm test PASS» неверно
**Почему проблема:** `node --test` (полный `test:commerce`): **23 теста, 22 pass, 1 fail**. Падает `lib/events/order-paid.test.ts` → `runs stock decrement and loyalty accrual after email attempt`: `TypeError: supabase.from is not a function` в `order-paid.ts:64`. Round-2 добавил в `handleOrderPaid` блок `supabase.from('orders').select('promo_code_id, user_id')` + `clearServerCart`, но мок в тесте стабит только `.rpc`, не `.from`. Код и тест разошлись.
**Файл:** `lib/events/order-paid.test.ts` (мок) против `lib/events/order-paid.ts:63-84`.
**Фикс:** дополнить мок Supabase методом `.from().select().eq().maybeSingle()`; заодно добавить кейс на сценарий C-1 (paid + не-insufficient ошибка → повторная доставка). CI-шаг `pnpm test:commerce` сейчас гарантированно красный.

### H-2 · Phase 4 не существует как git-артефакт; заявленный тег отсутствует
**Почему проблема:** `git tag` возвращает только `v1.0-phase1-complete`, `v2.0-phase2-complete`. Тега `v4.0-phase4-complete` (baseline в шапке отчёта 17) **нет**. Ветка — `phase-2/pr-02-commerce-scaffold`; **44 файла** незакоммичены (вся Phase 4). Один `git checkout .` уничтожает фазу; ревью/откат/CI по коммиту невозможны. Нарушение Playbook §13 (та же проблема, что я фиксировал в Phase 3 — воспроизведена).
**Фикс:** закоммитить working tree; тег ставить только после зелёного CI (включая H-1).

## Medium

### M-1 · Facet-счётчики врут при >50 совпадениях
**Почему:** `buildSearchFacets(products)` (`components/search-page-content.tsx:39`) считает фасеты в памяти из массива, ограниченного `limit 50` в `searchProducts`. При выдаче >50 счётчики брендов/категорий занижены. При 100k SKU — систематически неверная фасетная навигация.
**Файл:** `lib/commerce/search-facets.ts` `buildSearchFacets` + `lib/commerce/search.ts:52`.
**Фикс:** агрегировать фасеты в SQL (`count() group by brand/category` по всему match-набору), не по обрезанной выборке.

### M-2 · Promo `max_uses` TOCTOU (признано отложенным в отчёте 17)
**Почему:** `validate_promo_code` проверяет `used_count < max_uses` на этапе draft; `consume_promo_code` инкрементит без повторной проверки лимита. Два параллельных draft на `max_uses=1` оба проходят validate, оба оплачиваются → `used_count` превышает `max_uses`. Подтверждаю по SQL (`20260704190000`): в `consume` нет re-check лимита.
**Файл:** `supabase/migrations/20260704190000_phase4_audit_fixes.sql` `consume_promo_code`.
**Фикс:** резервирование (reservation-RPC на draft с атомарным `used_count < max_uses AND used_count = used_count+1`) или проверка лимита внутри `consume` с откатом заказа в `needs_attention` при превышении.

### M-3 · Extreme-percent промо может бросить на создании сессии
**Почему:** `distributeDiscountAcrossLines` → `reconcileToTarget` бросает `Cannot reconcile...`, если остаток не делится ни на одно `quantity` строки (edge при >99% на multi-qty). Покупатель получит ошибку оплаты.
**Файл:** `lib/stripe/discount-line-items.ts` `reconcileToTarget`.
**Фикс:** fallback — добавить отдельную корректирующую line-item «Discount adjustment» на остаток вместо throw; либо клампить discount так, чтобы каждая строка ≥ 1 цент.

### M-4 · CSP baseline с `unsafe-inline` + `unsafe-eval` (наследие Phase 2, не устранено)
**Почему:** `lib/security/headers.mjs` — `script-src 'unsafe-inline' 'unsafe-eval'`. На странице с платёжным iframe CSP-защита от XSS фактически отключена.
**Фикс:** nonce-based script-src (Next поддерживает через middleware nonce); план должен существовать до масштабирования.

### M-5 · Helpdesk-endpoint пишет тело обращения (PII) в логи
**Почему:** `app/api/helpdesk/ticket/route.ts` — `console.info('[helpdesk/ticket] stub received', body)`. Имя/email/текст уедут в log-drain. Rate-limit есть, PII-логирование — нет.
**Фикс:** логировать только `ticketId` и метаданные.

## Low

- **L-1 · Мёртвый код:** `components/pull-to-refresh.tsx`, `styles/globals.css`, `lib/i18n/dictionary.ts`, `lib/i18n/server-dictionary.ts` — не импортируются ниоткуда (Playbook §1.10). Server-dictionary был целью Phase 3 PR-06, но ни одна страница его не использует; клиентский монолит `translations.ts` (~1900 строк) по-прежнему в бандле.
- **L-2 · E2E не доходит до оплаты:** `e2e/checkout.spec.ts` — единственный тест, до draft-заказа + iframe. Completion → webhook → `paid` не покрыт (честно признано в 17).
- **L-3 · 44 eslint-warnings** (unused-vars, no-restricted-imports, no-img-element): `eslint .` выходит 0 без `--max-warnings`, поэтому дрейф не блокируется.
- **L-4 · `database.types.ts` дополняется вручную** (round-2 добавил `promo_consumed_at` руками): практика, ломавшая typecheck в Phase 3; правильный путь — `pnpm db:types` из миграций.

---

# False Positives (утверждения прошлых отчётов, которые ВЕРНЫ)

Проверено по коду — эти пункты отчётов 16–17 подтверждаются:

1. **Webhook claim атомарен + release на 500** — `claimStripeEvent` (INSERT+23505), `releaseStripeEventClaim` (DELETE) в `catch`. Мой Critical C-1 из отчёта 15 (claim-then-fail теряет событие) — **действительно закрыт** (кроме нового C-1 выше, это другой механизм).
2. **`resolveOrderLines` берёт цены и сток из БД** — подтверждено; чекаут шлёт в `createCheckoutSession` только `{id, quantity}`, цены резолвятся сервером. Мой H-1 из отчёта 12 закрыт.
3. **Confirmation email — атомарный claim** `UPDATE ... .is('confirmation_email_sent_at', null) ... RETURNING` — TOCTOU закрыт, дубль письма невозможен.
4. **Review/abandoned email — atomic claim** (`.is(..., null)`) — подтверждено.
5. **Loyalty UNIQUE(order_id) earn** — индекс `loyalty_transactions_order_earn_unique` существует; двойное начисление через БД заблокировано.
6. **Promo idempotent consume** — `promo_consumed_at` guard в RPC; webhook-ретрай не удваивает `used_count`.
7. **Search: vector RPC + sanitize + ilike fallback** — `sanitizeSearchQuery` чистит `&|!()`, `search_products_vector` через `plainto_tsquery`, при empty/error → ilike с экранированием `%_\`. SQL-инъекции нет.
8. **Cron fail-closed** — нет `CRON_SECRET` → `false` → 401; `no-store`. Retention реально вызывается (`vercel.json` cron).
9. **Middleware сужен** — session-refresh только на account/checkout/api/admin.
10. **Canonical self-referencing** — `localizedPath(locale, ...)`, brand layout locale-aware.
11. **Rate-limit** — Upstash-бэкенд с memory-fallback (не только memory, как было).
12. **Кэш подключён** — `catalog-source` использует `cachedListActiveProducts` и т.д.; `revalidateCatalogTags` вызывается из admin product actions. Мой H-2 из отчёта 15 закрыт.
13. **Секретов в коде нет** — grep по `sk_live`/`whsec_`/JWT чист.
14. **`payment_intent_id` = PI, не session.id** — подтверждено.

---

# Incorrect Claims (неверные/неподтверждённые утверждения прошлых отчётов)

1. **Отчёт 17 шапка: «Baseline `v4.0-phase4-complete` (локально)»** — **неверно.** Тега не существует (`git tag`: только v1, v2). Phase 4 не закоммичена (44 файла в working tree). См. H-2.
2. **Отчёт 17: «Unit tests WARNING (21 тест)» / раздел 3 все email-handlers PASS** — **неверно.** 23 теста, **1 падает** (`order-paid.test.ts`); именно handler, помеченный PASS, ломает тест из-за round-2-правки. См. H-1.
3. **Отчёт 17: `handleOrderPaid` `alreadyPaid` guard = PASS** — **неверно.** Guard вносит потерю декремента склада при прерывании (C-1). Round-2-фикс A4-M5 создал регрессию, а не закрыл риск.
4. **Отчёт 17: «Pipeline не запускался — не блокер кода»** — **частично неверно.** Запуск возможен и выполнен мной: tsc/build/eslint зелёные, но **тесты красные**. «Не блокер» опровергнуто — CI упадёт.
5. **Отчёт 16/17: Server cart cutover** заявлен закрытым feature-gap — **неточно.** Чекаут по-прежнему читает `useCart()` (клиентский), серверная корзина только пишется/чистится и читается retention-батчем. Отчёт 17 в разделе 3 сам это признаёт WARNING — но summary «feature gaps closed PASS» противоречит.

---

# Missing Problems (что Grok полностью пропустил)

1. **C-1 (High→Critical): `alreadyPaid` пропускает декремент склада** при не-insufficient ошибке + ретрае. Это регрессия, внесённая собственным round-2-фиксом Grok (A4-M5) и им же помеченная PASS. Самый опасный из найденного — тихая потеря списания склада на оплаченном заказе.
2. **H-1: собственный тест не обновлён под собственный round-2-код** → CI красный. Grok写 «test PASS», не прогнав.
3. **M-1: facet-счётчики на обрезанной выборке 50** — не упомянуто ни в 16, ни в 17 (перешло из моего отчёта 15 неисправленным).
4. **Ручное редактирование `database.types.ts`** как повторяющаяся практика (L-4) — Grok сам так делает (A4-L2 «добавлен вручную»), не видя в этом системного риска.

---

# Final Verdict

**Would I personally approve deploying to production? — NO (сегодня), YES WITH CONDITIONS (после 4 правок).**

Почему не сегодня: три вещи блокируют деплой независимо от бизнес-готовности.
1. **C-1** — оплаченный заказ может навсегда остаться без списания склада и без пометки `needs_attention`; для магазина это прямой операционный ущерб (продажа того, чего нет). Фикс — часы: убрать `alreadyPaid`-gate вокруг идемпотентных эффектов.
2. **H-1** — CI красный; по определению нельзя деплоить с падающим тестом. Фикс — минуты (обновить мок) + добавить регрессионный кейс на C-1.
3. **H-2** — код не в git и без тега; нечего продвигать по пайплайну и нечем откатываться. Фикс — коммит.

Что НЕ блокирует, но обязательно до реального трафика: M-2 (promo max_uses TOCTOU — деньги/лимиты), плюс внешние пункты из отчётов 04/12, не решаемые кодом (домен, GDPR-процессоры, Sentry DSN, uptime-монитор — `validate:production` сам выдаёт CONDITIONAL GO по трём ops-предупреждениям).

**Что признаю честно:** это уже не прототип. Денежный путь серверный и в основном идемпотентный, RLS/RBAC/секреты/поиск/rate-limit на уровне production; большинство моих находок из отчётов 12 и 15 реально закрыто, а не задекларировано. Разрыв между «заявлено» и «есть» сузился с пропасти (Phase 3) до четырёх конкретных дефектов. Закрыть C-1, H-1, H-2 и M-2 — 1–2 рабочих дня — и я подпишу деплой на staging с обязательным ручным прогоном шести P0-сценариев из отчёта 17 (promo+Stripe multi-line, double-consume, parallel confirmation) на реальной БД, которую я в этой среде проверить не смог.

**Урок для Playbook (повтор из отчёта 15, теперь с доказательством цены):** аудит, который правит код без прогона тестов, вносит регрессии (C-1 и H-1 — оба порождены round-2-фиксами). «Done» подтверждает зелёный CI на закоммиченном коде, а не текст отчёта — чей бы он ни был.

---

# Addendum (2026-07-04): верификация четырёх исправлений

Повторная точечная проверка после fix-коммитов `a838670`, `4433430`.

| Находка | Вердикт | Доказательство |
|---|---|---|
| **C-1** alreadyPaid терял декремент | **PASS** | `handleOrderPaid` больше не гейтит эффекты по `alreadyPaid`; каждый шаг самоохраняется (sent_at / inventory_adjusted_at / UNIQUE / promo_consumed_at); не-stock ошибка декремента по-прежнему throw → release → ретрай перезапускает всё идемпотентно |
| **H-1** красный тест | **PASS** | Полный прогон: **24/24 pass, 0 fail** (тест добавился: 23→24); `tsc` — 0 ошибок |
| **H-2** git/тег | **PASS** | Working tree чист (0 файлов); тег `v4.0-phase4-complete` существует и указывает на HEAD `4433430` |
| **M-2** promo max_uses TOCTOU | **PASS** с остатком | Миграция `20260704200000`: атомарный `UPDATE ... WHERE used_count < max_uses` — счётчик превысить нельзя. **Остаток (Low):** handler игнорирует `false`-результат `consumePromoCode` — случай «заказ оплачен со скидкой сверх лимита» не логируется и не алертится; `promo_consumed_at` остаётся NULL. Рекомендация: `if (!consumed) captureCheckoutError(...)` + пометка заказа |

Вердикт аддендума: условия деплоя из Final Verdict выполнены (C-1, H-1, H-2, M-2 закрыты); остаётся Low-остаток M-2 и внешние ops-пункты `validate:production`.
