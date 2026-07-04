# ADR-0023: Server-side cart storage

- **Статус:** принят
- **Дата:** 2026-07-04

## Контекст

Клиентская корзина (localStorage v3) не поддерживает merge при логине, abandoned cart emails, серверную валидацию цен при чтении.

## Решение

Таблицы `carts` + `cart_items` с RLS owner; `lib/commerce/server-cart.ts` для auth users; guest token — Phase 3 PR-10 follow-up.

## Последствия

- Цены при sync берутся из commerce/DB.
- localStorage остаётся для guest до полного cutover.