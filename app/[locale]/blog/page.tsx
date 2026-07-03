"use client"

import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CartDrawer } from "@/components/cart-drawer"
import { CartProvider } from "@/components/cart-context"
import { LangProvider, useLang } from "@/lib/i18n"
import { Calendar, Clock, ArrowRight, Tag } from "lucide-react"

type Lang = "ru" | "lv"
type Loc = Record<Lang, string>

const articles: {
  slug: string
  title: Loc
  excerpt: Loc
  category: Loc
  date: Loc
  readTime: Loc
  image: string
  featured: boolean
}[] = [
  {
    slug: "top-spf-produkty-2026",
    title: {
      ru: "Лучшие SPF-средства 2026: что выбрать этим летом",
      lv: "Labākie SPF līdzekļi 2026: ko izvēlēties šovasar",
    },
    excerpt: {
      ru: "Солнцезащита — не только летний ритуал. Разбираем топ SPF-флюидов и кремов, которые защищают кожу круглый год без белых разводов и жирного блеска.",
      lv: "Saules aizsardzība nav tikai vasaras rituāls. Apskatām labākos SPF fluīdus un krēmus, kas aizsargā ādu visu gadu bez baltām svītrām un taukaina spīduma.",
    },
    category: { ru: "Солнцезащита", lv: "Saules aizsardzība" },
    date: { ru: "25 марта 2026", lv: "2026. gada 25. marts" },
    readTime: { ru: "5 мин", lv: "5 min" },
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80",
    featured: true,
  },
  {
    slug: "gialuronovaya-kislota-kak-vybrat",
    title: {
      ru: "Гиалуроновая кислота: как выбрать правильную концентрацию",
      lv: "Hialuronskābe: kā izvēlēties pareizo koncentrāciju",
    },
    excerpt: {
      ru: "Не все гиалуроновые кислоты одинаковы. Объясняем разницу между низко- и высокомолекулярной HA и как выбрать продукт под свой тип кожи.",
      lv: "Ne visas hialuronskābes ir vienādas. Skaidrojam atšķirību starp zemas un augstas molekulmasas HA un kā izvēlēties produktu savam ādas tipam.",
    },
    category: { ru: "Уход за лицом", lv: "Sejas kopšana" },
    date: { ru: "18 марта 2026", lv: "2026. gada 18. marts" },
    readTime: { ru: "7 мин", lv: "7 min" },
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80",
    featured: true,
  },
  {
    slug: "sensitiv-kozha-rukovodstvo",
    title: {
      ru: "Чувствительная кожа: полный гид по уходу",
      lv: "Jutīga āda: pilns kopšanas ceļvedis",
    },
    excerpt: {
      ru: "Раздражение, покраснение, жжение — признаки реактивной кожи. Разбираем причины и рекомендуем проверенные аптечные средства от La Roche-Posay, Avène и Bioderma.",
      lv: "Kairinājums, apsārtums, dedzināšana — reaktīvas ādas pazīmes. Apskatām cēloņus un iesakām pārbaudītus aptiekas līdzekļus no La Roche-Posay, Avène un Bioderma.",
    },
    category: { ru: "Чувствительная кожа", lv: "Jutīga āda" },
    date: { ru: "10 марта 2026", lv: "2026. gada 10. marts" },
    readTime: { ru: "9 мин", lv: "9 min" },
    image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=800&q=80",
    featured: false,
  },
  {
    slug: "retinol-nachinaeushim",
    title: {
      ru: "Ретинол для начинающих: как ввести в уход без раздражения",
      lv: "Retinols iesācējiem: kā ieviest kopšanā bez kairinājuma",
    },
    excerpt: {
      ru: "Ретинол — золотой стандарт антивозрастного ухода. Но многие бросают его после первых недель из-за шелушения. Рассказываем, как правильно начать.",
      lv: "Retinols ir pretnovecošanās kopšanas zelta standarts. Bet daudzi to pamet pēc pirmajām nedēļām lobīšanās dēļ. Stāstām, kā pareizi sākt.",
    },
    category: { ru: "Антивозрастной уход", lv: "Pretnovecošanās kopšana" },
    date: { ru: "3 марта 2026", lv: "2026. gada 3. marts" },
    readTime: { ru: "8 мин", lv: "8 min" },
    image: "https://images.unsplash.com/photo-1617897903246-719242758050?w=800&q=80",
    featured: false,
  },
  {
    slug: "micellyarnaya-voda-mify",
    title: {
      ru: "5 мифов о мицеллярной воде — разбираем с дерматологом",
      lv: "5 mīti par micelāro ūdeni — apskatām ar dermatologu",
    },
    excerpt: {
      ru: "Нужно ли смывать мицеллярную воду? Подходит ли она для жирной кожи? Отвечаем на самые частые вопросы о самом популярном средстве для снятия макияжа.",
      lv: "Vai micelārais ūdens jānoskalo? Vai tas der taukainai ādai? Atbildam uz biežākajiem jautājumiem par populārāko grima noņemšanas līdzekli.",
    },
    category: { ru: "Очищение", lv: "Attīrīšana" },
    date: { ru: "24 февраля 2026", lv: "2026. gada 24. februāris" },
    readTime: { ru: "4 мин", lv: "4 min" },
    image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=800&q=80",
    featured: false,
  },
  {
    slug: "uhod-za-volosami-zima",
    title: {
      ru: "Зимний уход за волосами: спасаем от сухости и ломкости",
      lv: "Matu kopšana ziemā: glābjam no sausuma un trausluma",
    },
    excerpt: {
      ru: "Холодный воздух и центральное отопление — главные враги волос зимой. Разбираем эффективные маски, масла и шампуни для восстановления.",
      lv: "Aukstais gaiss un centrālā apkure ir galvenie matu ienaidnieki ziemā. Apskatām efektīvas maskas, eļļas un šampūnus atjaunošanai.",
    },
    category: { ru: "Волосы", lv: "Mati" },
    date: { ru: "15 февраля 2026", lv: "2026. gada 15. februāris" },
    readTime: { ru: "6 мин", lv: "6 min" },
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80",
    featured: false,
  },
]

