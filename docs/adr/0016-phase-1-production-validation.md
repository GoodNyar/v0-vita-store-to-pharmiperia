# ADR-0016: Phase 1 Production Validation — automated gates + GO/NO-GO report

- **Статус:** принят
- **Дата:** 2026-07-03
- **Авторы:** Engineering (Phase 1 task 22)

## Контекст

Phase 1 закрывает 22 инженерные задачи (Git → Playwright). Нужен воспроизводимый финальный прогон перед деплоем и честный вердикт относительно аудита 04 (изначально NO-GO). Часть блокеров — ops (DNS, live Stripe), не код.

## Решение

1. **`pnpm validate:production`** — `scripts/validate-production.mjs`:
   - статические гейты: CI, ADR, ключевые модули Phase 1, отсутствие `ignoreBuildErrors`, нет `pharmiperia.lv` в source, `lib/site.ts` через env;
   - динамика: `tsc --noEmit`, `next build` (отключается `VALIDATE_RUN_BUILD=false`);
   - **warnings** для ops (DNS, Sentry DSN, uptime, e2e на staging) и известного техдолга (`images.unoptimized`, ESLint).
2. **Отчёт** `docs/reports/11-phase-1-production-validation.md` — вердикт **CONDITIONAL GO** для кода при зелёном скрипте; полный **GO** только после ops-чеклиста.
3. Скрипт в CI после build (те же placeholder env, что и build step).

## Последствия

- Повторяемая проверка перед каждым релизом; ops не блокирует CI, но виден в warnings.
- Вердикт аудита 04 обновляется: инженерные блокеры Phase 1 сняты; домен/почта/live-платежи — на владельце продукта.

## Альтернативы

- **Только ручной чеклист** — отклонено: не воспроизводится в CI.
- **Жёсткий fail на ops warnings** — отклонено: CI не имеет DNS/Stripe live.

## Ссылки

Отчёты 04, 05 (Phase 1), Playbook §5–§12, ADR-0005, ADR-0014, ADR-0015.