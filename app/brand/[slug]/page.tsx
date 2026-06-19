"use client"

import { use } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { products } from "@/lib/data"
import { useLang } from "@/lib/i18n"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CartDrawer } from "@/components/cart-drawer"
import { ProductCard } from "@/components/product-card"

export default function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const { t } = useLang()

  // Convert slug back to a readable brand name (e.g. "la-roche-posay" -> "La Roche Posay")
  const brandName = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  // Match products whose brand corresponds to this slug
  const normalizedSlug = slug.toLowerCase().replace(/\s+/g, "-")
  const brandProducts = products.filter(
    (p) => p.brand.toLowerCase().replace(/\s+/g, "-") === normalizedSlug
  )

  // Prefer the exact brand label from the data if any products matched
  const displayBrand = brandProducts.length > 0 ? brandProducts[0].brand : brandName

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
          <span className="font-medium text-foreground">{displayBrand}</span>
        </div>
      </div>

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6">
          {/* Header */}
          <div className="mb-6">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-primary/70">
              {t("brandLabel")}
            </p>
            <h1 className="mt-1 text-2xl font-bold text-foreground md:text-3xl">{displayBrand}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {brandProducts.length} {t("productsLabel")}
            </p>
          </div>

          {/* Products */}
          {brandProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16">
              <p className="text-center text-lg font-medium text-foreground">
                {t("productsSoonAvailable")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-4">
              {brandProducts.map((product) => (
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
