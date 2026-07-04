# Отчёт 12 — Независимый аудит после Phase 1–2

> Дата: 2026-07-04 · Роль: независимый Principal Engineer / технический аудитор
> Ветка: `phase-2/pr-02-commerce-scaffold` @ `ce9789e` · 364 файла
> Метод: **без доверия к отчётам проекта** — все утверждения проверены чтением кода, миграций и **независимым прогоном** `tsc --noEmit` (exit 0, 0 ошибок) и `eslint .` (0 errors, 46 warnings). Отчёты 02–07 описывают состояние ДО Phase 1–2 и к текущему коду неприменимы.

## Резюме

Проект трансформирован радикально и в основном честно: серверный путь заказа с вебхуком, подписью и идемпотентностью существует и реализован грамотно; деньги — в центах сквозь весь код; RBAC двухслойный (layout-guard + RLS `is_admin()`); CI проверяет дрейф типов против миграций (редкая зрелость). Но независимая проверка нашла **4 High-дефекта**, три из которых — следствие незавершённого strangler'а: заказ до сих пор ценится и валидируется по legacy-каталогу `lib/data.ts`, oversell превращает вебхук в вечный retry-loop после списания денег, canonical русских страниц указывает на латышские, а RSC-каталог работает без какого-либо кэша.

---

## 1. Архитектура

**Соответствие ADR (проверено по коду):**

| ADR | Заявлено | Фактически |
|---|---|---|
| 0001 каталог в Supabase | реализуется в B6 | **Частично.** Витрина — через `catalog-source.ts` (мост DB↔legacy c `CATALOG_SOURCE`-флагом и merge legacy-полей). Но `resolveOrderLines` ([lib/orders.ts:56-86](../../lib/orders.ts)) читает **`products` из `lib/data.ts`** — см. H-1 |
| 0002 деньги в центах | принят | **Да.** `lib/money.ts` (integer-guard, VAT-extraction), `*_cents`-колонки, `Money` даже в клиентском каталоге. Проверено |
| 0003 слаги + локаль | принят | **Да.** `app/[locale]`, `products/[slug]`, 301 с legacy-ID (`middleware.ts:50-69`), cookie локали |
| 0005 вебхук — источник оплаты | принят | **Да.** Подпись, идемпотентность по `event.id`, сверка `amount_total` с draft'ом, `alreadyPaid`-guard |
| 0006 RSC-first + ISR | принят | **Наполовину.** Каталог и контент — RSC (проверено: нет `"use client"` на страницах), но **ни одного `revalidate`/cache tag во всём `app/[locale]`** (grep пуст) — см. H-4 |
| 0007 i18n namespaces | план C3 | Не начат (по плану); словарь 1859 строк по-прежнему в клиентском бандле через `lib/i18n.tsx` |
| 0018 RBAC / 0019 inventory | приняты | **Да.** Проверены миграции и вызовы |

**Разделение ответственности:** `lib/commerce` (18 модулей), `lib/stripe`, `lib/money`, `lib/admin` — границы реальные. ESLint-правило strangler'а (`no-restricted-imports` на прямой Supabase-клиент) существует, но в режиме `warn` и **10 call-sites ещё нарушают** его (подтверждено прогоном).

**Качество lib/commerce:** хорошее — `server-only`, типы из сгенерированной схемы, явные списки колонок, typed errors. Слабое место — `catalog-source.ts`: мост «DB-цены + legacy-UI-поля» — это признанный временный слой, но он просочился в критичное место (заказы), см. H-1.

## 2–7. Находки

### High

