# ADR-0018: Admin RBAC v0 — `profiles.role` + RLS

- **Статус:** принят
- **Дата:** 2026-07-03
- **Авторы:** Engineering (Phase 2 Wave D, PR-19–21)
- **Ревьюеры:** —

## Контекст

Phase 2 требует операционную панель: просмотр заказов, смена статуса, мониторинг стока. ADR-0004 запрещает прямой Supabase из компонентов — admin routes используют server actions + commerce/admin модули. Полноценный RBAC (роли manager, support, audit log) — Phase 3; сейчас нужен минимальный gate «admin vs customer».

## Решение

1. **Колонка `profiles.role`:** `TEXT NOT NULL DEFAULT 'customer'`, CHECK `IN ('customer', 'admin')`. Назначение admin — вручную в Supabase Dashboard / SQL на staging (нет self-service promote).
2. **Helper `public.is_admin()`:** `SECURITY DEFINER`, проверяет `auth.uid()` → `profiles.role = 'admin'`.
3. **RLS policies (additive):**
   - `orders`: admin SELECT all, admin UPDATE (status, notes)
   - `order_items`: admin SELECT all
   - `profiles`: admin SELECT all (для отображения email в заказах)
4. **Route `/admin/*`:** без locale prefix; `app/admin/layout.tsx` — server auth guard: неавторизованный → login; не-admin → 403.
5. **Phase 2 scope:** read/update orders + read-only products stock. Product CRUD — Phase 3.

## Последствия

- Проще: один флаг роли; RLS защищает даже при утечке anon key в неправильном клиенте (admin mutations только с session admin).
- Сложнее: service role по-прежнему обходит RLS (webhook, draft orders) — ops discipline.
- Откат: drop policies + column; удалить `/admin` routes.
- Playbook §13 (admin access), ADR-0004.

## Рассмотренные альтернативы

- **Supabase custom claims (`app_metadata.role`)** — отклонено на v0: требует hook на auth.users, сложнее отладка; `profiles.role` уже в data model.
- **Middleware-only guard без RLS** — отклонено: defense in depth; RLS обязателен.
- **Отдельная admin Supabase project** — отклонено: overkill для v0 read/update.

## Ссылки

- [phase-2-master-plan.md](../reports/phase-2-master-plan.md) PR-19–21
- ADR-0004, ADR-0005
- [CTO-roadmap.md](../roadmap/CTO-roadmap.md) Admin v0