# Отчёт 24 — Zero-Trust аудит BUGFIX-01

> Дата: 2026-07-06 · Роль: независимый инженерный аудит · Метод: нулевое доверие к `docs/releases/bugfix-01-report.md` — каждое утверждение проверено по коду. Прогнано лично на рабочем дереве: `tsc --noEmit`, `eslint .`, `node --test` (полный набор), `next build`. Не удалось: `supabase db:reset` (CLI не установлен) — БД-инварианты статически.

---

## Итог одной строкой

Из 7 багов **4 закрыты полностью** (BUG-002, 004, 006, 007), **3 закрыты частично** (BUG-001, 003, 005) — в каждом частичном есть проверяемый остаточный дефект, который отчёт помечает «✅ Закрыт». Пайплайн зелёный, регрессий в компиляции/тестах/сборке нет.

**Пайплайн (проверено лично):** `tsc` 0 ошибок · `eslint` 0 errors (45 warnings) · тесты **47/47 pass** · `next build` exit 0 (новые маршруты `/[locale]/auth/reset-password`, `/update-password` предрендерятся для lv+ru).

---

## Проверка по багам

### BUG-001 — locale в category · **ЧАСТИЧНО**
- **Category закрыт ✓:** `app/[locale]/category/[slug]/page.tsx` больше не оборачивает контент в nested `LangProvider`; локаль задаёт `app/[locale]/layout.tsx` (`LangProvider initialLang={locale}`). `/lv/category/*` и `/ru/category/*` наследуют корректную локаль.
- **Остаточный дефект (Medium):** тот же корень не устранён на ~14 других маршрутах. `LangProvider` (`lib/i18n.tsx:44`) при вызове **без** `initialLang` дефолтит к `"lv"` и в `useEffect` пишет `preferredLang` в localStorage. Страницы `contact`, `track`, `quality`, `blog`, `blog/[slug]`, `terms`, `help`, `reviews`, `data-security`, `payment-methods`, `partners`, `account/loyalty`, `account/orders` рендерят **бесаргументный** `<LangProvider>` внутри locale-layout (подтверждено: `grep "LangProvider"` → все без `initialLang`). Следствие на `/ru/contact` и подобных: внутренний провайдер перекрывает контекст на `lv` → страница на латышском, **и** localStorage `preferredLang` перезаписывается в `lv` глобально на сессию. Для русскоязычного сегмента (ключевого по бизнес-плану) переход на «Контакты» флипает весь сайт в LV.
- **Вывод:** заявлено «Удалён nested LangProvider» — верно только для category. Класс бага BUG-001 остаётся на ~14 маршрутах.

### BUG-002 — Reset Password flow · **ЗАКРЫТ ✓**
- Страницы `app/[locale]/auth/reset-password/page.tsx` и `/update-password/page.tsx` существуют, предрендерятся для обеих локалей (подтверждено в build-выводе).
- Ссылка «забыли пароль» в login: `localizedPath("/auth/reset-password")` (`login/page.tsx:201`) — локаль-aware.
- `requestPasswordResetWithCaptcha` (`app/actions/auth.ts:117`): zod-валидация email + Turnstile + `resetPasswordForEmail` с `redirectTo = ${siteUrl}/auth/callback?next=/${locale}/auth/update-password` — **локаль сохраняется** в redirect.
- `updatePasswordWithCaptcha`: min-length 6 + captcha + требует авторизованного пользователя (recovery-сессия) + `updateUser({ password })`.
- Flow целостен (стандартный PKCE-recovery через `/auth/callback` → `next`). Замечаний нет.

### BUG-003 — merge корзины · **ЧАСТИЧНО**
- **Одиночный merge корректен ✓:** `syncLocalCartToServer` (`lib/commerce/server-cart.ts:109`) — `mergedQuantity = existing + item.quantity`, кламп `Math.max(1, Math.min(99, merged))`, `upsert onConflict: 'cart_id,product_id'`. Quantity суммируется ✓, позиции не теряются ✓, дублей строк нет (upsert) ✓, cap=99 ✓.
- **Остаточный дефект (Medium): не атомарно + нет guard от повторного merge.**
  1. Merge — read-modify-write: `SELECT quantity` → сумма в JS → `upsert` с **перезаписью** значения (не SQL-инкремент). Два конкурентных merge для одного user+product (две вкладки; supabase-js броадкастит auth-событие между вкладками) прочитают одно и то же `existing` → потеря обновления или двойное сложение по таймингу.
  2. Вызывающий код (`components/cart-context.tsx:193-205`) на `SIGNED_IN` мержит `loadCartFromStorage()`, затем `hydrateFromServer` делает `saveCartToStorage(server items)` (строка 156) — то есть перезаписывает localStorage серверной корзиной (уже с учтёнными qty). Флага-guard от повторного merge нет и гостевая корзина не очищается в ноль. Повторный `SIGNED_IN` (мультивкладка) прочитает уже синхронизированную корзину как «гостевую» и смержит **снова** → инфляция количества (ограничена cap 99).