**H-1 · Заказ ценится и валидируется по legacy-каталогу, а не по БД**
- **Где:** [lib/orders.ts:4,62-70](../../lib/orders.ts) — `resolveOrderLines` берёт `products` из `lib/data.ts`: цену (`product.price`) и доступность (`product.inStock`, захардкоженное `true`).
- **Почему проблема:** нарушает ADR-0001/0004 в единственном месте, где цена превращается в списание денег. Витрина показывает цену из БД (мост), чекаут проверяет legacy-массив. Сегодня seed генерируется из data.ts и цены совпадают; после первого же изменения цены в БД (админкой или миграцией) покупатель увидит одну цену, а заплатит другую.
- **Последствия:** ценовой дрейф PDP↔charge; сток из БД вообще не участвует в решении «можно ли продать».
- **Исправление:** `resolveOrderLines` должен резолвить строки через `lib/commerce/products` (цена + `stock_quantity >= qty`) тем же `catalogProductId`-UUID, что уже пишется в `order_items`.

**H-2 · Oversell превращает вебхук в вечный retry-loop после оплаты**
- **Где:** цепочка [lib/orders.ts:68](../../lib/orders.ts) (сток не проверяется по БД) → RPC `decrement_stock` бросает `Insufficient stock` (`supabase/migrations/20260703190000:47-49`) → [app/api/webhooks/stripe/route.ts:58,80-88](../../app/api/webhooks/stripe/route.ts) — исключение до `recordStripeEvent` → 500 → Stripe ретраит бесконечно.
- **Почему проблема:** деньги списаны, заказ помечен `paid` (fulfill успел), но декремент падает вечно, письмо покупателю **никогда не уходит** (оно после декремента), событие не записывается.
- **Последствия:** оплаченный «отравленный» заказ, тихо застрявший в ретраях; обнаружится только по жалобе клиента или Sentry-шуму.
- **Исправление:** (1) проверять сток из БД при `createDraftOrder`; (2) в вебхуке отделить судьбу декремента от письма: `Insufficient stock` → пометить заказ `needs_attention` + алерт, вернуть 200; (3) письмо слать до/независимо от декремента.

**H-3 · Canonical русских страниц указывает на латышские — RU-версия исключена из индекса**
- **Где:** [lib/seo/metadata.ts](../../lib/seo/metadata.ts) `buildHreflangAlternates`: `canonical: absoluteUrl(localizedPath('lv', basePath))` — для **любой** локали.
- **Почему проблема:** canonical — указание «главной» версии; RU-страницы объявляют себя дубликатами LV. hreflang рядом корректный, но canonical сильнее: Google выкинет `/ru/*` из индекса.
- **Последствия:** весь русскоязычный SEO-клин (ключевой в бизнес-плане) не индексируется. Систематически, через общий helper — на каждой странице.
- **Исправление:** self-referencing canonical: `canonical = absoluteUrl(localizedPath(locale, basePath))`; `x-default` оставить на lv.

**H-4 · RSC-каталог без кэша + auth-запрос middleware на каждом маршруте**
- **Где:** grep `revalidate|cacheTag|unstable_cache` по `app/[locale]` и `lib/commerce` — пусто; [middleware.ts:74-101](../../middleware.ts) вызывает `updateSession` (внутри — `supabase.auth.getUser()`, сетевой вызов) на каждом HTML-запросе, включая контент и каталог.
- **Почему проблема:** каждая загрузка каждой страницы = 1 auth-запрос + N каталожных запросов к Supabase. Это половина ADR-0006: RSC сделан, ISR — нет.
- **Последствия:** TTFB зависит от Supabase на статичном по сути контенте; лимиты Auth API станут первым бутылочным горлышком под трафиком; расходы растут линейно с просмотрами.
- **Исправление:** `revalidate`+tags на каталожных страницах и запросах; `updateSession` — только на `/account|/admin|/checkout|/api` матчерах.

### Medium

**M-1 · `promo_codes` перечислимы анонимом — политика перенесена в новый baseline.** [supabase/migrations/20260703120000_baseline.sql:276](../../supabase/migrations/20260703120000_baseline.sql): `FOR SELECT USING (is_active = TRUE)`. Старая находка (отчёт 02) воспроизведена в свежей миграции. Исправление: убрать публичный SELECT, валидировать код через RPC.

