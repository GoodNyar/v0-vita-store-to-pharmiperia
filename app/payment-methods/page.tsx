"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PromoBar } from "@/components/promo-bar"
import { CartDrawer } from "@/components/cart-drawer"
import { CartProvider } from "@/components/cart-context"
import { LangProvider } from "@/lib/i18n"
import { CreditCard, Shield, Lock, CheckCircle } from "lucide-react"

export default function PaymentMethodsPage() {
  return (
    <LangProvider>
      <CartProvider>
        <PromoBar />
        <SiteHeader />
        <CartDrawer />
        <main className="min-h-screen bg-background">
          <div className="mx-auto max-w-3xl px-4 py-10">
            <h1 className="text-3xl font-bold text-foreground">Способы оплаты</h1>
            <p className="mt-2 text-muted-foreground">Все платежи защищены и обрабатываются безопасно через Stripe</p>

            {/* Cards */}
            <div className="mt-8 space-y-4">
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-bold text-foreground">Банковские карты</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-4">Принимаем все основные карты — оплата мгновенная и безопасная.</p>
                <div className="flex flex-wrap gap-3">
                  {["Visa", "Mastercard", "Maestro", "American Express"].map(card => (
                    <div key={card} className="rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-foreground">
                      {card}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-bold text-foreground">Безопасность платежей</h2>
                </div>
                <div className="space-y-3">
                  {[
                    "Все транзакции защищены протоколом SSL/TLS",
                    "Данные карты никогда не хранятся на наших серверах",
                    "Обработка платежей через сертифицированный процессор Stripe (PCI DSS Level 1)",
                    "3D Secure аутентификация для дополнительной защиты",
                  ].map(item => (
                    <div key={item} className="flex items-start gap-2 text-sm text-foreground">
                      <CheckCircle className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Lock className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-bold text-foreground">Промокоды и бонусы</h2>
                </div>
                <p className="text-sm text-muted-foreground">Вы можете применить промокод на странице оформления заказа. Бонусные баллы программы лояльности пока не конвертируются в скидку автоматически — мы работаем над этой функцией.</p>
                <div className="mt-4 rounded-lg bg-primary/5 border border-primary/20 p-4">
                  <p className="text-sm font-medium text-primary">Промокод для новых покупателей</p>
                  <p className="mt-1 text-sm text-muted-foreground">Используйте <span className="font-mono font-bold text-foreground">WELCOME10</span> при первом заказе — скидка 10% при покупке от 30€.</p>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-lg font-bold text-foreground mb-3">Часто задаваемые вопросы</h2>
                <div className="space-y-4">
                  {[
                    { q: "Когда деньги спишутся с карты?", a: "Сразу при оформлении заказа. Мы не используем систему предавторизации." },
                    { q: "Безопасно ли вводить данные карты?", a: "Да. Вы вводите данные напрямую на странице Stripe, мы никогда не видим номер вашей карты." },
                    { q: "Можно ли оплатить частями?", a: "В данный момент рассрочка недоступна. Следите за обновлениями." },
                  ].map(({ q, a }) => (
                    <div key={q}>
                      <p className="text-sm font-semibold text-foreground">{q}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
        <SiteFooter />
      </CartProvider>
    </LangProvider>
  )
}
