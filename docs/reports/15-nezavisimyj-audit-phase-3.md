# Отчёт 15 — Независимый аудит Phase 3 (проверка отчёта Grok)

> Дата: 2026-07-04 · Роль: независимый Staff/Principal Engineer
> Проверяемый документ: `13-self-audit-phase-3.md` (Grok) · Бриф: `14-claude-audit-brief.md`
> Метод: изучены Playbook, ADR 0001–0025, все отчёты; затем — независимый прогон пайплайна (то, что Grok сделать не смог) и построчная верификация каждого утверждения по коду. Ни один вывод Grok не принят без доказательства.

---

# Executive Summary

**Общая оценка проекта: 6/10**

| Ось | Вердикт |
|---|---|
| Production readiness | **FAIL** — проект не компилируется: `tsc --noEmit` даёт **19 ошибок** в 6 файлах; `next build` гарантированно красный (ignoreBuildErrors отсутствует); 2 из 5 тест-файлов падают |
| Архитектура | **WARNING** — направление верное (events, server cart, RBAC, DB-цены в заказах), но три подсистемы — «инфраструктура без потребителей» (cache-tags, search_vector, i18n-loader) |
| Безопасность | **PASS** — promo-enumeration закрыт, RBAC/RLS корректны, секретов в коде нет, вебхук с подписью; оговорки: helpdesk логирует PII, CSP-baseline из Phase 2 |
| Масштабируемость | **WARNING** — поиск фактически остался `ilike` (search_vector не используется), фасеты считаются в памяти по выборке ≤50 строк, legacy-мост `lib/data.ts` жив |

Главный систематический вывод: **Phase 3 не существует в git.** 75 файлов — незакоммиченный working tree на ветке `phase-2/pr-02-commerce-scaffold`; «30 PR» из плана и отчёта — нарратив, а не артефакты. Ни одного phase-3 коммита, ни тега. Это нарушение Playbook §13 и причина, по которой некомпилирующийся код называется «PASS»: его никогда не прогонял ни один CI.

---

# Проверка отчёта Grok

Легенда: PASS — подтверждено; PARTIAL — существует, но не как заявлено; FAIL — опровергнуто.

