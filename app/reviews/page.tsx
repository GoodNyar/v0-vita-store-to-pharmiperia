"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PromoBar } from "@/components/promo-bar"
import { CartDrawer } from "@/components/cart-drawer"
import { CartProvider } from "@/components/cart-context"
import { LangProvider } from "@/lib/i18n"
import { Star } from "lucide-react"

const reviews = [
  { name: "Анна К.", rating: 5, date: "20 марта 2026", text: "Заказываю уже третий раз. Sensibio H2O — просто спасение для моей чувствительной кожи. Доставка в Латвию быстрая, упаковка надёжная.", product: "Sensibio H2O" },
  { name: "Мария Д.", rating: 5, date: "15 марта 2026", text: "Наконец нашла магазин с оригинальной La Roche-Posay в Латвии! Anthelios SPF50+ — лучший санскрин, что я пробовала. Рекомендую всем.", product: "Anthelios SPF50+" },
  { name: "Елена В.", rating: 5, date: "10 марта 2026", text: "Mineral 89 от Vichy превратил мою кожу. Начала использовать зимой — уже через неделю кожа стала более увлажнённой и гладкой. Буду заказывать ещё.", product: "Mineral 89" },
  { name: "Юлия Р.", rating: 4, date: "5 марта 2026", text: "Хороший сайт, большой выбор. Единственное пожелание — ещё больше брендов. Cicaplast Baume — теперь мой постоянный продукт.", product: "Cicaplast Baume B5+" },
  { name: "Катарина Л.", rating: 5, date: "28 февраля 2026", text: "Pharmiperia — лучший выбор для тех, кто ищет аптечную косметику в Латвии. Быстро, оригинально, есть накопительные бонусы. Очень довольна!", product: "Huile Prodigieuse" },
  { name: "Ирина С.", rating: 5, date: "20 февраля 2026", text: "Отличный магазин! Заказала Hyalu B5 сыворотку — результат виден уже через 2 недели. Кожа выглядит как после салонной процедуры.", product: "Hyalu B5 Serum" },
  { name: "Диана М.", rating: 4, date: "14 февраля 2026", text: "Всё хорошо, но хочется больше отзывов на сайте на русском языке. Продукция оригинальная, цены адекватные для Латвии.", product: "CeraVe Moisturizer" },
  { name: "Наталья Б.", rating: 5, date: "8 февраля 2026", text: "Заказываю для всей семьи. Мужу крем для тела от Eucerin, дочке мицеллярную воду, себе SPF. Pharmiperia стал нашим любимым магазином.", product: "Разные продукты" },
]

const stats = [
  { label: "5 звёзд", count: 847, percent: 78 },
  { label: "4 звезды", count: 176, percent: 16 },
  { label: "3 звезды", count: 54, percent: 5 },
  { label: "2 звезды", count: 11, percent: 1 },
  { label: "1 звезда", count: 4, percent: 0.4 },
]

export default function ReviewsPage() {
  const avg = 4.8

  return (
    <LangProvider>
      <CartProvider>
        <PromoBar />
        <SiteHeader />
        <CartDrawer />
        <main className="min-h-screen bg-background">
          <div className="mx-auto max-w-5xl px-4 py-10">
            <h1 className="text-3xl font-bold text-foreground">Отзывы покупателей</h1>
            <p className="mt-2 text-muted-foreground">Реальные отзывы от наших клиентов о товарах и сервисе</p>

            {/* Summary */}
            <div className="mt-8 grid gap-6 sm:grid-cols-2 rounded-2xl border border-border bg-card p-6 md:p-8">
              <div className="flex flex-col items-center justify-center text-center">
                <span className="text-6xl font-bold text-foreground">{avg}</span>
                <div className="mt-2 flex gap-1">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className={`h-6 w-6 ${s <= Math.round(avg) ? "fill-amber-400 text-amber-400" : "text-muted"}`} />
                  ))}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">1 092 отзыва</p>
              </div>
              <div className="space-y-2">
                {stats.map(({ label, count, percent }) => (
                  <div key={label} className="flex items-center gap-3 text-sm">
                    <span className="w-16 text-muted-foreground shrink-0">{label}</span>
                    <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full rounded-full bg-amber-400" style={{ width: `${percent}%` }} />
                    </div>
                    <span className="w-10 text-right text-muted-foreground shrink-0">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews grid */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {reviews.map((review, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-foreground">{review.name}</p>
                      <p className="text-xs text-muted-foreground">{review.date} · {review.product}</p>
                    </div>
                    <div className="flex shrink-0 gap-0.5">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className={`h-4 w-4 ${s <= review.rating ? "fill-amber-400 text-amber-400" : "text-muted"}`} />
                      ))}
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-foreground/80 leading-relaxed">{review.text}</p>
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
