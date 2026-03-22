"use client"

import Link from "next/link"
import { ChevronLeft, Truck, Package, Clock, ShieldCheck } from "lucide-react"
import { PromoBar } from "@/components/promo-bar"
import { SiteHeader } from "@/components/site-header"
import { CartDrawer } from "@/components/cart-drawer"
import { SiteFooter } from "@/components/site-footer"
import { CartProvider } from "@/components/cart-context"
import { LangProvider, formatEur } from "@/lib/i18n"

const SHIPPING_METHODS = [
  {
    name: "Omniva pakomāts",
    price: 3.50,
    time: "1–2 рабочих дня",
    description: "Более 150 пунктов выдачи по всей Латвии. Получите код и заберите посылку в удобное время.",
    icon: Package,
  },
  {
    name: "DPD Pickup punkts",
    price: 3.20,
    time: "1–2 рабочих дня",
    description: "Широкая сеть пунктов выдачи DPD в Латвии. Быстро и удобно.",
    icon: Package,
  },
  {
    name: "Venipak pakomāts",
    price: 2.95,
    time: "1–2 рабочих дня",
    description: "Автоматические пакоматы Venipak — доступны круглосуточно.",
    icon: Package,
  },
  {
    name: "Smartpost Itella",
    price: 2.99,
    time: "1–3 рабочих дня",
    description: "Надёжная доставка через сеть Smartpost. Уведомление по SMS.",
    icon: Package,
  },
]

function DeliveryContent() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PromoBar />
      <SiteHeader />
      <CartDrawer />

      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-6 sm:py-10">
          {/* Back link */}
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            На главную
          </Link>

          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Условия доставки</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Доставляем заказы по всей Латвии через надёжных партнёров.
          </p>

          {/* Free shipping banner */}
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
            <Truck className="h-5 w-5 flex-shrink-0 text-primary" />
            <p className="text-sm font-medium text-foreground">
              Бесплатная доставка при заказе от{" "}
              <span className="text-primary">40 €</span>
            </p>
          </div>

          {/* Shipping methods */}
          <h2 className="mt-8 text-lg font-semibold text-foreground">Способы доставки</h2>
          <div className="mt-4 space-y-3">
            {SHIPPING_METHODS.map((method) => (
              <div
                key={method.name}
                className="flex items-start gap-4 rounded-xl border border-border bg-card p-4"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <method.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-foreground">{method.name}</span>
                    <span className="flex-shrink-0 text-base font-bold text-primary">
                      {formatEur(method.price)}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {method.time}
                  </div>
                  <p className="mt-1.5 text-sm text-muted-foreground">{method.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Info blocks */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Сроки обработки</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Заказы, оформленные до 14:00 в рабочие дни, отправляются в тот же день. Заказы после
                14:00 — на следующий рабочий день.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="mb-2 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Упаковка и безопасность</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Все товары тщательно упаковываются для защиты от повреждений при транспортировке.
                Хрупкие товары упаковываются в дополнительную защитную упаковку.
              </p>
            </div>
          </div>

          {/* FAQ */}
          <h2 className="mt-8 text-lg font-semibold text-foreground">Частые вопросы</h2>
          <div className="mt-4 space-y-3">
            {[
              {
                q: "Как отследить мой заказ?",
                a: "После отправки вы получите трек-номер на e-mail. Отслеживание доступно на сайте перевозчика.",
              },
              {
                q: "Что делать, если посылка не пришла?",
                a: "Свяжитесь с нами через форму обратной связи или по e-mail. Мы решим вопрос в течение 1–2 рабочих дней.",
              },
              {
                q: "Можно ли изменить адрес доставки после оформления?",
                a: "Изменение адреса возможно до момента отправки заказа. Напишите нам как можно скорее.",
              },
            ].map((item, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-4">
                <p className="text-sm font-semibold text-foreground">{item.q}</p>
                <p className="mt-1.5 text-sm text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="mt-8 rounded-xl bg-primary/5 border border-primary/20 p-5 text-center">
            <p className="text-sm text-muted-foreground">
              Остались вопросы? Напишите нам —{" "}
              <Link href="/contact" className="font-medium text-primary hover:underline">
                Связаться с нами
              </Link>
            </p>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

export default function DeliveryPage() {
  return (
    <LangProvider>
      <CartProvider>
        <DeliveryContent />
      </CartProvider>
    </LangProvider>
  )
}
