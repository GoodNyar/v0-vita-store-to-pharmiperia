# Brief для независимого аудита Claude (Phase 3)

> Подготовлено: 2026-07-04 · Не доверять отчётам 02–07 без верификации по коду

## Контекст

- **Репозиторий:** `/Users/yakovlew/Downloads/Projects-pharmiperia-lv/pharmiperia-lv-update`
- **Ветки:** `phase-2/pr-02-commerce-scaffold` → `phase-3/pr-01-foundation` (рекомендуется)
- **Теги:** `v2.0-phase2-complete` (Phase 2), Phase 3 tag не создан
- **Отчёты:** `12-nezavisimyj-audit-post-phase-2.md`, `13-self-audit-phase-3.md`, `phase-3-final-summary.md`

## Обязательный прогон

```bash
cd /Users/yakovlew/Downloads/Projects-pharmiperia-lv/pharmiperia-lv-update
node scripts/audit-exec.mjs
supabase db reset --yes
```

Ожидаемо: lint 0 errors (warnings ~46), typecheck 0, build OK, test:commerce ≥5 файлов PASS.

## Критические гипотезы для проверки

| ID | Гипотеза | Где смотреть |
|----|----------|--------------|
| H-P3-1 | Webhook claim атомарен | `claimStripeEvent`, `route.ts:36` |
| H-P3-2 | Promo не перечислим | `20260704100000_promo_rpc.sql` |
| H-P3-3 | Cache tags инвалидируются | `lib/cache/revalidate.ts`, admin products |
| H-P3-4 | RBAC support не пишет products | `lib/admin/rbac.ts`, migration |
| H-P3-5 | Cart merge на login | `cart-context.tsx` + `mergeGuestCartToServer` |
| H-P3-6 | Brand SEO locale | `app/[locale]/brand/[slug]/layout.tsx` |
| H-P3-7 | types drift | `pnpm db:types` vs committed `database.types.ts` |

## Миграции (хронология)

Phase 2: `20260703120000` … `20260703220000` (6)  
Phase 3: `20260704100000` … `20260704160000` (7)

## ADR index (актуальные)

`docs/adr/0001` … `0025` — особенно 0022–0025 (Phase 3).

## Запрещено при аудите

- git push / merge / deploy
- изменение production ENV

## Ожидаемый формат ответа Claude

Таблица PASS/WARNING/FAIL + вердикт A/B/C/D как в отчёте 12.