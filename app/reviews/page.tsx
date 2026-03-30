"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
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
      ru: "Заказывал Vichy Homme антиперспирант – реально держит целый день без запаха, даже после работы. Не оставляет следов на одежде, что важно для меня. Доставка в Ригу быстрая, товар оригинал.",
      lv: "Pasūtīju Vichy Homme antiperspirantu – tiešām notur visu dienu bez smakas, pat pēc darba. Neatstāj pēdas uz drēbēm, kas man ir svarīgi. Piegāde uz Rīgu ātra, prece oriģināla.",
    },
    product: "Vichy Homme",
  },
  {
    name: "Мария Н.",
    rating: 5,
    date: { ru: "15 марта 2026", lv: "15. marts 2026" },
    text: {
      ru: "Покупала La Roche-Posay Anthelios SPF50+ – лучший солнцезащитный крем, который пробовала. Кожа не жирнится, нет белых следов. Очень довольна, буду заказывать ещё.",
      lv: "Pirku La Roche-Posay Anthelios SPF50+ – labākais sauļošanās krēms, ko esmu izmēģinājusi. Āda nekļūst taukaina, nav baltu pēdu. Esmu ļoti apmierināta, pasūtīšu vēl.",
    },
    product: "Anthelios SPF50+",
  },
  {
    name: "Emīls K.",
    rating: 5,
    date: { ru: "10 марта 2026", lv: "10. marts 2026" },
    text: {
      ru: "Брал Vichy Mineral 89 – кожа стала заметно более увлажнённой уже через неделю. Не имеет выраженного запаха, быстро впитывается. Отличный уход на каждый день.",
      lv: "Ņēmu Vichy Mineral 89 – āda kļuva manāmi mitrinātāka jau pēc nedēļas. Nav izteiktas smakas, ātri uzsūcas. Lieliska ikdienas kopšana.",
    },
    product: "Mineral 89",
  },
  {
    name: "Julija S.",
    rating: 5,
    date: { ru: "5 марта 2026", lv: "5. marts 2026" },
    text: {
      ru: "Zakazala Hyalu B5 serum – efekt realno vidno uzhe cherez paru nedel. Kozha stala bolee gladkaja i svezhaja. Magazin ponravilsa, budu zdes brat eshe",
      lv: "Zakazala Hyalu B5 serum – efekt realno vidno uzhe cherez paru nedel. Kozha stala bolee gladkaja i svezhaja. Magazin ponravilsa, budu zdes brat eshe",
    },
    product: "Hyalu B5 Serum",
  },
  {
    name: "Anna K.",
    rating: 5,
    date: { ru: "28 февраля 2026", lv: "28. februāris 2026" },
    text: {
      ru: "Huile Prodigieuse – просто находка. Использую и для тела, и для волос. Запах дорогой, эффект заметен сразу. Приятно, что всё оригинал и по адекватной цене.",
      lv: "Huile Prodigieuse – īsts atradums. Izmantoju gan ķermenim, gan matiem. Smarža dārga, efekts jūtams uzreiz. Patīkami, ka viss oriģināls un par saprātīgu cenu.",
    },
    product: "Huile Prodigieuse",
  },
  {
    name: "Kristīne B.",
    rating: 5,
    date: { ru: "20 февраля 2026", lv: "20. februāris 2026" },
    text: {
      ru: "Заказала сыворотку La Roche-Posay Hyalu B5 – кожа стала выглядеть как после салона. Хорошо увлажняет, разглаживает мелкие морщины. Доставка быстрая, всё аккуратно упаковано. Очень довольна",
      lv: "Pasūtīju La Roche-Posay Hyalu B5 serumu – āda sāka izskatīties kā pēc salona. Labi mitrina, izlīdzina sīkas grumbiņas. Piegāde ātra, viss rūpīgi iepakots. Esmu ļoti apmierināta",
    },
    product: "Hyalu B5 Serum",
  },
  {
    name: "Наталья Б.",
    rating: 5,
    date: { ru: "14 февраля 2026", lv: "14. februāris 2026" },
    text: {
      ru: "Покупаю здесь для всей семьи. Брала Bioderma и Vichy – качество отличное, всё оригинальное. Цены приятнее, чем в аптеках. Очень удобно и быстро.",
      lv: "Šeit pērku visai ģimenei. Ņēmu Bioderma un Vichy – kvalitāte lieliska, viss oriģināls. Cenas labākas nekā aptiekās. Ļoti ērti un ātri.",
    },
    product: "Bioderma, Vichy",
  },
  {
    name: "Māris L.",
    rating: 5,
    date: { ru: "8 февраля 2026", lv: "8. februāris 2026" },
    text: {
      ru: "Заказывал Biotherm Homme – хороший мужской уход, кожа стала более свежей и ухоженной. Нравится, что с ним молодею. Обязательно буду брать ещё.",
      lv: "Pasūtīju Biotherm Homme – laba vīriešu kopšana, āda kļuva svaigāka un koptāka. Patīk, ka ar to jūtos jaunāks. Noteikti ņemšu vēl.",
    },
    product: "Biotherm Homme",
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
        <SiteHeader />
        <CartDrawer />
        <ReviewsContent />
        <SiteFooter />
      </CartProvider>
    </LangProvider>
  )
}
