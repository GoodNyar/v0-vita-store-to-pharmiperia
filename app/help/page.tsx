"use client"

import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PromoBar } from "@/components/promo-bar"
import { CartDrawer } from "@/components/cart-drawer"
import { CartProvider } from "@/components/cart-context"
import { LangProvider } from "@/lib/i18n"
import { Package, RotateCcw, CreditCard, User, MessageCircle, ChevronRight } from "lucide-react"
import { useState } from "react"

const faqs = [
  { q: "Как отследить мой заказ?", a: "После отправки заказа вы получите email с трек-номером. Также вы можете проверить статус в разделе «Мои заказы» в личном кабинете.", category: "Заказы" },
  { q: "Сколько времени занимает доставка?", a: "Стандартная доставка по Латвии: 1-3 рабочих дня. В Ригу — обычно 1 день. Мы отправляем заказы в день оформления при оплате до 14:00.", category: "Доставка" },
  { q: "Как вернуть товар?", a: "Возврат возможен в течение 14 дней с момента получения. Товар должен быть в оригинальной упаковке и не вскрытым. Напишите нам на support@pharmiperia.lv.", category: "Возврат" },
  { q: "Мой промокод не работает. Что делать?", a: "Проверьте, соответствует ли сумма заказа минимальной. Промокод WELCOME10 требует минимальную покупку 30€ и действует только для новых покупателей.", category: "Оплата" },
  { q: "Как накапливаются бонусные баллы?", a: "1€ покупки = 10 бонусных баллов. При регистрации вы получаете 100 приветственных баллов. Баллы можно будет обменивать на скидки — функция в разработке.", category: "Бонусы" },
  { q: "Можно ли изменить или отменить заказ?", a: "Отменить или изменить заказ можно до момента отправки. Напишите нам как можно скорее на support@pharmiperia.lv.", category: "Заказы" },
  { q: "Товары оригинальные?", a: "Да, 100%. Мы работаем только с официальными дистрибьюторами. У нас нет серого рынка или реплик.", category: "Качество" },
  { q: "Как связаться с поддержкой?", a: "Email: support@pharmiperia.lv · Телефон: +371 20 000 000 · Чат на сайте (зелёная кнопка справа внизу) · Время работы: Пн-Пт 9:00–18:00", category: "Контакты" },
]

const quickLinks = [
  { icon: Package, label: "Мои заказы", href: "/account/orders" },
  { icon: RotateCcw, label: "Возврат", href: "/returns" },
  { icon: CreditCard, label: "Оплата", href: "/payment-methods" },
  { icon: User, label: "Мой аккаунт", href: "/account" },
  { icon: MessageCircle, label: "Контакты", href: "/contact" },
]

export default function HelpPage() {
  const [open, setOpen] = useState<number | null>(null)
  const [search, setSearch] = useState("")

  const filtered = faqs.filter(f =>
    f.q.toLowerCase().includes(search.toLowerCase()) ||
    f.a.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <LangProvider>
      <CartProvider>
        <PromoBar />
        <SiteHeader />
        <CartDrawer />
        <main className="min-h-screen bg-background">
          <div className="bg-primary/5 border-b border-border py-12">
            <div className="mx-auto max-w-2xl px-4 text-center">
              <h1 className="text-3xl font-bold text-foreground">Как мы можем помочь?</h1>
              <div className="mt-5 relative">
                <input
                  type="text"
                  placeholder="Поиск по FAQ..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="h-12 w-full rounded-full border border-border bg-background pl-5 pr-5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-3xl px-4 py-10">
            {/* Quick links */}
            <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-5">
              {quickLinks.map(({ icon: Icon, label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center transition-all hover:border-primary hover:shadow-sm"
                >
                  <Icon className="h-6 w-6 text-primary" />
                  <span className="text-xs font-medium text-foreground">{label}</span>
                </Link>
              ))}
            </div>

            {/* FAQ */}
            <h2 className="mb-4 text-xl font-bold text-foreground">Частые вопросы</h2>
            <div className="space-y-2">
              {filtered.map((faq, i) => (
                <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
                  <button
                    onClick={() => setOpen(open === i ? null : i)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold text-foreground hover:bg-secondary/50 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronRight className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open === i ? "rotate-90" : ""}`} />
                  </button>
                  {open === i && (
                    <div className="border-t border-border px-5 py-4">
                      <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
              {filtered.length === 0 && (
                <p className="py-10 text-center text-sm text-muted-foreground">Ничего не найдено. Попробуйте другой запрос или <Link href="/contact" className="text-primary hover:underline">напишите нам</Link>.</p>
              )}
            </div>
          </div>
        </main>
        <SiteFooter />
      </CartProvider>
    </LangProvider>
  )
}
