"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PromoBar } from "@/components/promo-bar"
import { CartDrawer } from "@/components/cart-drawer"
import { CartProvider } from "@/components/cart-context"
import { LangProvider } from "@/lib/i18n"
import { Shield, Lock, CheckCircle } from "lucide-react"

/* ── Inline brand badges matching real brand colours ── */
function VisaLogo() {
  return (
    <div className="flex h-12 w-20 items-center justify-center rounded-lg border border-border bg-white px-2">
      <span className="text-xl font-extrabold italic tracking-tight text-[#1A1F71]">VISA</span>
    </div>
  )
}
function MastercardLogo() {
  return (
    <div className="flex h-12 w-20 items-center justify-center rounded-lg border border-border bg-white px-2 gap-0.5">
      <div className="h-7 w-7 rounded-full bg-[#EB001B] opacity-90" />
      <div className="h-7 w-7 -ml-3 rounded-full bg-[#F79E1B] opacity-90" />
    </div>
  )
}
function ApplePayLogo() {
  return (
    <div className="flex h-12 w-24 items-center justify-center rounded-lg border border-border bg-black px-3">
      <span className="text-white text-sm font-semibold tracking-tight"> Pay</span>
    </div>
  )
}
function GooglePayLogo() {
  return (
    <div className="flex h-12 w-24 items-center justify-center rounded-lg border border-border bg-white px-3">
      <span className="text-sm font-semibold">
        <span className="text-[#4285F4]">G</span>
        <span className="text-[#EA4335]">o</span>
        <span className="text-[#FBBC05]">o</span>
        <span className="text-[#4285F4]">g</span>
        <span className="text-[#34A853]">l</span>
        <span className="text-[#EA4335]">e </span>
        <span className="text-[#5F6368]">Pay</span>
      </span>
    </div>
  )
}
function RevolutLogo() {
  return (
    <div className="flex h-12 w-24 items-center justify-center rounded-lg border border-border bg-white px-3">
      <span className="text-sm font-bold tracking-tight text-[#191C1F]">Revolut</span>
    </div>
  )
}
function SwedbankLogo() {
  return (
    <div className="flex h-12 w-28 items-center justify-center rounded-lg border border-border bg-white px-3 gap-1.5">
      <span className="text-sm font-bold text-[#EF7B10]">Swedbank</span>
      <div className="h-5 w-5 rounded-full bg-[#EF7B10] flex items-center justify-center">
        <div className="h-3 w-3 rounded-full border-2 border-white" />
      </div>
    </div>
  )
}
function SEBLogo() {
  return (
    <div className="flex h-12 w-20 items-center justify-center rounded-lg border border-border bg-[#60A830] px-3">
      <span className="text-sm font-extrabold tracking-widest text-white">SEB</span>
    </div>
  )
}
function CitadeleLogo() {
  return (
    <div className="flex h-12 w-24 items-center justify-center rounded-lg border border-border bg-[#D0001E] px-3">
      <span className="text-sm font-bold text-white tracking-wide">Citadele</span>
    </div>
  )
}
function LuminorLogo() {
  return (
    <div className="flex h-12 w-24 items-center justify-center rounded-lg border border-border bg-[#5B2D8E] px-3">
      <span className="text-sm font-bold text-white tracking-wide">Luminor</span>
    </div>
  )
}

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
            <p className="mt-2 text-muted-foreground">
              Все платежи защищены и обрабатываются безопасно через Stripe
            </p>

            <div className="mt-8 space-y-4">

              {/* Payment icons */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-lg font-bold text-foreground mb-2">Банковские карты</h2>
                <p className="text-sm text-muted-foreground mb-5">
                  Принимаем Visa и Mastercard — оплата мгновенная и безопасная.
                </p>
                <div className="flex flex-wrap gap-3">
                  <VisaLogo />
                  <MastercardLogo />
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-lg font-bold text-foreground mb-2">Цифровые кошельки</h2>
                <p className="text-sm text-muted-foreground mb-5">
                  Платите одним касанием через Apple Pay, Google Pay или Revolut.
                </p>
                <div className="flex flex-wrap gap-3">
                  <ApplePayLogo />
                  <GooglePayLogo />
                  <RevolutLogo />
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-lg font-bold text-foreground mb-2">Банки Латвии</h2>
                <p className="text-sm text-muted-foreground mb-5">
                  Оплата через интернет-банки крупнейших банков страны.
                </p>
                <div className="flex flex-wrap gap-3">
                  <SwedbankLogo />
                  <SEBLogo />
                  <CitadeleLogo />
                  <LuminorLogo />
                </div>
              </div>

              {/* Security */}
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
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2 text-sm text-foreground">
                      <CheckCircle className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Promo */}
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Lock className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-bold text-foreground">Промокоды и бонусы</h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  Вы можете применить промокод на странице оформления заказа.
                </p>
                <div className="mt-4 rounded-lg bg-primary/5 border border-primary/20 p-4">
                  <p className="text-sm font-medium text-primary">Промокод для новых покупателей</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Используйте{" "}
                    <span className="font-mono font-bold text-foreground">WELCOME10</span> при первом
                    заказе — скидка 10% при покупке от 30€.
                  </p>
                </div>
              </div>

              {/* FAQ */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-lg font-bold text-foreground mb-3">Часто задаваемые вопросы</h2>
                <div className="space-y-4">
                  {[
                    {
                      q: "Когда деньги спишутся с карты?",
                      a: "Сразу при оформлении заказа. Мы не используем систему предавторизации.",
                    },
                    {
                      q: "Безопасно ли вводить данные карты?",
                      a: "Да. Вы вводите данные напрямую на странице Stripe, мы никогда не видим номер вашей карты.",
                    },
                    {
                      q: "Можно ли оплатить частями?",
                      a: "В данный момент рассрочка недоступна. Следите за обновлениями.",
                    },
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
