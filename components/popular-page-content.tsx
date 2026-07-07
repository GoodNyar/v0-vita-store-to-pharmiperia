"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import type { Product } from "@/lib/data"
import { useLang } from "@/lib/i18n"
import { compareMoney } from "@/lib/money"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CartDrawer } from "@/components/cart-drawer"
import { ProductCard } from "@/components/product-card"
import { CatalogLoadError } from "@/components/catalog-load-error"
import { ChevronRight } from "lucide-react"

export function PopularPageContent({
  allProducts,
  catalogLoadError = false,
}: {
  allProducts: Product[]
  catalogLoadError?: boolean
}) {
  const { t } = useLang()
  const [sortBy, setSortBy] = useState("popular")

  const popular = useMemo(() => {
    const matched = allProducts.filter(
      (p) => p.badge === "popular" || p.badge === "bestSeller"
    )

    const base =
      matched.length >= 4
        ? matched
        : [...allProducts].sort((a, b) => b.reviewCount - a.reviewCount)

    return [...base].sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return compareMoney(a.price, b.price)
        case "price-desc":
          return compareMoney(b.price, a.price)
        case "rating":
          return b.rating - a.rating
        default:
          return b.reviewCount - a.reviewCount
      }
    })
  }, [allProducts, sortBy])

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <CartDrawer />

      <div className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 text-sm">
          <Link href="/" className="text-muted-foreground hover:text-primary">
            {t("breadcrumbHome")}
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-foreground">{t("popularTitle")}</span>
        </div>
      </div>

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground md:text-3xl">{t("popularTitle")}</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {popular.length} {t("productsLabel")}
              </p>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground"
            >
              <option value="popular">{t("sortByPopular")}</option>
              <option value="price-asc">{t("sortByPriceAsc")}</option>
              <option value="price-desc">{t("sortByPriceDesc")}</option>
              <option value="rating">{t("sortByRating")}</option>
            </select>
          </div>

          {catalogLoadError ? (
            <CatalogLoadError />
          ) : popular.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16">
              <p className="text-lg font-medium text-foreground">
                {t("productsNotFound")}
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