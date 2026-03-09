"use client"

import { PromoBar } from "@/components/promo-bar"
import { SiteHeader } from "@/components/site-header"
import { HeroBanner } from "@/components/hero-banner"
import { CategoryCards } from "@/components/category-cards"
import { CategorySidebar } from "@/components/category-sidebar"
import { ProductCard } from "@/components/product-card"
import { CartDrawer } from "@/components/cart-drawer"
import { CartProvider } from "@/components/cart-context"
import { SiteFooter } from "@/components/site-footer"
import { PromoCards } from "@/components/promo-cards"
import { WhyBuyUs } from "@/components/why-buy-us"
import { LangProvider, useLang, formatEur } from "@/lib/i18n"
import { products } from "@/lib/data"
import { Truck, Shield, RotateCcw } from "lucide-react"

function HomeContent() {
  const { t } = useLang()

  const trustBadges = [
    { icon: Truck, label: t("freeShipping"), desc: t("freeShippingDesc") },
    { icon: Shield, label: t("authentic"), desc: t("authenticDesc") },
    { icon: RotateCcw, label: t("easyReturns"), desc: t("easyReturnsDesc") },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PromoBar />
      <SiteHeader />
      <CartDrawer />

      <main className="flex-1">
        {/* Trust strip */}
        <div className="border-b border-border bg-secondary/60 px-4 py-2 text-center text-xs font-medium text-secondary-foreground">
          {t("trustStrip")}
        </div>

        {/* Trust badges */}
        <section className="border-b border-border bg-card">
          <div className="mx-auto flex max-w-7xl items-center justify-center gap-6 px-4 py-3 sm:gap-10">
            {trustBadges.map((badge) => {
              const Icon = badge.icon
              return (
                <div key={badge.label} className="flex items-center gap-2">
                  <Icon className="h-5 w-5 flex-shrink-0 text-primary" />
                  <div className="hidden sm:block">
                    <p className="text-xs font-semibold text-foreground">
                      {badge.label}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {badge.desc}
                    </p>
                  </div>
                  <span className="text-xs font-medium text-foreground sm:hidden">
                    {badge.label}
                  </span>
                </div>
              )
            })}
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-6">
          {/* Hero Banner */}
          <HeroBanner />

          {/* Quick Categories */}
          <section className="mt-8">
            <h2 className="mb-4 text-lg font-semibold text-foreground">
              {t("shopByCategory")}
            </h2>
            <CategoryCards />
          </section>

          {/* Main content: sidebar + products */}
          <section className="mt-8 flex gap-6">
            <CategorySidebar />

            <div className="flex-1">
              {/* Section header */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-accent" />
                  <h2 className="text-lg font-semibold text-foreground">
                    {t("trendingProducts")}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    className="h-8 rounded-lg border border-border bg-card px-3 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    aria-label={t("sortLabel")}
                  >
                    <option>{t("sortBestSelling")}</option>
                    <option>{t("sortLowHigh")}</option>
                    <option>{t("sortHighLow")}</option>
                    <option>{t("sortTopRated")}</option>
                    <option>{t("sortNewest")}</option>
                  </select>
                </div>
              </div>

              {/* Product Grid — max 8, 4 per row desktop, 2 per row mobile */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
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
          <section className="mt-12 mb-8 rounded-xl bg-primary px-6 py-8 sm:px-10">
            <div className="flex flex-col items-center text-center">
              <h2 className="text-xl font-bold text-primary-foreground sm:text-2xl">
                {t("joinNewsletter")}
              </h2>
              <p className="mt-2 max-w-md text-sm text-primary-foreground/80">
                {t("newsletterDesc")}
              </p>
              <div className="mt-4 flex w-full max-w-md gap-2">
                <input
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  className="h-10 flex-1 rounded-full bg-primary-foreground px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-foreground/50"
                />
                <button className="rounded-full bg-accent px-6 py-2 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90">
                  {t("subscribe")}
                </button>
              </div>
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
