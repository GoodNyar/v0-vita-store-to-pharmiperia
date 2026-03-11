"use client"

import Image from "next/image"
import { Star, ShoppingCart } from "lucide-react"
import type { Product } from "@/lib/data"
import { useCart } from "@/components/cart-context"
import { useLang, formatEur } from "@/lib/i18n"
import { useState } from "react"

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart()
  const { t } = useLang()
  const [isPressed, setIsPressed] = useState(false)

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : null

  const productHref = `/products/${product.id}`

  return (
    <div 
      className={`group relative flex flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
        isPressed ? "translate-y-1" : ""
      }`}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
    >
      {/* Badge */}
      {product.badge && (
        <span className="absolute left-3 top-3 z-10 rounded-full bg-accent px-3 py-1 text-xs font-bold text-white">
          {product.badge === "discount" && discount
            ? `−${discount}%`
            : t(product.badge as Parameters<typeof t>[0])}
        </span>
      )}

      {/* Full-card clickable link */}
      <a href={productHref} className="flex flex-1 flex-col">
        {/* Image */}
        <div className="overflow-hidden bg-muted">
          <div className="relative w-full" style={{ paddingBottom: "100%" }}>
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-3 sm:p-4">
          {/* Brand + Name — without volume */}
          <p className="text-xs font-semibold text-muted-foreground">
            {product.brand}
          </p>
          <p className="mt-1 line-clamp-2 text-sm font-medium text-foreground transition-colors group-hover:text-primary">
            {product.name}
          </p>

          {/* Short Description */}
          <p className="mt-2 line-clamp-1 text-xs text-muted-foreground">
            {product.description}
          </p>

          {/* Rating */}
          <div className="mt-3 flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(product.rating)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-gray-300 text-gray-300"
                  }`}
                  strokeWidth={2}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({product.reviewCount})
            </span>
          </div>

          {/* Price */}
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-lg font-bold text-foreground">
              {formatEur(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {formatEur(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </a>

      {/* Add to Cart Button — outside the link */}
      <div className="px-3 pb-3 sm:px-4 sm:pb-4">
        <button
          onClick={() => addToCart(product)}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent/90 active:bg-accent/80"
        >
          <ShoppingCart className="h-4 w-4" />
          {t("addToCart")}
        </button>
      </div>

      {/* Footer — SKU | Volume */}
      <div className="border-t border-border bg-gray-50 px-3 py-2 sm:px-4 text-xs text-muted-foreground text-center">
        #{product.sku} | {product.volume}
      </div>
    </div>
  )
}