| # | Утверждение Grok | Вердикт | Доказательство |
|---|---|---|---|
| 1 | Pipeline FAIL «sandbox не запускает» | **PASS** (честно) | Я прогнал: результаты ниже — хуже, чем Grok предполагал |
| 2 | «Код/архитектура PASS» | **FAIL** | `tsc --noEmit`: 19 ошибок — `lib/cache/revalidate.ts` (8: `revalidateTag` в Next 16 требует 2 аргумента), `lib/database.types.ts` (2: дубликат `order_id`, строки 928/930), `lib/events/index.ts`, `lib/commerce/server-cart.ts` (TS2352), `products.test.ts`, `order-paid.test.ts` |
| 3 | ADR-0004 commerce layer PASS | **PASS** | server actions → `lib/commerce`; strangler-остатки — 10 lint-warnings (как и в Phase 2) |
| 4 | ADR-0005 webhook PASS («claim → fulfill → dispatch») | **PARTIAL** | Claim атомарен (`claimStripeEvent` INSERT+23505, [lib/orders.ts:212-228](../../lib/orders.ts)) ✓, но **retry-семантика потеряна**: ошибка после claim → 500 → повторная доставка получает `duplicate` → событие потеряно навсегда (см. Critical C-1) |
| 5 | ADR-0006 ISR PASS (WARNING) | **PARTIAL** | `export const revalidate = 3600` на 7 страницах ✓. Но tags: **ни одна страница не импортирует `lib/cache/catalog`** (grep пуст), а `lib/cache/revalidate.ts` не компилируется → инвалидация из админки не работает вообще; правка товара видна через час TTL |
| 6 | Events scaffold (0022) PASS | **PASS** | `dispatchCommerceEvent` → `handleOrderPaid`: email non-blocking, insufficient stock → `needs_attention` (закрыт мой H-2 из отчёта 12) ✓ |
| 7 | Server cart (0023) PASS | **PARTIAL** | Миграция+RLS owner ✓, merge подключён (`cart-context.tsx:169`) ✓. Но корзину сервера **никто не читает при чекауте** — источник истины по-прежнему localStorage; читатель один — abandoned-cart (который сам не вызывается). ADR честно называет это этапом; отчёт — нет |
| 8 | Loyalty (0024) PASS | **PARTIAL** | RPC идемпотентен по order_id логически, но **без UNIQUE(order_id,type)** — конкурентный дубль начисления возможен; ошибка начисления в handler'е — `console.warn` → баллы теряются молча |
| 9 | Search pg_trgm (0025) PASS | **PARTIAL** | Миграция (extension, `search_vector`, триггер) есть ✓, но [lib/commerce/search.ts:49](../../lib/commerce/search.ts) по-прежнему ищет **`ilike`** — вектор не используется ни одним запросом; индекс мёртвый |
| 10 | Промо: enumeration закрыт, RPC PASS | **PASS** (в своём объёме) | `DROP POLICY promo_codes_select_active` + `is_admin()` select + `validate_promo_code` SECURITY DEFINER с FOR UPDATE ✓. Но см. New-M3: промо не подключён к чекауту |
| 11 | Миграции 7/7 PASS | **PARTIAL** | 6 ок; loyalty — без unique-констрейнта (п.8); search — мёртвая (п.9) |
| 12 | RLS/RBAC PASS | **PASS** | Проверено: roles CHECK (customer/support/manager/admin), `is_staff()`/`has_staff_role()`, products write — только admin+manager (WITH CHECK); матрица `lib/admin/rbac.ts` совпадает с миграцией; `requirePermission` на всех admin actions и promo-странице |
| 13 | Middleware narrowed PASS | **PASS** | `pathnameNeedsSessionRefresh` — session refresh только на account/checkout/api/admin/protected; каталог публичный ([middleware.ts:59-117](../../middleware.ts)). Мой H-4 (часть 1) закрыт |
| 14 | SEO canonical self-referencing PASS | **PASS** | [lib/seo/metadata.ts:41](../../lib/seo/metadata.ts): `canonical: localizedPath(locale, basePath)` ✓; brand layout — `buildPageMetadata` с locale ✓. Мой H-3 закрыт |
| 15 | `resolveOrderLines` DB prices+stock PASS | **PASS** | Функция async, `getProductByLegacyId` из commerce, проверка `stockQuantity < quantity` ([lib/orders.ts:56-84](../../lib/orders.ts)). Мой H-1 закрыт |
| 16 | `payment_intent_id` = PI PASS | **PASS** | [lib/orders.ts:279-288](../../lib/orders.ts): `session.payment_intent`, fallback session.id. Мой M-9 закрыт |
| 17 | Dead code удалён (getCheckoutSession, checkout/success, hasProcessed/record) PASS | **PASS** | grep пуст по всем трём; `checkout/success` — `D` в git status |
| 18 | `database.types.ts` WARNING «CI проверит» | **FAIL** | Файл **не компилируется** (duplicate identifier `order_id`) — ручная правка сгенерированного файла сломала его; CI-джоб дрейфа упадёт дважды (drift + typecheck) |
| 19 | Тесты 5 файлов PASS | **FAIL** | Прогон: `money` 4/4 ✓, `products` ✓, `search-facets` ✓; **`orders.resolveOrderLines.test.ts` — 5/5 cancelled** (`mock.module is not a function` — API недоступен в tsx/node-раннере без флага), **`order-paid.test.ts` — интеграционный тест падает**. Тесты на деньги/заказы никогда нигде не проходили |
| 20 | CI test step PASS (добавлено) | **PARTIAL** | Шаг есть, `test:commerce` включает все 5 файлов — CI честно **покраснеет** на тех же ошибках. Конфиг есть, зелёного пайплайна нет |
| 21 | «as any / @ts-ignore пуст» PASS | **PASS** | grep подтверждает; но TS2352-каст в server-cart.ts — та же болезнь под другим синтаксисом |
| 22 | Helpdesk stub PASS (WARNING про console) | **PASS** | Rate-limit есть; `console.info(body)` — PII в логи (подтверждено) |
| 23 | AI v2 scaffold WARNING | **PASS** (честно) | `getCachedRecommendations` всегда возвращает `fallback []` — чистый стаб |
| 24 | E2E completion WARNING | **PASS** (честно) | Спек по-прежнему до draft-заказа + iframe |
| 25 | Секреты PASS | **PASS** | grep по sk_/whsec_/JWT-паттернам — только плейсхолдеры |
| 26 | Retention (25–29) WARNING «scaffolds» | **PARTIAL** | Хуже, чем WARNING: welcome вызывается из auth callback ✓, но **abandoned-cart и review-request не вызываются ниоткуда** (нет cron/queue; grep коллеров пуст) — это не scaffold, это мёртвый код с шаблонами |
| 27 | i18n: server dictionary loader (PR-06) | **FAIL** как фича | `lib/i18n/server-dictionary.ts` существует, но **ни одна страница его не использует** (grep пуст); клиентский монолит 1859 строк — без изменений |

