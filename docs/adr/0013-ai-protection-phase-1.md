# ADR-0013: AI Protection Phase 1 — feature flags, guards, budget cap

- **Статус:** принят
- **Дата:** 2026-07-03
- **Авторы:** Engineering (Phase 1 task 19)

## Контекст

Roadmap Phase 1 §10: AI-рекомендации выключить до Phase 3; чат — только за лимитом и с защитой бюджета. Аудит 04: открытые AI-endpoints без ключа/лимитов — риск выжигания OpenAI-бюджета.

## Решение

1. **Feature flags (opt-in):**
   - `NEXT_PUBLIC_AI_RECOMMENDATIONS_ENABLED` — по умолчанию `false` (скрыт UI + 503 API).
   - `NEXT_PUBLIC_AI_CHAT_ENABLED` — по умолчанию `false`.
   - Сервер дополнительно требует `OPENAI_API_KEY`.
2. **Guards** (`lib/ai/guard.ts`): проверка флага + ключа до rate limit и вызова модели.
3. **Budget cap:** `AI_DAILY_REQUEST_CAP` (default 100) — общий дневной счётчик chat + recommendations; Upstash Redis или in-memory fallback (как ADR-0011).
4. **Валидация:** zod/лимиты длины для recommendations body; chat — max messages + max input chars.
5. **UI:** виджеты не рендерятся без public-флага (не фиктивные кнопки).

## Последствия

- Проще: Phase 1 запуск без OpenAI-расходов; включение AI — явный ops-шаг.
- Сложнее: для prod-AI нужны env + Upstash для надёжного budget cap.
- Затронут Playbook §10, ADR-0011, roadmap Phase 3 (AI v2).

## Альтернативы

- **Удалить AI-компоненты** — отклонено: код остаётся за флагами для Phase 3.
- **Только rate limit без budget** — отклонено: не ограничивает суммарный дневной burn.

## Ссылки

Отчёты 04 (§6, §23), 05 (Phase 1 §10), ADR-0011, ADR-0009 (OpenAI).