- **Вывод:** требования «нет дублей»/«cap работает» выполнены; «нет race condition» — **нет**. Остаётся окно инфляции qty при конкурентном/повторном входе. Смягчено потолком 99.

### BUG-004 — draft order retry · **ЗАКРЫТ ✓**
- `prepareDraftOrder(items, { existingOrderId })` (`lib/orders.ts:375`) → при наличии id вызывает `tryReusePendingDraftOrder`, который проверяет `status==='pending' && payment_status==='pending'` (`orders.ts:251`), переиспользует заказ, **заменяет** order_items (delete по `order_id` → re-insert), иначе создаёт новый.
- Клиент прокидывает id: `stripe-checkout.tsx` принимает `existingOrderId` и передаёт в `createCheckoutSession`; `onCheckoutPrepared` возвращает `{orderId}` → `checkout-content.tsx` хранит в `preparedOrder` и подаёт назад `existingOrderId={preparedOrder?.orderId}` (строка 489).
- Retry в рамках сессии переиспользует существующий pending draft — orphan-заказы не плодятся. Остаточно: полная перезагрузка страницы теряет `preparedOrder` → новый draft (присуще подходу, приемлемо). Замечаний по scope нет.

### BUG-005 — fallback изображений · **ЧАСТИЧНО**
- **Каталожные листинги закрыты ✓:** `components/catalog-image.tsx` — null/empty src → `/placeholder.svg`, `onError` → placeholder (с guard от петли). `public/placeholder.svg` существует. Используется в `product-card`, `category-page-content`, `product-page-content`, `search-page-content`.
- **Остаточный дефект (Medium, видим сегодня):** `components/cart-drawer.tsx:72`, `app/[locale]/checkout/checkout-content.tsx:504`, `app/[locale]/account/favorites/page.tsx:104` по-прежнему используют сырой `next/image` `<Image>` **без** fallback. При этом каталог изображений товаров отсутствует физически (`public/images/products/` нет — подтверждено `ls`), т.е. все картинки товаров сейчас битые. На листингах их прячет CatalogImage (placeholder), а в корзине/чекауте/избранном (денежный путь) — иконка битого изображения.
- **Вывод:** «placeholder используется везде» — **не так**; три поверхности, включая корзину и order summary чекаута, без fallback.

### BUG-006 — category routing · **ЗАКРЫТ ✓**
- `app/[locale]/category/[slug]/page.tsx`: `if (!isLocale(locale)) notFound()` + `if (!isValidCategorySlug(slug)) notFound()` (slug ∈ taxonomy или `brands`). Невалидный slug → жёсткий 404, не soft-404. `export const revalidate = 3600` сохранён → ISR/SEO не нарушены (в build: `● /[locale]/category/[slug] 1h`). Замечаний нет.

### BUG-007 — payment methods · **ЗАКРЫТ ✓**
- `getCheckoutPaymentMethodTypes()` (`lib/stripe/payment-methods.ts`) возвращает `['card']` по умолчанию; Baltic-набор (card/link/paypal/klarna) — только при `STRIPE_BALTIC_METHODS_ENABLED === 'true'`. Card работает, Baltic выключены по умолчанию, конфиг безопасен, есть unit-тест (`payment-methods.test.ts`). Замечаний нет.

---

## Пайплайн и регрессии

| Проверка | Результат |
|---|---|
| `tsc --noEmit` | 0 ошибок |
| `eslint .` | 0 errors, 45 warnings |
| `node --test` (полный) | 47/47 pass |
| `next build` | exit 0; новые auth-маршруты и category ISR предрендерятся |
| Регрессии | не обнаружено в компиляции/тестах/сборке |
| `supabase db:reset` | **не проверено** — CLI недоступен в среде |

Процессное замечание (как в отчёте 23): изменения BUGFIX-01 — **незакоммичены** (21 файл в рабочем дереве, тег `v1.0.0-rc.1` их не содержит). Аудировано фактическое дерево; для фиксации как part of RC требуется commit + ревью + перетег.

---

## Вердикт

**4/7 закрыты полностью и подтверждены по коду (BUG-002, 004, 006, 007). 3/7 закрыты частично (BUG-001, 003, 005)** — каждый с реальным остаточным дефектом уровня **Medium**, который отчёт разработчика помечает как полностью закрытый:

- **BUG-001:** locale-reset остаётся на ~14 маршрутах вне category (nested `LangProvider` без `initialLang` → форс `lv` + перезапись localStorage).
- **BUG-003:** merge не атомарен и без guard → инфляция qty при конкурентном/повторном входе (ограничена cap 99).
- **BUG-005:** три поверхности денежного пути (корзина, чекаут, избранное) без image-fallback; видимо сегодня из-за отсутствующих файлов картинок.

Ни один остаточный дефект не является Critical/High-блокером: все Medium, дормантны или ограничены. Регрессий пайплайна нет. Рекомендация: не считать BUG-001/003/005 полностью закрытыми — довести (initialLang на всех nested-провайдерах или их удаление; SQL-инкремент/RPC для merge + guard/очистка гостевой корзины; CatalogImage в корзине/чекауте/избранном), затем закоммитить и перетегировать. BUG-002/004/006/007 — принять как закрытые.