**Счёт по 27 проверкам: 13 PASS · 8 PARTIAL · 4 FAIL (+2 «честных FAIL» Grok подтверждены).**

---

# Найденные новые проблемы (Grok не увидел)

## Critical

**C-1 · Claim-then-fail: платёжное событие теряется навсегда.**
`claimStripeEvent` вставляет `event.id` **до** обработки; при любом сбое `fulfillOrderFromCheckoutSession`/`dispatchCommerceEvent` (сетевая ошибка БД, amount mismatch, не-стоковая ошибка декремента — она `throw`) вебхук возвращает 500, Stripe ретраит — но повторная доставка получает `!claimed → duplicate` и **обработка не повторится никогда**. Оплаченный заказ навсегда останется `pending`, письмо не уйдёт, сток не спишется. Phase 2 имела обратную проблему (гонка, мой M-10); Phase 3 «исправила» её, поменяв на худшую: гонка была маловероятной, а сбой обработки — обычное дело. **Fix:** claim со статусом `processing` + удаление/release claim'а в catch, либо отметка `completed` только в конце + повтор обработки для `processing`-строк.

**C-2 · Phase 3 не существует как git-история.**
75 изменённых/новых файлов не закоммичены; ветка — `phase-2/pr-02-commerce-scaffold`; заявленные «30 PR» не существуют. Один `git checkout .` уничтожает всю фазу. Ни ревью, ни CI, ни откат невозможны. Нарушение Playbook §13 в максимальной форме.

## High

**H-1 · Проект не компилируется (19 ошибок tsc) → build FAIL.**
Виновники — преимущественно файлы, добавленные «исправлениями самоаудита»: `lib/cache/revalidate.ts` написан под API Next 15 (`revalidateTag(tag)`), тогда как в Next 16 сигнатура двухаргументная — все 8 вызовов невалидны; ручная правка `database.types.ts` создала дубликат поля. Код никогда не проходил компилятор.

**H-2 · Инвалидация кэша — мёртвая проводка.**
Слой `lib/cache/catalog.ts` (unstable_cache+tags) не используется ни одной страницей; страницы сидят на голом `revalidate=3600`. Следствие: admin-правка товара (цена/сток) невидима на витрине до часа, «revalidateCatalogTags» из admin actions инвалидирует теги, на которые никто не подписан (и не компилируется). Заявленная цель Phase 3 №1 («ISR + cache tags») выполнена наполовину и создаёт ложную уверенность.

**H-3 · Тестовый раннер несовместим с собственными тестами.**
`mock.module` требует Node-флага `--experimental-test-module-mocks` (или иного раннера); `test:commerce` не передаёт его → 5 тестов заказа cancelled везде, включая CI. Деньги/заказы снова без работающих тестов — при формально «существующих» файлах.

