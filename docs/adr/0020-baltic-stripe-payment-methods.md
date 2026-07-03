# ADR-0020: Baltic Stripe payment methods (checkout + honest copy)

- **Статус:** принят
- **Дата:** 2026-07-03
- **Авторы:** Engineering (Phase 2, PR-24)

## Контекст

Футер и страница `/payment-methods` показывают логотипы латвийских банков (Swedbank, SEB, Citadele, Luminor), тогда как `checkout.sessions.create` передавал только `card` по умолчанию. Прямые internet-bank redirect (как у MakeCommerce/Montonio) **не входят** в нативный набор Stripe для LV business location. Риск: обещание в UI ≠ факт в Embedded Checkout (master plan H7 / bank links mismatch).

## Решение

1. **Явный список методов** в `lib/stripe/payment-methods.ts` для Checkout Session:
   - `card`, `link`, `paypal`, `klarna` — EUR, business location LV;
   - включается, когда `STRIPE_BALTIC_METHODS_ENABLED` ≠ `false` (default: on).
2. **Не** добавляем фиктивные `payment_method_types` для Swedbank/SEB — Stripe их не экспонирует как отдельные типы в LV.
3. **Выравнивание copy:** `paymentBanksCheckoutNote` на странице оплаты и в футере — логотипы банков = карты, выпущенные банками; в чекауте — карты + кошельки + PayPal/Klarna (если включены в Stripe Dashboard).
4. Активация PayPal/Klarna — **обязательный шаг** в Stripe Dashboard (test/live); без активации Stripe скрывает метод без падения сессии.

## Последствия

- Проще: единый контракт checkout ↔ маркетинг; меньше претензий «обещали Swedbank, нет кнопки».
- Сложнее: для настоящих bank-link redirect нужен отдельный PSP (Phase 3) или ADR на смену провайдера.
- Затронут Playbook §1.5 (Stripe), ADR-0005 (webhook — источник факта оплаты).

## Альтернативы

- **Убрать банковские логотипы из UI** — отклонено: снижает доверие LV-покупателей.
- **Montonio / MakeCommerce параллельно Stripe** — отклонено в Phase 2: двойная интеграция и reconciliation.
- **`automatic_payment_methods` без списка** — отклонено: менее предсказуемо для QA и footer copy.

## Ссылки

`docs/reports/phase-2-master-plan.md` (Wave E, PR-24), отчёт 04 §13, `app/actions/stripe.ts`, `app/[locale]/payment-methods/page.tsx`.