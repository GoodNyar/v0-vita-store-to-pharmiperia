"use client"

import { memo } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Star, Heart, ShoppingCart } from "lucide-react"
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

  // Get localized description — fall back to product.description if not found
  const productDesc =
    productDescriptions[product.id as keyof typeof productDescriptions]?.[lang as "lv" | "ru"] ||
    product.description

  // Calculate discount percentage if there's an original price
  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : 0

  return (
    <div className="group relative flex flex-col cursor-pointer rounded-2xl bg-white ring-1 ring-border/60 shadow-[0_2px_12px_rgba(0,0,0,0.05)] transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.015] hover:ring-primary/30 hover:shadow-[0_18px_44px_rgba(0,0,0,0.13)] active:translate-y-0.5">
      {/* Favorite button */}
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          toggleFavorite(product.id)
        }}
        className="absolute right-2 top-2 z-10 rounded-full bg-white/90 p-2 shadow-md transition-all hover:bg-white hover:scale-110"
        aria-label="Add to favorites"
      >
        <Heart
          className={`h-5 w-5 transition-colors ${
            isFav ? "fill-red-500 text-red-500" : "text-gray-400"
          }`}
        />
      </button>

      {/* Clickable area — image + info (excludes the cart button row) */}
      <a href={productHref} className="flex flex-col" tabIndex={0}>
        {/* Image area */}
        <div className="relative overflow-hidden rounded-t-2xl bg-[#f2f3f5]">
          {/* Badge overlay — top left */}
          {product.badge && (
            <span className="absolute left-2 top-2 z-10 rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground shadow-sm">
              {t(product.badge as never)}
            </span>
          )}

          <div className="relative w-full" style={{ paddingBottom: "90%" }}>
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain object-center p-4 transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>

          {/* Discount pill — bottom left */}
          {discountPercent > 0 && (
            <span className="absolute bottom-2 left-2 z-10 rounded-full bg-red-500 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
              {"−"}
              {discountPercent}%
            </span>
          )}
        </div>

        {/* Text content */}
        <div className="flex flex-col px-3 pt-3 sm:px-4 sm:pt-4">
          {/* Brand name — clickable, navigates to the brand page */}
          <span
            role="link"
            tabIndex={0}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              router.push(brandHref)
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                e.stopPropagation()
                router.push(brandHref)
              }
            }}
            className="inline-block w-fit text-[10px] font-semibold uppercase tracking-widest text-primary/70 transition-colors hover:text-primary hover:underline"
          >
            {product.brand}
          </span>

          {/* Product name — bold, 2 lines max */}
          <p className="mt-1 line-clamp-2 text-sm font-bold leading-snug text-foreground sm:text-base">
            {product.name}
          </p>

          {/* Short description — 1 line */}
          <p className="mt-1.5 line-clamp-1 text-xs leading-relaxed text-muted-foreground">
            {productDesc}
          </p>

          {/* Star rating */}
          <div className="mt-2 flex items-center gap-1.5">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" strokeWidth={0} />
            <span className="text-xs font-medium text-foreground">
              {product.rating} · {product.reviewCount.toLocaleString("ru")}
            </span>
          </div>

          {/* Divider */}
          <div className="mt-2.5 border-t border-border" />

          {/* SKU | Volume */}
          <p className="py-2 text-xs text-muted-foreground">
            #{product.sku}&nbsp;&nbsp;|&nbsp;&nbsp;{product.volume}
          </p>

          {/* Divider */}
          <div className="border-t border-border" />
        </div>
      </a>

      {/* Price + Cart button — outside <a> to prevent nesting interactive elements */}
      <div className="flex items-center justify-between gap-2 px-3 pb-3 pt-2.5 sm:px-4 sm:pb-4">
        <div className="flex min-w-0 flex-col">
          <span className="text-base font-bold text-foreground sm:text-lg">
            {formatEur(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {formatEur(product.originalPrice)}
            </span>
          )}
        </div>

        <button
          onClick={() => addToCart(product)}
          className="flex flex-shrink-0 items-center gap-1.5 rounded-full bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:bg-primary/80 sm:px-4"
        >
          <ShoppingCart className="h-4 w-4" />
          {t("addToCart")}
        </button>
      </div>
    </div>
  )
}

export const ProductCard = memo(ProductCardComponent)
