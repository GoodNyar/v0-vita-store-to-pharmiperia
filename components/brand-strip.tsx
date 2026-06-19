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
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {brands.map((brand) => (
          <Link
            key={brand.slug}
            href={`/brand/${brand.slug}`}
            className="group relative flex flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border border-border bg-white px-4 py-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_12px_36px_rgba(0,0,0,0.10)]"
          >
            {/* Logo (or monogram fallback) */}
            <div className="flex h-12 w-full items-center justify-center">
              {brand.logo ? (
                <Image
                  src={brand.logo || "/placeholder.svg"}
                  alt={brand.name}
                  width={140}
                  height={48}
                  className="max-h-12 w-auto max-w-[80%] object-contain opacity-90 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100"
                />
              ) : (
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  {brand.name.charAt(0)}
                </span>
              )}
            </div>

            {/* Brand name */}
            <span className="text-sm font-semibold leading-tight text-foreground">
              {brand.name}
            </span>

            {/* Product counter */}
            <span className="text-[11px] text-muted-foreground">
              {brand.productCount} {t("productsLabel")}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
