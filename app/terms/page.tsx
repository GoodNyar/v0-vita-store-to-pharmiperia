"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PromoBar } from "@/components/promo-bar"
import { CartDrawer } from "@/components/cart-drawer"
import { CartProvider } from "@/components/cart-context"
import { LangProvider } from "@/lib/i18n"

const sections = [
  { title: "1. Общие положения", text: "Настоящие Условия покупки регулируют отношения между интернет-магазином Pharmiperia (pharmiperia.lv) и покупателем. Размещая заказ, вы подтверждаете, что ознакомились с условиями и согласны с ними. Pharmiperia оставляет за собой право изменять условия с уведомлением на сайте." },
  { title: "2. Оформление заказа", text: "Заказ считается оформленным после подтверждения оплаты. Мы отправим вам подтверждение на email. Если товар окажется недоступным, мы свяжемся с вами для замены или отмены заказа с полным возвратом средств." },
  { title: "3. Цены и оплата", text: "Все цены указаны в евро (€) и включают НДС. Оплата производится банковской картой через защищённый процессор Stripe. Pharmiperia не хранит данные банковских карт. Принимаем Visa, Mastercard, Maestro и American Express." },
  { title: "4. Доставка", text: "Доставка осуществляется по всей территории Латвии через Omniva, DPD и Latvijas Pasts. Стандартный срок доставки — 1-3 рабочих дня. Бесплатная доставка при заказе от 40€. Подробнее на странице Доставка." },
  { title: "5. Возврат и обмен", text: "Вы можете вернуть товар надлежащего качества в течение 14 дней с момента получения. Товар должен быть в оригинальной упаковке, не вскрытый. Возврат средств осуществляется в течение 7 рабочих дней на карту, которой производилась оплата. Подробнее на странице Возврат." },
  { title: "6. Гарантии", text: "Pharmiperia гарантирует 100% оригинальность всех товаров. Мы работаем только с авторизованными поставщиками. Срок годности товаров на момент доставки — не менее 12 месяцев." },
  { title: "7. Ответственность", text: "Pharmiperia не несёт ответственности за индивидуальные аллергические реакции на косметические продукты. Если у вас чувствительная кожа, рекомендуем консультироваться с дерматологом перед покупкой. При возникновении аллергической реакции немедленно прекратите использование и обратитесь к врачу." },
  { title: "8. Контакты", text: "По всем вопросам, связанным с заказами и условиями покупки, обращайтесь: support@pharmiperia.lv · +371 20 000 000 · Понедельник–Пятница, 9:00–18:00" },
]

export default function TermsPage() {
  return (
    <LangProvider>
      <CartProvider>
        <PromoBar />
        <SiteHeader />
        <CartDrawer />
        <main className="min-h-screen bg-background">
          <div className="mx-auto max-w-3xl px-4 py-10">
            <h1 className="text-3xl font-bold text-foreground">Условия покупки</h1>
            <p className="mt-2 text-sm text-muted-foreground">Последнее обновление: март 2026</p>

            <div className="mt-8 space-y-6">
              {sections.map(({ title, text }) => (
                <div key={title} className="border-b border-border pb-6 last:border-0">
                  <h2 className="text-base font-bold text-foreground">{title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </main>
        <SiteFooter />
      </CartProvider>
    </LangProvider>
  )
}
