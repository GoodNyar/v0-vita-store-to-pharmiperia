"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PromoBar } from "@/components/promo-bar"
import { CartDrawer } from "@/components/cart-drawer"
import { CartProvider } from "@/components/cart-context"
import { LangProvider } from "@/lib/i18n"

const sections = [
  {
    title: "1. Кто мы",
    text: "Pharmiperia (pharmiperia.lv) — интернет-магазин аптечной косметики, зарегистрированный в Латвии. Ответственный за обработку персональных данных: SIA Pharmiperia, Рига, Латвия. Email: support@pharmiperia.lv",
  },
  {
    title: "2. Какие данные мы собираем",
    text: "При регистрации: имя, email, пароль (в зашифрованном виде). При оформлении заказа: адрес доставки, номер телефона. Автоматически: IP-адрес, тип браузера, история просмотров на сайте (через анонимную аналитику Vercel). Данные банковской карты не собираются — они передаются напрямую в Stripe.",
  },
  {
    title: "3. Для чего используем данные",
    text: "Обработка и доставка заказов. Коммуникация по вопросам заказов. Программа лояльности и персональные рекомендации. Улучшение сайта на основе анонимной аналитики. Рассылка (только с вашего согласия, с возможностью отписки).",
  },
  {
    title: "4. Передача третьим лицам",
    text: "Мы передаём минимальные данные партнёрам: Stripe (обработка платежей), Supabase (хранение данных), Vercel (хостинг). Все партнёры соответствуют требованиям GDPR. Мы никогда не продаём ваши данные рекламным сетям.",
  },
  {
    title: "5. Ваши права",
    text: "Согласно GDPR вы имеете право: на доступ к своим данным, на исправление неточных данных, на удаление данных («право на забвение»), на ограничение обработки, на перенос данных, на отзыв согласия. Для реализации прав пишите: support@pharmiperia.lv",
  },
  {
    title: "6. Cookies",
    text: "Мы используем только необходимые технические cookies для работы корзины и авторизации. Мы не используем рекламные или отслеживающие cookies без вашего согласия.",
  },
  {
    title: "7. Срок хранения данных",
    text: "Данные аккаунта — до удаления аккаунта. Данные заказов — 5 лет (требование латвийского налогового законодательства). Данные рассылки — до отписки.",
  },
]

export default function PrivacyPage() {
  return (
    <LangProvider>
      <CartProvider>
        <PromoBar />
        <SiteHeader />
        <CartDrawer />
        <main className="min-h-screen bg-background">
          <div className="mx-auto max-w-3xl px-4 py-10">
            <h1 className="text-3xl font-bold text-foreground">Политика конфиденциальности</h1>
            <p className="mt-2 text-sm text-muted-foreground">Последнее обновление: март 2026</p>

            <div className="mt-8 space-y-6">
              {sections.map(({ title, text }) => (
                <div key={title}>
                  <h2 className="text-base font-bold text-foreground">{title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{text}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-xl bg-secondary/50 border border-border p-5">
              <p className="text-sm text-muted-foreground">Вопросы по конфиденциальности: <a href="mailto:support@pharmiperia.lv" className="text-primary hover:underline">support@pharmiperia.lv</a></p>
            </div>
          </div>
        </main>
        <SiteFooter />
      </CartProvider>
    </LangProvider>
  )
}
