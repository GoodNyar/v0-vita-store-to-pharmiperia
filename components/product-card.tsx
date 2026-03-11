"use client"

import Image from "next/image"
import { Star, ShoppingCart, Heart } from "lucide-react"
import type { Product } from "@/lib/data"
import { useCart } from "@/components/cart-context"
import { useLang, formatEur } from "@/lib/i18n"
import { useState } from "react"

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart()
  const { t } = useLang()
  const [isWished, setIsWished] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : null

  const productHref = `/products/${product.id}`

  return (
    <div 
      className={`group relative flex flex-col overflow-hidden rounded-lg border border-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
        isPressed ? "translate-y-1" : ""
      }`}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
    >
      {/* Badge */}
      {product.badge && (
        <span className="absolute left-3 top-3 z-10 rounded-md bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
          {product.badge === "discount" && discount
            ? `−${discount}%`
            : t(product.badge as Parameters<typeof t>[0])}
        </span>
      )}

      {/* Wishlist — stop propagation so clicking it doesn't navigate */}
      <button
        onClick={(e) => { 
          e.preventDefault()
          e.stopPropagation()
          setIsWished(!isWished) 
        }}
        className="absolute right-3 top-3 z-10 rounded-full bg-white p-1.5 text-muted-foreground opacity-0 shadow-sm transition-all group-hover:opacity-100 hover:text-destructive"
        aria-label="Add to wishlist"
      >
        <Heart
          className={`h-4 w-4 ${isWished ? "fill-destructive text-destructive" : ""}`}
        />
      </button>

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
          {/* Product SKU */}
          <p className="text-xs text-muted-foreground">#{product.sku}</p>

          {/* Brand + Name */}
          <p className="mt-2 text-xs font-semibold text-muted-foreground">
            {product.brand}
          </p>
          <p className="mt-0.5 line-clamp-2 text-sm font-medium text-card-foreground transition-colors group-hover:text-primary">
            {product.name}
          </p>

          {/* Volume */}
          <p className="mt-1 text-xs text-muted-foreground">
            {product.volume}
          </p>

          {/* Short Description */}
          <p className="mt-1.5 line-clamp-1 text-xs text-muted-foreground">
            {product.description}
          </p>

          {/* Rating */}
          <div className="mt-2 flex items-center gap-1">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(product.rating)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-muted text-muted"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({product.reviewCount.toLocaleString("en-US")})
            </span>
          </div>

          {/* Price */}
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-lg font-bold text-card-foreground">
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

      {/* Add to Cart Button — outside the link to avoid nested interactive elements */}
      <div className="px-3 pb-3 sm:px-4 sm:pb-4">
        <button
          onClick={(e) => {
            e.preventDefault()
            addToCart(product)
          }}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 active:bg-primary/80"
        >
          <ShoppingCart className="h-4 w-4" />
          {t("addToCart")}
        </button>
      </div>
    </div>
  )
}
