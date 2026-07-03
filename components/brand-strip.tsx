"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { getBrandsWithCounts } from "@/lib/data"
import { useLang } from "@/lib/i18n"

export function BrandStrip() {
  const { t } = useLang()
  const brands = getBrandsWithCounts()

  return (
    <section className="mt-10">
      {/* Section header */}
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">{t("exploreBrandsTitle")}</h2>
          <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
            {t("exploreBrandsSubtitle")}
          </p>
        </div>
        <Link
          href="/category/brands"
          className="group flex flex-shrink-0 items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          {t("viewAllBrands")}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Brand grid */}
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 sm:gap-6 lg:grid-cols-5">
        {brands.map((brand) => (
          <Link
            key={brand.slug}
            href={`/brand/${brand.slug}`}
            aria-label={`${brand.name} — ${brand.productCount} ${t("productsLabel")}`}
            className="group flex flex-col items-center justify-between gap-5 rounded-3xl border border-border/60 bg-white px-5 py-7 text-center shadow-[0_2px_12px_rgba(0,0,0,0.05)] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.03] hover:border-primary/30 hover:shadow-[0_18px_44px_rgba(0,0,0,0.13)]"
          >
            {/* Large centered logo (or monogram fallback) */}
            <div className="flex h-20 w-full items-center justify-center">
              {brand.logo ? (
                <Image
                  src={brand.logo || "/placeholder.svg"}
                  alt={brand.name}
                  width={180}
                  height={80}
                  className="max-h-20 w-auto max-w-[85%] object-contain transition-transform duration-300 ease-out group-hover:scale-105"
                />
              ) : (
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-bold text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  {brand.name.charAt(0)}
                </span>
              )}
            </div>

            {/* Brand name + product counter */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-base font-bold leading-tight text-foreground">
                {brand.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {brand.productCount} {t("productsLabel")}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
