"use client"

import Image from "next/image"
import { Star } from "lucide-react"
import type { Product } from "@/lib/data"
import { useCart } from "@/components/cart-context"
import { useLang, formatEur } from "@/lib/i18n"

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart()
  const { t } = useLang()

  const productHref = `/products/${product.id}`

  return (
    <div
      className="group relative flex flex-col cursor-pointer rounded-2xl bg-white shadow-[0_6px_20px_rgba(0,0,0,0.14)] transition-all duration-200 active:translate-y-1 active:shadow-[0_3px_12px_rgba(0,0,0,0.10)]"
    >
      {/* Clickable area — image + info (excludes the cart button row) */}
      <a href={productHref} className="flex flex-col" tabIndex={0}>

        {/* Image area */}
        <div className="relative overflow-hidden rounded-t-2xl bg-[#f2f3f5]">
          <div className="relative w-full" style={{ paddingBottom: "90%" }}>
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain object-center p-4"
            />
          </div>
        </div>

        {/* Text content */}
        <div className="flex flex-col px-3 pt-3 sm:px-4 sm:pt-4">

          {/* Product name — bold, 2 lines max */}
          <p className="line-clamp-2 text-sm font-bold leading-snug text-foreground sm:text-base">
            {product.name}
          </p>

          {/* Short description — 1 line */}
          <p className="mt-1.5 line-clamp-1 text-xs leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          {/* Star rating */}
          <div className="mt-2 flex items-center gap-1">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(product.rating)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-gray-300 text-gray-300"
                  }`}
                  strokeWidth={0}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({product.reviewCount})
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
          className="flex-shrink-0 rounded-full bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:bg-primary/80 sm:px-4"
        >
          {t("addToCart")}
        </button>
      </div>
    </div>
  )
}
