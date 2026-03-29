"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PromoBar } from "@/components/promo-bar"
import { CartDrawer } from "@/components/cart-drawer"
import { CartProvider } from "@/components/cart-context"
import { LangProvider, useLang } from "@/lib/i18n"
import { Star, CheckCircle } from "lucide-react"

const reviews = [
  {
    name: "Jānis M.",
    rating: 5,
    date: { ru: "20 марта 2026", lv: "20. marts 2026" },
    text: {
      ru: "Заказываю уже третий раз. Sensibio H2O — просто спасение для моей чувствительной кожи. Доставка в Латвию быстрая, упаковка надёжная.",
      lv: "Pasūtu jau trešo reizi. Sensibio H2O ir īsts glābiņš manai jutīgajai ādai. Piegāde Latvijā ātra, iepakojums uzticams."
    },
    product: "Sensibio H2O",
  },
  {
    name: "Мария Н.",
    rating: 5,
    date: { ru: "15 марта 2026", lv: "15. marts 2026" },
    text: {
      ru: "Наконец нашла магазин с оригинальной La Roche-Posay в Латвии! Anthelios SPF50+ — лучший санскрин, что я пробовала. Рекомендую всем.",
      lv: "Beidzot atradu veikalu ar oriģinālo La Roche-Posay Latvijā! Anthelios SPF50+ — labākais sauļošanās līdzeklis, ko esmu izmēģinājusi."
    },
    product: "Anthelios SPF50+",
  },
  {
    name: "Emīls K.",
    rating: 5,
    date: { ru: "10 марта 2026", lv: "10. marts 2026" },
    text: {
      ru: "Mineral 89 от Vichy преобразил мою кожу. Начал использовать зимой — уже через неделю кожа стала более увлажнённой и гладкой.",
      lv: "Vichy Mineral 89 pārveidoja manu ādu. Sāku lietot ziemā — jau pēc nedēļas āda kļuva mitrinātāka un gludāka."
    },
    product: "Mineral 89",
  },
  {
    name: "Julija S.",
    rating: 4,
    date: { ru: "5 марта 2026", lv: "5. marts 2026" },
    text: {
      ru: "Хороший сайт, большой выбор брендов. Cicaplast Baume — теперь мой постоянный продукт. Доставка пришла быстро.",
      lv: "Laba mājaslapa, liela zīmolu izvēle. Cicaplast Baume tagad ir mans pastāvīgais produkts. Piegāde ieradās ātri."
    },
    product: "Cicaplast Baume B5+",
  },
  {
    name: "Анна К.",
    rating: 5,
    date: { ru: "28 февраля 2026", lv: "28. februāris 2026" },
    text: {
      ru: "Pharmiperia — лучший выбор для тех, кто ищет аптечную косметику в Латвии. Быстро, оригинально, есть накопительные бонусы. Очень довольна!",
      lv: "Pharmiperia — labākā izvēle tiem, kas meklē aptiekas kosmētiku Latvijā. Ātri, oriģināli, ir uzkrājošie bonusi. Esmu ļoti apmierināta!"
    },
    product: "Huile Prodigieuse",
  },
  {
    name: "Kristīne B.",
    rating: 5,
    date: { ru: "20 февраля 2026", lv: "20. februāris 2026" },
    text: {
      ru: "Отличный магазин! Заказала Hyalu B5 сыворотку — результат виден уже через 2 недели. Кожа выглядит как после салонной процедуры.",
      lv: "Lielisks veikals! Pasūtīju Hyalu B5 serumu — rezultāts redzams jau pēc 2 nedēļām. Āda izskatās kā pēc salona procedūras."
    },
    product: "Hyalu B5 Serum",
  },
  {
    name: "Наталья Б.",
    rating: 5,
    date: { ru: "14 февраля 2026", lv: "14. februāris 2026" },
    text: {
      ru: "Заказываю для всей семьи. Pharmiperia стал нашим любимым магазином. Всегда оригинальная продукция и удобная доставка.",
      lv: "Pasūtu visai ģimenei. Pharmiperia ir kļuvis par mūsu iecienīto veikalu. Vienmēr oriģināla produkcija un ērta piegāde."
    },
    product: "Dažādi produkti",
  },
  {
    name: "Māris L.",
    rating: 4,
    date: { ru: "8 февраля 2026", lv: "8. februāris 2026" },
    text: {
      ru: "Хороший выбор мужской косметики. Eucerin Men понравился. Буду заказывать снова.",
      lv: "Laba vīriešu kosmētikas izvēle. Eucerin Men patika. Pasūtīšu vēlreiz."
    },
    product: "Eucerin Men",
  },
]

