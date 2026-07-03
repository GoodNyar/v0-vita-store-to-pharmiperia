"use client"

import { use, useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Sparkles, Package } from "lucide-react"
import {
  getProductsByBrandSlug,
  getBrandNameFromSlug,
  getBrandLogo,
  type Product,
} from "@/lib/data"
import { useLang } from "@/lib/i18n"
import { compareMoney } from "@/lib/money"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CartDrawer } from "@/components/cart-drawer"
import { ProductCard } from "@/components/product-card"

type SortOption = "popular" | "price-asc" | "price-desc" | "rating"

export default function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const { t } = useLang()
  const [sortBy, setSortBy] = useState<SortOption>("popular")

  const displayBrand = getBrandNameFromSlug(slug)
  const brandLogo = getBrandLogo(slug)

  const sortedProducts = useMemo(() => {
    const brandProducts: Product[] = getProductsByBrandSlug(slug)
    const sorted = [...brandProducts]
    switch (sortBy) {
      case "price-asc":
        sorted.sort((a, b) => compareMoney(a.price, b.price))
        break
      case "price-desc":
        sorted.sort((a, b) => compareMoney(b.price, a.price))
        break
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating)
        break
      default:
        sorted.sort((a, b) => b.reviewCount - a.reviewCount)
    }
    return sorted
  }, [slug, sortBy])

  const productCount = sortedProducts.length

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
          <Link href="/category/brands" className="text-muted-foreground hover:text-primary">
            {t("brandsPageTitle")}
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-foreground">{displayBrand}</span>
        </div>
      </div>

      <main className="flex-1">
        {/* Brand hero header */}
        <section className="border-b border-border bg-gradient-to-b from-primary/5 to-transparent">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-4 py-12 text-center sm:flex-row sm:gap-8 sm:text-left">
            {/* Logo card (or monogram fallback) */}
            {brandLogo ? (
              <div className="flex h-28 w-44 flex-shrink-0 items-center justify-center rounded-3xl border border-border/60 bg-white p-5 shadow-sm">
                <Image
                  src={brandLogo || "/placeholder.svg"}
                  alt={displayBrand}
                  width={200}
                  height={90}
                  priority
                  className="max-h-[72px] w-auto max-w-full object-contain"
                />
              </div>
            ) : (
              <span className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-3xl bg-primary/10 text-3xl font-bold text-primary">
                {displayBrand.charAt(0)}
              </span>
            )}

            <div className="flex-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                {t("brandsHeroBadge")}
              </span>
              <h1 className="mt-3 text-3xl font-bold text-foreground md:text-4xl">{displayBrand}</h1>
              <p className="mt-2 flex items-center justify-center gap-1.5 text-sm text-muted-foreground sm:justify-start">
                <Package className="h-4 w-4" />
                {productCount} {t("productsLabel")}
              </p>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-6">
          {/* Toolbar: sorting */}
          {productCount > 0 && (
            <div className="mb-5 flex items-center justify-end gap-2">
              <label htmlFor="brand-sort" className="text-sm text-muted-foreground">
                {t("sortLabel")}
              </label>
              <select
                id="brand-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="popular">{t("sortByPopular")}</option>
                <option value="price-asc">{t("sortByPriceAsc")}</option>
                <option value="price-desc">{t("sortByPriceDesc")}</option>
                <option value="rating">{t("sortByRating")}</option>
              </select>
            </div>
          )}

          {/* Products */}
          {productCount === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16">
              <Package className="mb-3 h-10 w-10 text-muted-foreground" />
              <p className="text-center text-lg font-medium text-foreground">
                {t("productsSoonAvailable")}
              </p>
              <Link
                href="/category/brands"
                className="mt-4 rounded-full border border-border bg-card px-6 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                {t("backToBrands")}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-4">
              {sortedProducts.map((product) => (
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