## Medium

**M-1 · Поиск: инфраструктура без потребителя.** `search_vector` + GIN живут в БД, код ищет `ilike` по трём колонкам; при 100k SKU — seq-scan-паттерн и нерелевантная выдача. Плюс **фасеты считаются в памяти по выборке `limit 50`** — счётчики фасетов врут, как только совпадений больше 50.
**M-2 · Loyalty: нет UNIQUE(order_id, type)** → двойное начисление в гонке; ошибки начисления глотаются `console.warn` без механизма повтора.
**M-3 · Промо не участвует в заказе:** `discount_cents: 0` захардкожен в `createDraftOrder`; `validatePromoCode` не вызывается из чекаута; поля промокода в UI нет. Backend+admin есть, функции для покупателя нет.
**M-4 · Retention-письма без триггеров:** abandoned-cart и review-request не вызываются ниоткуда (нет cron/scheduler); «PR-13/29» — шаблоны без доставки.
**M-5 · Server cart — теневая запись:** чекаут и цена считаются из клиентского localStorage; сервер-корзина только пишется при merge и читается несуществующим abandoned-cart'ом.
**M-6 · Ручное редактирование `database.types.ts`** как практика: сгенерированный файл правится руками → сломан сейчас и будет ломаться впредь; правильный путь — миграция → `pnpm db:types`.

## Low

**L-1** Helpdesk-stub пишет весь body (имя/email/текст обращения) в логи — PII в log-drain.
**L-2** `lib/events/index.ts` — exhaustive-check через `never` на одночленном union не компилируется; сигнал, что файл не прогонялся.
**L-3** `lib/i18n/server-dictionary.ts` и `dictionary.ts` — мёртвые файлы (ни одного импорта).
**L-4** Фасеты `search-facets.tsx` — "use client" пересчёт по props; при росте выдачи уедет в бандл/CPU клиента.
**L-5** `catalog-source.ts` держит `legacyById Map` из `lib/data.ts` в памяти модуля — при цели 100k SKU мост обязан умереть до массового импорта (сейчас ~16 записей, риск отложенный).

---

# Что Grok оценил правильно

- **Честность о непрогнанном пайплайне** — главный дисклеймер отчёта 13 оказался решающим: всё, что Grok не смог прогнать, действительно красное.
- Закрытие всех четырёх High из отчёта 12 (H-1 DB-цены/сток, H-2 needs_attention, H-3 canonical, H-4 middleware) — подтверждаю по коду.
- RLS/RBAC-слой: миграции, матрица, guards — заявлено PASS, и это PASS.
- Признанные WARNING (AI-стаб, e2e без оплаты, i18n-бандл, CSP, helpdesk-console) — все подтвердились.
- Удаление мёртвого кода Phase 2 (getCheckoutSession, checkout/success, старые webhook-хелперы) — сделано.

# Что Grok переоценил

- **«Код/архитектура PASS»** — код не компилируется; PASS невозможен по определению.
- **Тесты (5×PASS)** — два файла из пяти не работают ни в одной среде; «PASS» присвоен файлам, а не результатам.
- **ISR + tags** — засчитан слой, который не подключён к страницам и не компилируется.
- **Search 0025** — засчитана миграция, а не функция: продукт ищет так же, как до Phase 3.
- **Собственные «исправления в ходе аудита»** — 3 из 8 внесённых правок (types, revalidate, cart-merge каст) внесли ошибки компиляции; самоаудит, который правит код без прогона компилятора, ухудшает то, что аудирует.

# Что Grok недооценил

- **Отсутствие git-артефактов Phase 3** — не упомянуто вовсе; это крупнейший операционный риск состояния.
- **Потерю retry-семантики вебхука** (C-1) — «atomic claim PASS» без анализа отказа после claim.
- **Мёртвые триггеры retention** — «WARNING scaffolds» звучит мягче, чем «письма никогда не отправятся».
- Гонку loyalty и молчаливую потерю начислений.
- Ложные счётчики фасетов на limit 50.