const statsData = [
  { key: "reviewsStars5" as const, count: 847, percent: 78 },
  { key: "reviewsStars4" as const, count: 176, percent: 16 },
  { key: "reviewsStars3" as const, count: 54, percent: 5 },
  { key: "reviewsStars2" as const, count: 11, percent: 1 },
  { key: "reviewsStars1" as const, count: 4, percent: 0.4 },
]

function ReviewsContent() {
  const { t, lang } = useLang()
  const avg = 4.8

  const [form, setForm] = useState({ name: "", product: "", rating: 5, comment: "" })
  const [submitted, setSubmitted] = useState(false)
  const [hoveredStar, setHoveredStar] = useState(0)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.comment) return
    setSubmitted(true)
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-3xl font-bold text-foreground">{t("reviewsTitle")}</h1>
        <p className="mt-2 text-muted-foreground">{t("reviewsSubtitle")}</p>

        {/* Summary */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 rounded-2xl border border-border bg-card p-6 md:p-8">
          <div className="flex flex-col items-center justify-center text-center">
            <span className="text-6xl font-bold text-foreground">{avg}</span>
            <div className="mt-2 flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={`h-6 w-6 ${s <= Math.round(avg) ? "fill-amber-400 text-amber-400" : "text-muted"}`} />
              ))}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">1 092 {t("reviewsCount")}</p>
          </div>
          <div className="space-y-2">
            {statsData.map(({ key, count, percent }) => (
              <div key={key} className="flex items-center gap-3 text-sm">
                <span className="w-24 text-muted-foreground shrink-0">{t(key)}</span>
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
                  <p className="text-xs text-muted-foreground">{review.date[lang]} · {review.product}</p>
                </div>
                <div className="flex shrink-0 gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`h-4 w-4 ${s <= review.rating ? "fill-amber-400 text-amber-400" : "text-muted"}`} />
                  ))}
                </div>
              </div>
              <p className="mt-3 text-sm text-foreground/80 leading-relaxed">{review.text[lang]}</p>
            </div>
          ))}
        </div>

        {/* Leave a review form */}
        <div className="mt-12 rounded-2xl border border-border bg-card p-6 md:p-8">
          <h2 className="text-xl font-bold text-foreground">{t("leaveReview")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("reviewModerationNote")}</p>

          {submitted ? (
            <div className="mt-6 flex flex-col items-center gap-3 py-8 text-center">
              <CheckCircle className="h-12 w-12 text-primary" />
              <p className="text-base font-semibold text-foreground">{t("reviewPending")}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">{t("reviewRating")}</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, rating: s }))}
                      onMouseEnter={() => setHoveredStar(s)}
                      onMouseLeave={() => setHoveredStar(0)}
                      className="p-0.5"
                    >
                      <Star
                        className={`h-7 w-7 transition-colors ${
                          s <= (hoveredStar || form.rating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">{t("reviewName")}</label>
                  <input
                    type="text"
                    placeholder={t("reviewNamePlaceholder")}
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    required
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">{t("reviewProduct")}</label>
                  <input
                    type="text"
                    placeholder={t("reviewProductPlaceholder")}
                    value={form.product}
                    onChange={(e) => setForm((f) => ({ ...f, product: e.target.value }))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">{t("reviewComment")}</label>
                <textarea
                  placeholder={t("reviewCommentPlaceholder")}
                  value={form.comment}
                  onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
                  required
                  rows={4}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <button
                type="submit"
                className="flex h-11 items-center justify-center rounded-lg bg-primary px-8 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {t("reviewSubmit")}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  )
}

export default function ReviewsPage() {
  return (
    <LangProvider>
      <CartProvider>
        <PromoBar />
        <SiteHeader />
        <CartDrawer />
        <ReviewsContent />
        <SiteFooter />
      </CartProvider>
    </LangProvider>
  )
}
