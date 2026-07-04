"use client"

import { memo, useRef } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  Star,
  Heart,
  ShoppingBag,
  Eye,
  Truck,
  Leaf,
  ChevronRight,
  ShieldCheck,
  Gift,
  CreditCard,
} from "lucide-react"
import { getBrandSlug, type Product } from "@/lib/data"
import { useCart } from "@/components/cart-context"
import { useLang, formatEur, productDescriptions } from "@/lib/i18n"
import { useFavorites } from "@/components/favorites-provider"
import { cn } from "@/lib/utils"
import { useQuickView } from "@/components/quick-view-provider"
import { QuickViewPanel } from "@/components/quick-view-panel"

const GREEN_PILL =
  "rounded-full border border-green-200 bg-green-50 font-medium text-green-700"

function ProductCardComponent({ product }: { product: Product }) {
  const router = useRouter()
  const { addToCart } = useCart()
  const { t, lang } = useLang()
  const { isFavorited, toggleFavorite } = useFavorites()
  const {
    isOpen,
    activeProductId,
    isPinned,
    scheduleOpen,
    cancelOpen,
    scheduleClose,
    cancelClose,
    openQuickView,
    closeQuickView,
  } = useQuickView()
  const cardRef = useRef<HTMLDivElement>(null)
  const quickViewAnchorRef = useRef<HTMLButtonElement>(null)
  const isQuickViewActive = isOpen && activeProductId === product.id

  const productHref = `/products/${product.id}`

  const canHoverOpenQuickView = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(min-width: 1024px) and (hover: hover)").matches

  const handleQuickViewHoverEnter = () => {
    if (!canHoverOpenQuickView()) return
    cancelClose()
    scheduleOpen(product)
  }

  const handleQuickViewHoverLeave = () => {
    if (!canHoverOpenQuickView()) return
    cancelOpen()
    scheduleClose()
  }
  const brandHref = `/brand/${getBrandSlug(product.brand)}`
  const isFav = isFavorited(product.id)

  // Localized subtitle — fall back to the product's raw description
  const productDesc =
    productDescriptions[String(product.id) as keyof typeof productDescriptions]?.[
      lang as "lv" | "ru"
    ] || product.description

  // Pricing / savings
  const hasDiscount = !!product.originalPrice && product.originalPrice > product.price
  const discountPercent = hasDiscount
    ? Math.round((1 - product.price / (product.originalPrice as number)) * 100)
    : 0
  const savings = hasDiscount ? (product.originalPrice as number) - product.price : 0

  // Tags (cap to 2 visible pills + overflow indicator)
  const tags = product.tags ?? []
  const visibleTags = tags.slice(0, 2)
  const extraTags = tags.length - visibleTags.length

  return (
    <div
      ref={cardRef}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-border/60 shadow-[0_2px_12px_rgba(0,0,0,0.05)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(0,0,0,0.13)]"
    >
      {/* 1. Image */}
      <div className="relative w-full shrink-0">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          width={800}
          height={800}
          className="block h-auto w-full"
          loading="lazy"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        <a
          href={productHref}
          className="absolute inset-0 z-[1]"
          tabIndex={0}
          aria-label={product.name}
        />

        {hasDiscount && (
          <span
            className={cn(
              "pointer-events-none absolute left-2.5 top-2.5 z-20 px-2.5 py-1 text-xs font-semibold shadow-sm",
              GREEN_PILL
            )}
          >
            −{discountPercent}%
          </span>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            toggleFavorite(product.id)
          }}
          className="absolute right-2.5 top-2.5 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-all hover:scale-110 hover:bg-white"
          aria-label={t("myFavorites")}
          aria-pressed={isFav}
        >
          <Heart
            className={`h-[18px] w-[18px] transition-colors ${
              isFav ? "fill-red-500 text-red-500" : "text-gray-400"
            }`}
          />
        </button>
      </div>

      {/* Info — small gap so hover scale doesn't cover brand */}
      <div className="flex flex-1 flex-col px-4 pb-4 pt-2">
        <div className="flex flex-1 flex-col">
        {/* 2. Brand — small uppercase, navigates to brand page */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            router.push(brandHref)
          }}
          className="w-fit text-[11px] font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
        >
          {product.brand}
        </button>

        {/* 3. Product name — large bold title */}
        <a
          href={productHref}
          className="mt-1 line-clamp-2 text-base font-bold leading-snug text-foreground transition-colors hover:text-primary"
        >
          {product.name}
        </a>

        {/* 4. Short subtitle description — 1 line */}
        {productDesc && (
          <p className="mt-1.5 line-clamp-1 text-sm leading-relaxed text-muted-foreground">
            {productDesc}
          </p>
        )}

        {/* 5. Skin type + benefit tags */}
        {visibleTags.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {visibleTags.map((tag) => (
              <span key={tag} className={cn("px-2.5 py-1 text-xs", GREEN_PILL)}>
                {t(tag as never)}
              </span>
            ))}
            {extraTags > 0 && (
              <span className={cn("px-2 py-1 text-xs text-green-600", GREEN_PILL)}>
                +{extraTags}
              </span>
            )}
          </div>
        )}

        {/* 6. Rating + reviews + volume */}
        <div className="mt-3 flex items-center gap-2.5 text-sm">
          <span className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" strokeWidth={0} />
            <span className="font-semibold text-foreground">{product.rating}</span>
          </span>
          <span className="text-muted-foreground">
            {"·"} {product.reviewCount.toLocaleString(lang === "lv" ? "lv" : "ru")} {t("reviewsShort")}
          </span>
          {product.volume && (
            <>
              <span className="h-3.5 w-px bg-border" aria-hidden="true" />
              <span className="text-muted-foreground">{product.volume}</span>
            </>
          )}
        </div>

        {/* 7. Price + shipping + savings */}
        <div className="mt-3 flex w-full items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-foreground">
              {formatEur(product.price)}
            </span>
            <span
              className={cn(
                "text-sm line-through text-muted-foreground",
                !hasDiscount && "invisible"
              )}
              aria-hidden={!hasDiscount}
            >
              {formatEur(hasDiscount ? (product.originalPrice as number) : product.price)}
            </span>
          </div>
          <span className="flex shrink-0 items-start gap-1 text-xs text-muted-foreground">
            <Truck className="mt-0.5 h-3 w-3 shrink-0 text-green-600" strokeWidth={1.75} />
            <span>
              {t("freeShippingLine1")}
              <br />
              {t("freeShippingLine2")}
            </span>
          </span>
        </div>
        <div className="mt-1">
          <span
            className={cn(
              "text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full",
              !hasDiscount && "invisible"
            )}
            aria-hidden={!hasDiscount}
          >
            {t("savings")} {formatEur(hasDiscount ? savings : 0)}
          </span>
        </div>
        </div>

        {/* 9. Active ingredient — pinned below flex-grow content */}
        {product.activeIngredient && (
          <a
            href={productHref}
            className="mt-3 box-border flex h-[88px] w-full max-w-none items-center gap-2.5 rounded-xl bg-[#f5f5f5] p-3 transition-colors hover:bg-[#efefef]"
          >
            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white text-primary">
              <Leaf className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <span className="min-w-0 flex-1 overflow-hidden">
              <span className="block truncate text-sm font-bold text-foreground">
                {t(product.activeIngredient.name as never)}
              </span>
              <span className="mt-0.5 line-clamp-2 block overflow-hidden text-xs leading-relaxed text-muted-foreground">
                {t(product.activeIngredient.shortDescription as never)}
              </span>
            </span>
            <ChevronRight className="h-4 w-4 flex-shrink-0 text-muted-foreground/60" strokeWidth={1.75} />
          </a>
        )}

        {/* 10. Add to cart + quick view — pinned below growing content */}
        <div className="mt-4 flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => addToCart(product)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:bg-primary/80"
          >
            <ShoppingBag className="h-[18px] w-[18px]" />
            {t("addToCart")}
          </button>
          <button
            ref={quickViewAnchorRef}
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              openQuickView(product, { pinned: true })
            }}
            onMouseEnter={handleQuickViewHoverEnter}
            onMouseLeave={handleQuickViewHoverLeave}
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-border text-foreground transition-colors hover:border-primary/40 hover:text-primary"
            aria-label={t("quickView")}
            title={t("quickView")}
          >
            <Eye className="h-[18px] w-[18px]" />
          </button>
        </div>

        {/* 11. Trust badges — full text, no truncation */}
        <div className="mt-4 grid shrink-0 grid-cols-3 gap-1 border-t border-border pt-3">
          {(
            [
              { icon: ShieldCheck, label: t("trustOriginalBrands") },
              { icon: Gift, label: t("trustLoyaltyBonuses") },
              { icon: CreditCard, label: t("trustSecurePayment") },
            ] as const
          ).map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center justify-center gap-1 px-0.5 text-center"
            >
              <Icon className="h-3.5 w-3.5 text-primary" strokeWidth={1.75} />
              <span className="text-xs leading-tight text-muted-foreground">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {isQuickViewActive && (
        <QuickViewPanel
          product={product}
          anchorRef={quickViewAnchorRef}
          cardRef={cardRef}
          isPinned={isPinned}
          onClose={closeQuickView}
          onMouseEnterPanel={cancelClose}
          onMouseLeavePanel={scheduleClose}
        />
      )}
    </div>
  )
}

export const ProductCard = memo(ProductCardComponent)
