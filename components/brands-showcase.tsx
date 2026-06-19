"use client"

import Link from "next/link"
import Image from "next/image"
import { ChevronRight, ArrowRight, Sparkles } from "lucide-react"
import { getBrandsWithCounts } from "@/lib/data"
import { useLang } from "@/lib/i18n"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CartDrawer } from "@/components/cart-drawer"

export function BrandsShowcase() {
  const { t } = useLang()
  const brands = getBrandsWithCounts()

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
          <span className="font-medium text-foreground">{t("brandsPageTitle")}</span>
        </div>
      </div>

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border bg-gradient-to-b from-primary/5 to-transparent">
          <div className="mx-auto max-w-7xl px-4 py-10 text-center sm:py-14">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              {t("brandsHeroBadge")}
            </span>
            <h1 className="mt-4 text-balance text-3xl font-bold text-foreground md:text-4xl">
              {t("brandsPageTitle")}
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-pretty text-sm text-muted-foreground sm:text-base">
              {t("brandsPageSubtitle")}
            </p>
            <p className="mt-4 text-sm font-medium text-primary">
              {brands.length} {t("brandsCountLabel")}
            </p>
          </div>
        </section>

        {/* Brand cards */}
        <section className="mx-auto max-w-7xl px-4 py-10 sm:py-12">
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 xl:grid-cols-5">
            {brands.map((brand) => (
              <Link
                key={brand.slug}
                href={`/brand/${brand.slug}`}
                aria-label={`${brand.name} — ${brand.productCount} ${t("productsLabel")}`}
                className="group flex flex-col items-center justify-between gap-5 rounded-3xl border border-border/60 bg-white px-5 py-7 text-center shadow-[0_2px_12px_rgba(0,0,0,0.05)] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.03] hover:border-primary/30 hover:shadow-[0_18px_44px_rgba(0,0,0,0.13)]"
              >
                {/* Large centered logo (or monogram fallback) */}
                <div className="flex h-24 w-full items-center justify-center">
                  {brand.logo ? (
                    <Image
                      src={brand.logo || "/placeholder.svg"}
                      alt={brand.name}
                      width={200}
                      height={96}
                      className="max-h-24 w-auto max-w-[85%] object-contain transition-transform duration-300 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-bold text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                      {brand.name.charAt(0)}
                    </span>
                  )}
                </div>

                {/* Brand name + product counter + CTA */}
                <div className="flex flex-col items-center gap-1.5">
                  <span className="text-base font-bold leading-tight text-foreground">
                    {brand.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {brand.productCount} {t("brandProductsCount")}
                  </span>
                  <span className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-primary">
                    {t("viewBrandProducts")}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