const categoryKeys: Loc[] = [
  { ru: "Уход за лицом", lv: "Sejas kopšana" },
  { ru: "Солнцезащита", lv: "Saules aizsardzība" },
  { ru: "Чувствительная кожа", lv: "Jutīga āda" },
  { ru: "Антивозрастной уход", lv: "Pretnovecošanās kopšana" },
  { ru: "Очищение", lv: "Attīrīšana" },
  { ru: "Волосы", lv: "Mati" },
]

function BlogContent() {
  const { t, lang } = useLang()
  const featured = articles.filter(a => a.featured)
  const rest = articles.filter(a => !a.featured)
  const categories = [{ ru: t("blogCategoryAll"), lv: t("blogCategoryAll") }, ...categoryKeys]

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-foreground">{t("blogTitle")}</h1>
          <p className="mt-2 text-muted-foreground">{t("blogSubtitle")}</p>
        </div>

        {/* Categories */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((cat, i) => (
            <button
              key={cat[lang]}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                i === 0
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
              }`}
            >
              {cat[lang]}
            </button>
          ))}
        </div>

        {/* Featured articles */}
        <div className="mb-10 grid gap-6 md:grid-cols-2">
          {featured.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md"
            >
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={article.image || "/placeholder.svg"}
                  alt={article.title[lang]}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  <Tag className="h-3 w-3" />
                  {article.category[lang]}
                </span>
                <h2 className="mt-3 text-lg font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                  {article.title[lang]}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{article.excerpt[lang]}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{article.date[lang]}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{article.readTime[lang]}</span>
                  </div>
                  <span className="flex items-center gap-1 text-primary font-medium">{t("blogRead")} <ArrowRight className="h-3 w-3" /></span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* All articles */}
        <h2 className="mb-6 text-xl font-bold text-foreground">{t("blogAllArticles")}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-md"
            >
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={article.image || "/placeholder.svg"}
                  alt={article.title[lang]}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <span className="text-xs font-medium text-primary">{article.category[lang]}</span>
                <h3 className="mt-1.5 text-sm font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                  {article.title[lang]}
                </h3>
                <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{article.date[lang]}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{article.readTime[lang]}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}

export default function BlogPage() {
  return (
    <LangProvider>
      <CartProvider>
        <SiteHeader />
        <CartDrawer />
        <BlogContent />
        <SiteFooter />
      </CartProvider>
    </LangProvider>
  )
}
