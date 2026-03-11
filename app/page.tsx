"use client"

import { PromoBar } from "@/components/promo-bar"
import { SiteHeader } from "@/components/site-header"
import { HeroBanner } from "@/components/hero-banner"
import { CategoryCards } from "@/components/category-cards"
import { CategorySidebar } from "@/components/category-sidebar"
import { ProductCard } from "@/components/product-card"
import { ProductFilters } from "@/components/product-filters"
import { CartDrawer } from "@/components/cart-drawer"
import { CartProvider } from "@/components/cart-context"
import { SiteFooter } from "@/components/site-footer"
import { PromoCards } from "@/components/promo-cards"
import { WhyBuyUs } from "@/components/why-buy-us"
import { LangProvider, useLang, formatEur } from "@/lib/i18n"
import { products } from "@/lib/data"
import { Truck, Shield, RotateCcw, Flame, Leaf } from "lucide-react"

function HomeContent() {
  const { t } = useLang()

  const trustBadges = [
    { icon: Truck, label: t("freeShipping"), desc: t("freeShippingDesc") },
    { icon: Shield, label: t("authentic"), desc: t("authenticDesc") },
    { icon: RotateCcw, label: t("easyReturns"), desc: t("easyReturnsDesc") },
    { icon: Leaf, label: t("pharmacyBadge"), desc: t("pharmacyBadgeDesc") },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PromoBar />
      <SiteHeader />
      <CartDrawer />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6">
          {/* Hero Banner */}
          <HeroBanner />

          {/* Pharmacy tagline — shown below hero on mobile, hidden on desktop (desktop has trust badges bar) */}
          <div className="mt-3 text-center text-xs font-medium text-muted-foreground sm:hidden">
            {t("pharmacyTagline")}
          </div>

          {/* Trust badges — 2×2 grid on mobile, single row on desktop */}
          <section className="mt-4 border-y border-border bg-card sm:mt-0">
            <div className="mx-auto grid max-w-7xl grid-cols-2 gap-0 sm:flex sm:items-center sm:justify-center sm:gap-10 sm:px-4 sm:py-3">
              {trustBadges.map((badge, i) => {
                const Icon = badge.icon
                return (
                  <div
                    key={badge.label}
                    className={`flex items-center gap-2 px-4 py-3 sm:px-0 sm:py-0
                      ${i % 2 === 0 ? "border-r border-border sm:border-r-0" : ""}
                      ${i < 2 ? "border-b border-border sm:border-b-0" : ""}
                    `}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0 text-primary" />
                    <div>
                      <p className="text-xs font-semibold text-foreground">
                        {badge.label}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {badge.desc}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Quick Categories */}
          <section className="mt-6 sm:mt-8">
            <h2 className="mb-3 text-lg font-semibold text-foreground sm:mb-4">
              {t("shopByCategory")}
            </h2>
            <CategoryCards />
          </section>

          {/* Main content: sidebar + products */}
          <section className="mt-8 flex gap-6">
            <CategorySidebar />

            <div className="flex-1">
              {/* Products Filters */}
              <ProductFilters />

              {/* Section header */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-accent" />
                  <h2 className="text-lg font-semibold text-foreground">
                    {t("trendingProducts")}
                  </h2>
                </div>
              </div>

              {/* Product Grid — 4 per row desktop, 3 tablet, 2 mobile */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-4">
                {products.slice(0, 8).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* View all popular */}
              <div className="mt-6 flex justify-center">
                <a
                  href="/popular"
                  className="rounded-full border border-border bg-card px-8 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  {t("viewAllPopular")}
                </a>
              </div>
            </div>
          </section>

          {/* Promo Cards */}
          <PromoCards />

          {/* Why Buy Us section */}
          <WhyBuyUs />

          {/* Newsletter */}
          <section className="mt-12 mb-8 rounded-xl bg-primary px-4 py-4 sm:px-6 sm:py-3.5">
            <div className="flex flex-col items-center text-center">
              <h2 className="text-base font-bold text-primary-foreground sm:text-lg">
                {t("joinNewsletter")}
              </h2>
              <p className="mt-1 max-w-md text-xs text-primary-foreground/85 sm:text-xs">
                {t("newsletterDesc")}
              </p>
              <form className="mt-3 flex w-full flex-col gap-2.5 sm:max-w-md sm:flex-row sm:gap-2">
                <input
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  className="h-10 w-full flex-1 rounded-full bg-primary-foreground px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-foreground/50"
                  required
                />
                <button
                  type="submit"
                  className="h-10 w-full rounded-full bg-accent px-6 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90 sm:w-auto"
                >
                  {t("subscribe")}
                </button>
              </form>
              <p className="mt-2 text-[10px] text-primary-foreground/60 leading-none">
                {t("newsletterBonus")}
              </p>
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

export default function HomePage() {
  return (
    <LangProvider>
      <CartProvider>
        <HomeContent />
      </CartProvider>
    </LangProvider>
  )
}
