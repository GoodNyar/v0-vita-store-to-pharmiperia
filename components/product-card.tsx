"use client"

import Image from "next/image"
import { Star } from "lucide-react"
import type { Product } from "@/lib/data"
import { useCart } from "@/components/cart-context"
import { useLang, formatEur } from "@/lib/i18n"
import { useState } from "react"

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart()
  const { t } = useLang()
  const [isPressed, setIsPressed] = useState(false)

  const productHref = `/products/${product.id}`

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-2xl bg-white transition-all duration-200
        shadow-[0_2px_12px_rgba(0,0,0,0.10)]
        hover:-translate-y-1 hover:shadow-[0_6px_20px_rgba(0,0,0,0.14)]
        ${isPressed ? "translate-y-0.5 shadow-[0_1px_6px_rgba(0,0,0,0.08)]" : ""}
      `}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
    >
      {/* Entire card is clickable except the cart button */}
      <a href={productHref} className="flex flex-1 flex-col" tabIndex={0}>

        {/* Image area — light gray bg like reference */}
        <div className="relative overflow-hidden bg-[#f2f3f5]">
          <div className="relative w-full" style={{ paddingBottom: "90%" }}>
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain object-center p-4 transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>

        {/* Text content */}
        <div className="flex flex-1 flex-col px-3 pt-3 pb-2 sm:px-4 sm:pt-4 sm:pb-3">

          {/* Product name — bold, dark navy, 2 lines max */}
          <p className="line-clamp-2 text-sm font-bold leading-snug text-foreground group-hover:text-primary sm:text-base">
            {product.name}
          </p>

          {/* Short description — 1 line, gray */}
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
          <div className="my-2.5 border-t border-border" />

          {/* SKU | Volume */}
          <p className="text-xs text-muted-foreground">
            #{product.sku}&nbsp;&nbsp;|&nbsp;&nbsp;{product.volume}
          </p>

          {/* Divider */}
          <div className="my-2.5 border-t border-border" />

          {/* Price + Add to cart on same row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-foreground">
                {formatEur(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatEur(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Cart button — pill shape, green (primary), stops link propagation */}
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                addToCart(product)
              }}
              className="flex-shrink-0 rounded-full bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:bg-primary/80 sm:px-4 sm:text-sm"
            >
              {t("addToCart")}
            </button>
          </div>

        </div>
      </a>
    </div>
  )
}
