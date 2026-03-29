"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PromoBar } from "@/components/promo-bar"
import { CartDrawer } from "@/components/cart-drawer"
import { CartProvider } from "@/components/cart-context"
import { LangProvider } from "@/lib/i18n"
import { Shield, Award, Truck, CheckCircle } from "lucide-react"

export default function QualityPage() {
  return (
    <LangProvider>
      <CartProvider>
        <PromoBar />
        <SiteHeader />
        <CartDrawer />
        <main className="min-h-screen bg-background">
          <div className="mx-auto max-w-3xl px-4 py-10">
            <h1 className="text-3xl font-bold text-foreground">Гарантия качества</h1>
            <p className="mt-2 text-muted-foreground">Мы несём ответственность за каждый товар, который продаём</p>

            <div className="mt-8 space-y-6">
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-bold text-foreground">100% оригинальная продукция</h2>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">Pharmiperia работает только с официальными поставщиками и авторизованными дистрибьюторами брендов La Roche-Posay, Vichy, Bioderma, Avène, CeraVe, Eucerin, Nuxe и SVR. Мы никогда не работаем с серым рынком.</p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Truck className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-bold text-foreground">Правильное хранение и доставка</h2>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">Косметика хранится в контролируемых условиях температуры и влажности. При доставке мы используем защитную упаковку, чтобы товар дошёл в идеальном состоянии.</p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-bold text-foreground">Что гарантируем</h2>
                </div>
                <div className="space-y-3">
                  {[
                    "Товар соответствует описанию на сайте",
                    "Срок годности минимум 12 месяцев с момента получения",
                    "Упаковка не вскрыта и не повреждена",
                    "Замена или возврат денег при любом несоответствии",
                    "Поддержка в случае аллергической реакции",
                  ].map(item => (
                    <div key={item} className="flex items-start gap-2 text-sm text-foreground">
                      <CheckCircle className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-primary/5 border border-primary/20 p-6">
                <h2 className="font-bold text-foreground mb-2">Нашли проблему с товаром?</h2>
                <p className="text-sm text-muted-foreground mb-4">Напишите нам в течение 14 дней с момента получения — мы решим вопрос без лишних вопросов.</p>
                <a
                  href="/contact"
                  className="inline-flex h-10 items-center rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Связаться с нами
                </a>
              </div>
            </div>
          </div>
        </main>
        <SiteFooter />
      </CartProvider>
    </LangProvider>
  )
}
