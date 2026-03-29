"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PromoBar } from "@/components/promo-bar"
import { CartDrawer } from "@/components/cart-drawer"
import { CartProvider } from "@/components/cart-context"
import { LangProvider } from "@/lib/i18n"
import { Lock, Database, Eye, Shield } from "lucide-react"

export default function DataSecurityPage() {
  return (
    <LangProvider>
      <CartProvider>
        <PromoBar />
        <SiteHeader />
        <CartDrawer />
        <main className="min-h-screen bg-background">
          <div className="mx-auto max-w-3xl px-4 py-10">
            <h1 className="text-3xl font-bold text-foreground">Безопасность данных</h1>
            <p className="mt-2 text-muted-foreground">Как мы защищаем вашу личную информацию</p>

            <div className="mt-8 space-y-6">
              {[
                {
                  icon: Lock,
                  title: "Шифрование данных",
                  text: "Все данные передаются по защищённому соединению HTTPS с сертификатом SSL/TLS. Ваши пароли хранятся в зашифрованном виде — мы никогда не можем их прочитать.",
                },
                {
                  icon: Database,
                  title: "Хранение данных",
                  text: "Ваши данные хранятся на серверах Supabase в дата-центрах ЕС, которые соответствуют требованиям GDPR. Мы не продаём и не передаём ваши данные третьим лицам без вашего согласия.",
                },
                {
                  icon: Eye,
                  title: "Что мы собираем",
                  text: "Только необходимое: имя, email, адрес доставки и история заказов. Мы не собираем биометрические данные, геолокацию или данные о поведении на других сайтах.",
                },
                {
                  icon: Shield,
                  title: "Ваши права (GDPR)",
                  text: "Вы можете в любой момент запросить удаление аккаунта и всех данных, получить копию своих данных, исправить неточные данные или отозвать согласие на обработку. Пишите: support@pharmiperia.lv",
                },
              ].map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-xl border border-border bg-card p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-lg font-bold text-foreground">{title}</h2>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
                </div>
              ))}

              <p className="text-xs text-muted-foreground text-center">Последнее обновление: март 2026 · По вопросам: support@pharmiperia.lv</p>
            </div>
          </div>
        </main>
        <SiteFooter />
      </CartProvider>
    </LangProvider>
  )
}
