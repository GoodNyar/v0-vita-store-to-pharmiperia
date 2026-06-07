"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { products as allProducts } from "@/lib/data"
import { LangProvider, useLang } from "@/lib/i18n"
import { CartProvider } from "@/components/cart-context"
import { FavoritesProvider } from "@/components/favorites-provider"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CartDrawer } from "@/components/cart-drawer"
import { ProductCard } from "@/components/product-card"
import { ChevronRight } from "lucide-react"

function PopularPageContent() {
  const { lang } = useLang()
  const [sortBy, setSortBy] = useState("popular")

  const title = lang === "ru" ? "Популярное" : "Populārie"

  const popular = useMemo(() => {
    // Products explicitly marked as popular or bestSeller
    const matched = allProducts.filter(
      (p) => p.badge === "popular" || p.badge === "bestSeller"
    )

    // Fall back to all products sorted by reviewCount if too few match
    const base =
      matched.length >= 4
        ? matched
        : [...allProducts].sort((a, b) => b.reviewCount - a.reviewCount)

    return [...base].sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price
        case "price-desc":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        default:
          return b.reviewCount - a.reviewCount
      }
    })
  }, [sortBy])

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <CartDrawer />

      {/* Breadcrumbs */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 text-sm">
          <Link href="/" className="text-muted-foreground hover:text-primary">
            {lang === "ru" ? "Главная" : "Sākums"}
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-foreground">{title}</span>
        </div>
      </div>

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6">
          {/* Header */}
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground md:text-3xl">{title}</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {popular.length} {lang === "ru" ? "товаров" : "preces"}
              </p>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground"
            >
              <option value="popular">{lang === "ru" ? "По популярности" : "Pēc popularitātes"}</option>
              <option value="price-asc">{lang === "ru" ? "Сначала дешевле" : "Vispirms lētākie"}</option>
              <option value="price-desc">{lang === "ru" ? "Сначала дороже" : "Vispirms dārgākie"}</option>
              <option value="rating">{lang === "ru" ? "По рейтингу" : "Pēc vērtējuma"}</option>
            </select>
          </div>

          {/* Products */}
          {popular.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16">
              <p className="text-lg font-medium text-foreground">
                {lang === "ru" ? "Товары не найдены" : "Preces nav atrastas"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {popular.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

export default function PopularPage() {
  return (
    <LangProvider>
      <CartProvider>
        <FavoritesProvider>
          <PopularPageContent />
        </FavoritesProvider>
      </CartProvider>
    </LangProvider>
  )
}
