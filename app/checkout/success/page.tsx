"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CheckCircle, Package, Truck, ArrowRight } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CartDrawer } from "@/components/cart-drawer"
import { CartProvider, useCart } from "@/components/cart-context"
import { LangProvider, useLang } from "@/lib/i18n"

function SuccessContent() {
  const { t, lang } = useLang()
  const { clearCart } = useCart()
  const [orderNumber, setOrderNumber] = useState<string>("")

  useEffect(() => {
    // Generate order number
    const num = `PH${Date.now().toString().slice(-8)}`
    setOrderNumber(num)
    
    // Clear cart after successful payment
    clearCart()
  }, [clearCart])

  const steps = [
    {
      icon: CheckCircle,
      title: lang === "lv" ? "Pasūtījums apstiprināts" : "Заказ подтвержден",
      description: lang === "lv" ? "Jūsu maksājums ir veiksmīgi apstrādāts" : "Ваш платеж успешно обработан",
      active: true,
    },
    {
      icon: Package,
      title: lang === "lv" ? "Sagatavošana" : "Подготовка",
      description: lang === "lv" ? "Mēs gatavojam jūsu pasūtījumu" : "Мы готовим ваш заказ",
      active: false,
    },
    {
      icon: Truck,
      title: lang === "lv" ? "Piegāde" : "Доставка",
      description: lang === "lv" ? "Pasūtījums tiks nosūtīts 1-2 darba dienu laikā" : "Заказ будет отправлен в течение 1-2 рабочих дней",
      active: false,
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-background">
        <SiteHeader />
      <CartDrawer />

      <main className="flex-1 py-12">
        <div className="mx-auto max-w-2xl px-4">
          {/* Success Icon */}
          <div className="mb-8 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle className="h-10 w-10 text-primary" />
            </div>
          </div>

          {/* Title */}
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-2xl font-bold text-foreground">
              {lang === "lv" ? "Paldies par pasūtījumu!" : "Спасибо за заказ!"}
            </h1>
            <p className="text-muted-foreground">
              {lang === "lv" 
                ? "Mēs nosūtīsim apstiprinājumu uz jūsu e-pastu" 
                : "Мы отправим подтверждение на вашу почту"}
            </p>
          </div>

          {/* Order Number */}
          <div className="mb-8 rounded-xl border border-border bg-card p-6 text-center">
            <p className="mb-1 text-sm text-muted-foreground">
              {lang === "lv" ? "Pasūtījuma numurs" : "Номер заказа"}
            </p>
            <p className="text-xl font-bold text-foreground">{orderNumber}</p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8 rounded-xl border border-border bg-card p-6">
            <h2 className="mb-4 text-sm font-semibold text-foreground">
              {lang === "lv" ? "Pasūtījuma statuss" : "Статус заказа"}
            </h2>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    step.active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                    <step.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${step.active ? "text-foreground" : "text-muted-foreground"}`}>
                      {step.title}
                    </p>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                  {step.active && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {lang === "lv" ? "Aktīvs" : "Активно"}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/account/orders"
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-background px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              {lang === "lv" ? "Skatīt pasūtījumus" : "Мои заказы"}
            </Link>
            <Link
              href="/"
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {lang === "lv" ? "Turpināt iepirkties" : "Продолжить покупки"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Help */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              {lang === "lv" ? "Jautājumi? " : "Вопросы? "}
              <Link href="/contact" className="text-primary hover:underline">
                {lang === "lv" ? "Sazinieties ar mums" : "Свяжитесь с нами"}
              </Link>
            </p>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <LangProvider>
      <CartProvider>
        <SuccessContent />
      </CartProvider>
    </LangProvider>
  )
}