**M-2 · Rate limit — in-memory `Map` в serverless.** [lib/rate-limit/memory.ts](../../lib/rate-limit/memory.ts): счётчики живут в памяти инстанса — обнуляются на cold start, не разделяются между инстансами/регионами. Для Vercel это «лимит на один прогретый контейнер», не лимит. ADR-0011 формально выполнен, фактически защита слабая. Исправление: Upstash/Redis-бэкенд (интерфейс уже отделён — замена дешёвая).

**M-3 · CSP-baseline разрешает `unsafe-inline` + `unsafe-eval` и `img-src http:`.** [lib/security/headers.mjs](../../lib/security/headers.mjs). Для страницы с платёжным iframe это слабо: XSS-защита от CSP фактически выключена (`unsafe-inline` в script-src). Признано как baseline (PR-29), но план ужесточения (nonce-based) должен существовать.

**M-4 · Lint-гейт не блокирует дрейф.** CI гоняет `eslint .`, который выходит 0 при **46 warnings**, включая 10 нарушений strangler-правила и 9 raw `<img>` (противоречит ADR-0021). Без `--max-warnings 0` (или точечного error-режима) правило-предупреждение — декорация.

**M-5 · Деньги не покрыты тестами; e2e не доходит до оплаты.** Единственный unit-файл — `lib/commerce/products.test.ts` (79 строк); `lib/money.ts` и `resolveOrderLines` — 0 тестов (нарушение собственного Playbook §12 «деньги без тестов не мержатся»). E2E ([e2e/checkout.spec.ts](../../e2e/checkout.spec.ts)) проверяет draft-заказ и появление Stripe-iframe, но не completion → вебхук → `paid` → декремент. Самая ценная половина пути не проверяется автоматически.

**M-6 · Клиентский словарь-монолит.** `lib/i18n.tsx` реэкспортирует все 1859 строк переводов в бандл каждой страницы. По плану (C3) — но в бандле уже сегодня; учтено в оценке производительности.

**M-7 · `getCheckoutSession` — неиспользуемый публичный server action с PII.** [app/actions/stripe.ts:127-139](../../app/actions/stripe.ts): grep по использованию пуст; action компилируется в публичный endpoint, возвращающий email по session id. Повтор находки 07/B-13 — не закрыта. Удалить или auth-гейт.

**M-8 · Недостижимый дубликат «спасибо»-экрана.** `app/[locale]/checkout/success/` существует, ссылок на него нет (`redirect_on_completion: "never"` + inline-шаг). Повтор 07/A-8 — не закрыт.

**M-9 · `payment_intent_id` хранит `session.id`.** [lib/orders.ts:256](../../lib/orders.ts): в колонку пишется `cs_...` вместо настоящего PaymentIntent. Возвраты (returns-флоу уже есть!) потребуют PI — придётся доставать через API по session. Писать `session.payment_intent`.

**M-10 · Идемпотентность вебхука не атомарна.** `hasProcessedStripeEvent` (check) и `recordStripeEvent` (insert в конце) разнесены — параллельная доставка одного события проходит обе. Downstream-guard'ы (alreadyPaid, RPC `FOR UPDATE`, `confirmation_email_sent_at`) спасают, но у письма TOCTOU-окно read→send → возможен дубль письма. Исправление: `INSERT ... ON CONFLICT DO NOTHING RETURNING` в начале как атомарный claim.

### Low

- **L-1** Health: deep-check fail-open — без `MONITORING_HEALTH_TOKEN` глубокая проверка публична ([app/api/health/route.ts:8-11](../../app/api/health/route.ts)).
- **L-2** Мёртвые остатки: `components/pull-to-refresh.tsx`, `styles/globals.css`, `popular.png`, `specials.png`, `tsconfig.tsbuildinfo` в корне.
- **L-3** 26 unused-vars предупреждений (включая `isLocale` в `lib/supabase/proxy.ts:3`).
- **L-4** `detectLocale`: `accept.includes("ru")` игнорирует q-веса и позицию — `en;q=1, ru;q=0.1` даст ru.
- **L-5** НДС извлекается из общего total, не по строкам — при единой ставке 21% корректно, дрейф со Stripe логируется; сломается при второй ставке (пометить в коде).
- **L-6** CI `build` с placeholder-`NEXT_PUBLIC_*` — артефакт не деплоится, но паттерн провоцирует «случайно задеплоенный плейсхолдер».