---

# Top-20 рекомендаций (Impact / Effort)

1. **Закоммитить working tree** немедленно (WIP-коммит сегодня, нарезка на PR — потом) — Impact: экзистенциальный / Effort: минуты.
2. **Починить 19 ошибок tsc** (revalidate.ts под Next 16 API, перегенерировать database.types.ts, events/index, server-cart каст, фикстуры тестов) — High/1 день.
3. **Retry-семантика вебхука**: claim → `processing`, release в catch (или status-machine) — Critical/полдня.
4. **Раннер тестов**: `--experimental-test-module-mocks` в script (или vitest) → 5 тестов заказа реально зелёные — High/часы.
5. **Подключить страницы к `lib/cache/catalog`** (или честно удалить слой и tags-инвалидацию из admin) — High/1 день.
6. Прогнать `pnpm build` локально до зелёного и только потом объявлять фазу — High/после п.2.
7. **UNIQUE(order_id, type)** на loyalty_transactions + повтор начисления при рестарте события — Medium/часы.
8. **Search: перевести `searchProducts` на `search_vector`** (websearch_to_tsquery + ts_rank, trgm-fallback) — Medium-High/1 день.
9. Фасеты — агрегация в SQL (count по фасету), не в памяти по limit 50 — Medium/1 день.
10. Промокод в чекауте: поле + `validatePromoCode` + `discount_cents` в draft + инкремент used_count при оплате — Medium/1–2 дня.
11. Cron/Trigger для abandoned-cart и review-request (Vercel cron → route) — Medium/1 день.
12. Убрать `console.info(body)` из helpdesk; логировать только ticketId/метаданные — Low/минуты.
13. Запретить ручные правки `database.types.ts` (CI уже ловит; добавить заметку в Playbook §3 Supabase) — Low/минуты.
14. Удалить или подключить `lib/i18n/server-dictionary.ts` (мёртвый файл против Playbook §1.10) — Low/минуты.
15. `pnpm lint --max-warnings 0` в CI после чистки 49 warnings (26 unused-vars) — Medium/полдня.
16. E2E: дожать до completion (Stripe test card) + assert `paid`+decrement — Medium/1–2 дня.
17. Server cart как источник чекаута для auth-пользователей (Phase 3 follow-up ADR-0023) — Medium/2–3 дня.
18. Тег `v3.0-phase3-complete` ставить только на зелёный CI — Process/0.
19. План умерщвления `lib/data.ts`-моста до импорта реального каталога (UI-extras → БД) — Medium/2 дня.
20. Loyalty: перевод `console.warn` в Sentry + отчёт «не начисленные заказы» в админке — Low/часы.

---

# Итоговый CTO Verdict

**Phase 3 завершённой считать нельзя.** По содержанию это ~70% фазы: серверная сторона заказа заметно повзрослела (DB-цены, needs_attention, PI, RBAC v1, промо-RPC, канонический SEO, суженный middleware — всё это реально и проверено). Но фаза одновременно: (а) **не существует в git**, (б) **не компилируется**, (в) три её флагманские цели — cache-tags, полноценный поиск, retention-петля — построены как инфраструктура без потребителей, что опаснее их отсутствия: команда считает их «сделанными».

**До уровня Production необходимо (в порядке):** коммит + зелёный `tsc/lint/build/test` (пп. 1–4, 6) → retry-семантика вебхука (п. 3) → подключение кэш-инвалидации или её честное удаление (п. 5) → работающий поиск по вектору (п. 8) → loyalty-констрейнт (п. 7). Это 3–5 рабочих дней. Всё остальное (промо в чекауте, cron-письма, server-cart cutover) — легитимный Phase 4.

Оценка зрелости по шкале отчёта 12: **C+ сегодня** (не компилируется), **B после пунктов 1–6**. Урок фазы для Playbook: *«done» объявляет не автор и не аудитор без рантайма — «done» объявляет зелёный CI на закоммиченном коде.*
