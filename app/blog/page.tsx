"use client"

import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PromoBar } from "@/components/promo-bar"
import { CartDrawer } from "@/components/cart-drawer"
import { CartProvider } from "@/components/cart-context"
import { LangProvider } from "@/lib/i18n"
import { Calendar, Clock, ArrowRight, Tag } from "lucide-react"

const articles = [
  {
    slug: "top-spf-produkty-2026",
    title: "Лучшие SPF-средства 2026: что выбрать этим летом",
    excerpt: "Солнцезащита — не только летний ритуал. Разбираем топ SPF-флюидов и кремов, которые защищают кожу круглый год без белых разводов и жирного блеска.",
    category: "Солнцезащита",
    date: "25 марта 2026",
    readTime: "5 мин",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80",
    featured: true,
  },
  {
    slug: "gialuronovaya-kislota-kak-vybrat",
    title: "Гиалуроновая кислота: как выбрать правильную концентрацию",
    excerpt: "Не все гиалуроновые кислоты одинаковы. Объясняем разницу между низко- и высокомолекулярной HA и как выбрать продукт под свой тип кожи.",
    category: "Уход за лицом",
    date: "18 марта 2026",
    readTime: "7 мин",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80",
    featured: true,
  },
  {
    slug: "sensitiv-kozha-rukovodstvo",
    title: "Чувствительная кожа: полный гид по уходу",
    excerpt: "Раздражение, покраснение, жжение — признаки реактивной кожи. Разбираем причины и рекомендуем проверенные аптечные средства от La Roche-Posay, Avène и Bioderma.",
    category: "Чувствительная кожа",
    date: "10 марта 2026",
    readTime: "9 мин",
    image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=800&q=80",
    featured: false,
  },
  {
    slug: "retinol-nachinaeushim",
    title: "Ретинол для начинающих: как ввести в уход без раздражения",
    excerpt: "Ретинол — золотой стандарт антивозрастного ухода. Но многие бросают его после первых недель из-за шелушения. Рассказываем, как правильно начать.",
    category: "Антивозрастной уход",
    date: "3 марта 2026",
    readTime: "8 мин",
    image: "https://images.unsplash.com/photo-1617897903246-719242758050?w=800&q=80",
    featured: false,
  },
  {
    slug: "micellyarnaya-voda-mify",
    title: "5 мифов о мицеллярной воде — разбираем с дерматологом",
    excerpt: "Нужно ли смывать мицеллярную воду? Подходит ли она для жирной кожи? Отвечаем на самые частые вопросы о самом популярном средстве для снятия макияжа.",
    category: "Очищение",
    date: "24 февраля 2026",
    readTime: "4 мин",
    image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=800&q=80",
    featured: false,
  },
  {
    slug: "uhod-za-volosami-zima",
    title: "Зимний уход за волосами: спасаем от сухости и ломкости",
    excerpt: "Холодный воздух и центральное отопление — главные враги волос зимой. Разбираем эффективные маски, масла и шампуни для восстановления.",
    category: "Волосы",
    date: "15 февраля 2026",
    readTime: "6 мин",
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80",
    featured: false,
  },
]

const categories = ["Все", "Уход за лицом", "Солнцезащита", "Чувствительная кожа", "Антивозрастной уход", "Очищение", "Волосы"]

export default function BlogPage() {
  const featured = articles.filter(a => a.featured)
  const rest = articles.filter(a => !a.featured)

  return (
    <LangProvider>
      <CartProvider>
        <PromoBar />
        <SiteHeader />
        <CartDrawer />
        <main className="min-h-screen bg-background">
          <div className="mx-auto max-w-7xl px-4 py-10">
            {/* Header */}
            <div className="mb-10">
              <h1 className="text-3xl font-bold text-foreground">Блог Pharmiperia</h1>
              <p className="mt-2 text-muted-foreground">Советы дерматологов, обзоры продуктов и гиды по уходу за кожей</p>
            </div>

            {/* Categories */}
            <div className="mb-8 flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    cat === "Все"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
                  }`}
                >
                  {cat}
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
                      src={article.image}
                      alt={article.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      <Tag className="h-3 w-3" />
                      {article.category}
                    </span>
                    <h2 className="mt-3 text-lg font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                      {article.title}
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{article.excerpt}</p>
                    <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{article.date}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{article.readTime}</span>
                      </div>
                      <span className="flex items-center gap-1 text-primary font-medium">Читать <ArrowRight className="h-3 w-3" /></span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* All articles */}
            <h2 className="mb-6 text-xl font-bold text-foreground">Все статьи</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((article) => (
                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}`}
                  className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-md"
                >
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-xs font-medium text-primary">{article.category}</span>
                    <h3 className="mt-1.5 text-sm font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{article.date}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{article.readTime}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </main>
        <SiteFooter />
      </CartProvider>
    </LangProvider>
  )
}
