# ADR-0021: Image optimization + Core Web Vitals budget

- **Статус:** принят
- **Дата:** 2026-07-03
- **Авторы:** Engineering (Phase 2, PR-28)

## Контекст

`next.config.mjs` содержал `images.unoptimized: true` (master plan H7) — все `next/image` отдавались без ресайза/WebP, LCP на мобильном страдал. Playbook §8 запрещает `unoptimized` в проде. Каталог уже использует `next/image`, но без единого `sizes` на PDP.

## Решение

1. **`images.unoptimized: false`** в `next.config.mjs`; `remotePatterns` для Supabase storage и `images.unsplash.com` (about hero).
2. **`sizes` на товарных изображениях:**
   - PLP card: `(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw` (уже было);
   - PDP hero: `(max-width: 1024px) 100vw, 50vw`, `priority` на главном кадре;
   - cart drawer thumb: `80px`.
3. **CWV budget (baseline, mobile):** LCP ≤ 2.5s на `/lv` и PDP seed-товара после деплоя; документировать в progress tracker до/после PR-28.
4. Откат: `images.unoptimized: true` одной строкой в config.

## Последствия

- Проще: меньший вес страниц, соответствие Playbook §8.
- Сложнее: первый build после включения оптимизации дольше; нужны корректные `remotePatterns` при смене CDN.
- Затронут Playbook §8, milestone M8 (Lighthouse).

## Альтернативы

- **Оставить unoptimized + CDN вручную** — отклонено: дублирование, нет responsive srcset из коробки.
- **`<img>` без next/image** — отклонено: против Playbook.

## Ссылки

`docs/architecture/ENGINEERING_PLAYBOOK.md` §8, `docs/roadmap/phase-2-master-plan.md` PR-28, `next.config.mjs`, `components/product-card.tsx`, `components/product-page-content.tsx`.