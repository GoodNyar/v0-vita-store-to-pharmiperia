# Отчёт 01 — Структура проекта

> Дата: 2026-07-02 · Источник: обзорный анализ репозитория

В проекте **192 файла** (без `node_modules` — они не установлены, и без `.git` — это не git-репозиторий). Это Next.js-приложение (App Router) на TypeScript с Supabase и Stripe — интернет-аптека Pharmiperia. Проект сгенерирован через v0.app.

## Структура папок

**`app/` — 47 файлов** — страницы и роуты Next.js App Router:
- Магазин: `products/[id]`, `category/[slug]`, `brand/[slug]`, `search`, `popular`, `specials`, `checkout` (+ `checkout/success`)
- Личный кабинет: `account/` с подразделами `orders`, `addresses`, `favorites`, `loyalty`, `settings`
- Авторизация: `auth/` — `login`, `sign-up`, `sign-up-success`, `callback`
- API-роуты: `api/chat`, `api/recommendations`
- Контент/инфо-страницы: `about`, `blog/[slug]`, `contact`, `delivery`, `returns`, `payment-methods`, `privacy`, `terms`, `help`, `track`, `reviews` и др.
- `actions/` — server actions (Stripe)
- `sitemap.ts`, `robots.ts`

**`components/` — 83 файла** — React-компоненты:
- 26 компонентов приложения в корне: `site-header`, `site-footer`, `product-card`, `cart-drawer`, `cart-context`, `stripe-checkout`, `live-chat`, `ai-recommendations`, провайдеры (auth, favorites, theme, toast) и т.д.
- `ui/` — 57 файлов, стандартный набор shadcn/ui

**`lib/` — 7 файлов** — утилиты: `data.ts` (хардкод-каталог из 16 товаров), `i18n.tsx` (1787 строк переводов RU/LV), `stripe.ts`, `utils.ts` и `supabase/` (client, server, proxy)

**`public/` — 34 файла** — статика: `brands/`, `flags/`, `icons/`, `images/` (включая логотипы доставки и платёжных систем)

**`scripts/` — 5 файлов** — SQL-миграции для Supabase (схема, таблицы, RLS-триггеры, колонки профиля)

**`hooks/` — 2 файла** (`use-mobile`, `use-toast`), **`styles/` — 1 файл** (дублирующий globals.css)

В корне — конфиги (`package.json`, `tsconfig.json`, `next.config.mjs`, `postcss.config.mjs`, `components.json`), `middleware.ts`, `pnpm-lock.yaml` и пара PNG-скриншотов (`popular.png`, `specials.png`).

## Стек

- Next.js 16 (App Router), React 19, TypeScript (strict, но `ignoreBuildErrors: true`)
- Tailwind CSS 4, shadcn/ui (Radix), lucide-react
- Supabase (`@supabase/ssr`, `@supabase/supabase-js`)
- Stripe (Embedded Checkout: `stripe`, `@stripe/react-stripe-js`)
- Vercel AI SDK (`ai`, `@ai-sdk/react`) — чат и рекомендации
- `@vercel/analytics`