### Проверено — замечаний нет

- **Stripe-подпись** (`constructEvent` с raw body) ✓ · **сверка суммы** сессии с draft'ом ✓ · **серверные цены** (клиент шлёт только id+qty) ✓
- **RPC `decrement_stock`**: `FOR UPDATE`, guard `inventory_adjusted_at`, проверка отрицательного стока — корректная идемпотентная транзакция ✓
- **RBAC**: `requireAdmin()` в layout **и** в каждом admin server action, плюс RLS `is_admin()` SECURITY DEFINER — двухслойно ✓
- **RLS**: включён на всех новых таблицах (analytics_events, search_queries, return_requests, stripe_webhook_events) ✓
- **Секреты**: service-role только в `server-only` модуле; `.env*` в gitignore; в коде секретов нет ✓
- **SQL-инъекции**: запросы параметризованы; поиск через `ilike` с экранированием — проверено `lib/commerce/search.ts` ✓
- **IDOR**: заказы читаются под RLS own; admin — под ролью; success-экран не принимает order_id из URL ✓
- **CSRF**: мутации — server actions (Origin-check Next) + вебхук подписью ✓ · **SSRF**: исходящих запросов по пользовательским URL нет ✓
- **XSS**: JSON-LD экранируется? — `lib/commerce/json-ld.ts` не проверял построчно; React-экранирование по умолчанию; `dangerouslySetInnerHTML` только для JSON-LD (низкий риск, admin-данные)
- **Миграции**: линейные, датированные, baseline соответствует `db reset` в CI; **CI-джоб дрейфа типов против миграций** — образцовый ✓
- **Email**: идемпотентность через `confirmation_email_sent_at` c conditional update ✓
- **Captcha** (Turnstile) на login/sign-up через server action ✓

## 8. Оценки

| Категория | Оценка | Обоснование |
|---|---|---|
| Архитектура | **7/10** | слои реальны, ADR в основном соблюдены; −2 за legacy-мост в заказах (H-1), −1 за незакрытый strangler (10 call-sites) |
| Безопасность | **7/10** | фундамент сильный (подпись, RLS, RBAC, captcha, серверные цены); −1 CSP-baseline, −1 promo-enumeration + in-memory rate limit, −0.5 публичный action |
| Производительность | **5/10** | RSC без единого кэша, auth-вызов на каждом маршруте, словарь-монолит в бандле, 9 raw img; image-optimization включена ✓ |
| Поддерживаемость | **7/10** | типы из схемы + drift-check, тонкие модули, typecheck 0; −2 за legacy-остатки/46 warnings, −1 за тонкие тесты |
| Масштабируемость | **6/10** | правильные опоры (URL, деньги, RBAC, миграции); упрётся в H-4 и мост H-1 раньше, чем в что-либо ещё |
| Production Readiness | **6/10** | денежный путь работает и наблюдаем (Sentry, health, e2e-cron); блокируют H-1…H-4 + внешние вопросы (домен/ключи — вне кода) |

## Вердикт: **B — готов к production после небольших исправлений**

…с жёстким условием: **все четыре High обязательны до запуска** (суммарно ~3–5 рабочих дней: H-3 — одна строка; H-2 — обработка ошибки декремента + порядок письма; H-1 — переключение `resolveOrderLines` на `lib/commerce`; H-4 — revalidate + сужение middleware). Без них — твёрдое C: продавать можно, но первый же oversell или переоценка товара создаст инцидент с деньгами, а RU-SEO не существует. Medium-список (M-1…M-10) — первая неделя после запуска; ни один не блокирует.

Отдельно, как независимый аудитор, фиксирую: **самопроверка проекта честна** — CI действительно проверяет то, что заявляет (typecheck/lint/build/drift воспроизведены локально с теми же результатами), а прогресс-документы Phase 1–2 соответствуют коду. Это редкость, и это главная причина, по которой вердикт B, а не C.
