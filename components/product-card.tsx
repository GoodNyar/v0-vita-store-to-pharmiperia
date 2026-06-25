"use client"

import { memo } from "react"
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

function ProductCardComponent({ product }: { product: Product }) {
  const router = useRouter()
  const { addToCart } = useCart()
  const { t, lang } = useLang()
  const { isFavorited, toggleFavorite } = useFavorites()

  const productHref = `/products/${product.id}`
  const brandHref = `/brand/${getBrandSlug(product.brand)}`
  const isFav = isFavorited(product.id)

  // Localized subtitle — fall back to the product's raw description
  const productDesc =
    productDescriptions[product.id as keyof typeof productDescriptions]?.[lang as "lv" | "ru"] ||
    product.description

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
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-border/60 shadow-[0_2px_12px_rgba(0,0,0,0.05)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(0,0,0,0.13)]">
      {/* 1. Image area */}
      <a href={productHref} className="relative block bg-[#f4f5f6]" tabIndex={0} aria-label={product.name}>
        {/* Discount badge — top left (soft, accurate) */}
        {hasDiscount && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
            {"−"}
            {discountPercent}%
          </span>
        )}

        {/* Wishlist heart — top right */}
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            toggleFavorite(product.id)
          }}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm transition-all hover:scale-110 hover:bg-white"
          aria-label={t("myFavorites")}
          aria-pressed={isFav}
        >
          <Heart
            className={`h-[18px] w-[18px] transition-colors ${
              isFav ? "fill-red-500 text-red-500" : "text-gray-400"
            }`}
          />
        </button>

        <div className="relative w-full" style={{ paddingBottom: "100%" }}>
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      </a>

      {/* Info */}
      <div className="flex flex-1 flex-col px-4 pb-4 pt-4">
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
          className="mt-1 line-clamp-2 text-lg font-bold leading-snug text-foreground transition-colors hover:text-primary"
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
              <span
                key={tag}
                className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground"
              >
                {t(tag as never)}
              </span>
            ))}
            {extraTags > 0 && (
              <span className="rounded-full bg-secondary px-2 py-1 text-xs font-medium text-muted-foreground">
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

        {/* 7. Price + original + savings */}
        <div className="mt-3 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
          <span className="text-2xl font-bold tracking-tight text-foreground">
            {formatEur(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              {formatEur(product.originalPrice as number)}
            </span>
          )}
        </div>
        {hasDiscount && (
          <span className="mt-2 w-fit rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
            {t("savings")} {formatEur(savings)}
          </span>
        )}

        {/* 8. Free shipping trigger */}
        <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Truck className="h-4 w-4 flex-shrink-0 text-primary" />
          <span>
            <span className="font-medium text-foreground">{t("freeShipping")}</span> {t("freeShippingFrom")}
          </span>
        </div>

        {/* 9. Active ingredient education block */}
        {product.activeIngredient && (
          <a
            href={productHref}
            className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:border-primary/40 hover:bg-secondary/40"
          >
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Leaf className="h-[18px] w-[18px]" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-foreground">
                {t(product.activeIngredient.name as never)}
              </span>
              <span className="mt-0.5 line-clamp-2 block text-xs leading-relaxed text-muted-foreground">
                {t(product.activeIngredient.shortDescription as never)}
              </span>
            </span>
            <ChevronRight className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
          </a>
        )}

        {/* 10. Add to cart + quick view */}
        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => addToCart(product)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:bg-primary/80"
          >
            <ShoppingBag className="h-[18px] w-[18px]" />
            {t("addToCart")}
          </button>
          <button
            type="button"
            onClick={() => router.push(productHref)}
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-border text-foreground transition-colors hover:border-primary/40 hover:text-primary"
            aria-label={t("quickView")}
            title={t("quickView")}
          >
            <Eye className="h-[18px] w-[18px]" />
          </button>
        </div>

        {/* 11. Trust badges */}
        <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
          <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            <span className="hidden sm:inline">{t("trustOriginalBrands")}</span>
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Gift className="h-3.5 w-3.5 text-primary" />
            <span className="hidden sm:inline">{t("trustLoyaltyBonuses")}</span>
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <CreditCard className="h-3.5 w-3.5 text-primary" />
            <span className="hidden sm:inline">{t("trustSecurePayment")}</span>
          </span>
        </div>
      </div>
    </div>
  )
}

export const ProductCard = memo(ProductCardComponent)
