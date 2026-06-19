"use client"

import { lazy, Suspense } from "react"
import { SiteHeader } from "@/components/site-header"
import { HeroBanner } from "@/components/hero-banner"
import { CategoryCards } from "@/components/category-cards"
import { ProductCard } from "@/components/product-card"
import { ProductFilters } from "@/components/product-filters"
import { CartDrawer } from "@/components/cart-drawer"
import { useCart } from "@/components/cart-context"
import { SiteFooter } from "@/components/site-footer"
import { Skeleton } from "@/components/loading-skeleton"
import { useLang, formatEur } from "@/lib/i18n"
import { products } from "@/lib/data"
import { Truck, Shield, RotateCcw, Flame, Leaf } from "lucide-react"

// Lazy load components below the fold
const PromoCards = lazy(() => import("@/components/promo-cards").then(m => ({ default: m.PromoCards })))
const WhyBuyUs = lazy(() => import("@/components/why-buy-us").then(m => ({ default: m.WhyBuyUs })))
const AIRecommendations = lazy(() => import("@/components/ai-recommendations").then(m => ({ default: m.AIRecommendations })))
const LiveChat = lazy(() => import("@/components/live-chat").then(m => ({ default: m.LiveChat })))

function PromoSkeleton() {
  return (
    <div className="mt-10">
      <Skeleton className="h-8 w-32 mb-4" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-56 rounded-xl" />
        ))}
      </div>
    </div>
  )
}

function WhyBuyUsSkeleton() {
  return (
    <div className="mt-12">
      <Skeleton className="h-8 w-48 mb-6" />
      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-lg" />
        ))}
      </div>
    </div>
  )
}

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

          {/* Divider — full catalog */}
          <div className="mt-10 flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs uppercase tracking-widest text-muted-foreground">
              {t("fullCatalog")}
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Main content: full-width products */}
          <section className="mt-8">
            <div>
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

          {/* Lazy loaded components */}
          <Suspense fallback={<PromoSkeleton />}>
            <PromoCards />
          </Suspense>

          <Suspense fallback={<WhyBuyUsSkeleton />}>
            <WhyBuyUs />
          </Suspense>

          {/* Newsletter */}
          <section className="mt-12 mb-8 rounded-xl bg-primary px-4 py-4 sm:px-6 sm:py-3.5">
            <div className="flex flex-col items-center text-center">
              <p className="text-[10px] uppercase tracking-widest text-primary-foreground/60">
                Pharmiperia
              </p>
              <h2 className="mt-1 text-base font-bold text-primary-foreground sm:text-lg">
                {t("joinNewsletter")}
              </h2>
              <p className="mt-1 max-w-md text-xs text-primary-foreground/85 sm:text-xs">
                {t("newsletterDesc")}
              </p>
              <form className="mt-3 flex w-full flex-col gap-2.5 sm:max-w-md sm:flex-row sm:gap-2">
                <input
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  className="h-10 w-full flex-1 rounded-full border border-white/20 bg-white/15 px-4 text-sm text-primary-foreground placeholder:text-primary-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary-foreground/50"
                  required
                />
                <button
                  type="submit"
                  className="h-10 w-full rounded-full bg-white px-6 text-sm font-bold text-primary transition-colors hover:bg-white/90 sm:w-auto"
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

      <Suspense fallback={null}>
        <AIRecommendations />
      </Suspense>

      <Suspense fallback={null}>
        <LiveChat />
      </Suspense>

      <SiteFooter />
    </div>
  )
}

export default function HomePage() {
  return <HomeContent />
}
