"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { products as allProducts } from "@/lib/data"
import { LangProvider, useLang } from "@/lib/i18n"
import { compareMoney, discountPercent } from "@/lib/money"
import { CartProvider } from "@/components/cart-context"
import { FavoritesProvider } from "@/components/favorites-provider"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CartDrawer } from "@/components/cart-drawer"
import { ProductCard } from "@/components/product-card"
import { ChevronRight } from "lucide-react"

function SpecialsPageContent() {
  const { t } = useLang()
  const [sortBy, setSortBy] = useState("popular")

  const discounted = useMemo(() => {
    const items = allProducts.filter(
      (p) => p.originalPrice != null || p.badge === "discount"
    )
    return [...items].sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return compareMoney(a.price, b.price)
        case "price-desc":
          return compareMoney(b.price, a.price)
        case "rating":
          return b.rating - a.rating
        case "discount": {
          const da =
            a.originalPrice != null ? discountPercent(a.price, a.originalPrice) : 0
          const db =
            b.originalPrice != null ? discountPercent(b.price, b.originalPrice) : 0
          return db - da
        }
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
            {t("breadcrumbHome")}
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-foreground">{t("specialsTitle")}</span>
        </div>
      </div>

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6">
          {/* Header */}
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground md:text-3xl">{t("specialsTitle")}</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {discounted.length} {t("productsLabel")}
              </p>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground"
            >
              <option value="popular">{t("sortByPopular")}</option>
              <option value="discount">{t("sortByDiscount")}</option>
              <option value="price-asc">{t("sortByPriceAsc")}</option>
              <option value="price-desc">{t("sortByPriceDesc")}</option>
              <option value="rating">{t("sortByRating")}</option>
            </select>
          </div>

          {/* Products */}
          {discounted.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16">
              <p className="text-lg font-medium text-foreground">
                {t("noSpecials")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {discounted.map((product) => (
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

export default function SpecialsPage() {
  return (
    <LangProvider>
      <CartProvider>
        <FavoritesProvider>
          <SpecialsPageContent />
        </FavoritesProvider>
      </CartProvider>
    </LangProvider>
  )
}
