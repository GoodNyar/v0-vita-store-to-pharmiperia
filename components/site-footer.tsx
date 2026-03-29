"use client"

import Link from "next/link"
import { Leaf } from "lucide-react"
import { useLang } from "@/lib/i18n"

const footerColumns = [
  {
    title: "Магазин",
    links: [
      { label: "Лицо", href: "/category/face" },
      { label: "Волосы", href: "/category/hair" },
      { label: "Тело", href: "/category/body" },
      { label: "Солнцезащита", href: "/category/suncare" },
      { label: "Макияж", href: "/category/makeup" },
    ],
  },
  {
    title: "Помощь",
    links: [
      { label: "Центр помощи", href: "/help" },
      { label: "Отследить заказ", href: "/track" },
      { label: "Доставка", href: "/delivery" },
      { label: "Способы оплаты", href: "/payment-methods" },
      { label: "Возврат", href: "/returns" },
      { label: "Контакты", href: "/contact" },
    ],
  },
  {
    title: "Компания",
    links: [
      { label: "Про Pharmiperia", href: "/about" },
      { label: "Блог", href: "/blog" },
      { label: "Отзывы покупателей", href: "/reviews" },
      { label: "Партнёрская программа", href: "/partners" },
      { label: "Гарантия качества", href: "/quality" },
    ],
  },
  {
    title: "Аккаунт",
    links: [
      { label: "Войти", href: "/auth/login" },
      { label: "Создать аккаунт", href: "/auth/sign-up" },
      { label: "Мои заказы", href: "/account/orders" },
      { label: "Избранное", href: "/account/favorites" },
      { label: "Бонусы", href: "/account/loyalty" },
    ],
  },
]

const legalLinks = [
  { label: "Политика конфиденциальности", href: "/privacy" },
  { label: "Безопасность данных", href: "/data-security" },
  { label: "Условия покупки", href: "/terms" },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Leaf className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">Pharmiperia</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Pharmiperia — магазин аутентичной французской аптечной косметики для клиентов в Латвии.
            </p>
          </div>

          {/* Link columns */}
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-foreground">{col.title}</h4>
              <ul className="mt-3 flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 md:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; 2026 Pharmiperia. Все права защищены.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
