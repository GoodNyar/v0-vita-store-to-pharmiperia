"use client"

import Image from "next/image"
import { Star, ShoppingCart, Heart } from "lucide-react"
import type { Product } from "@/lib/data"
import { useCart } from "@/components/cart-context"
import { useState } from "react"

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart()
  const [isWished, setIsWished] = useState(false)

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : null

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-lg">
      {/* Badge */}
      {product.badge && (
        <span className="absolute left-2.5 top-2.5 z-10 rounded-md bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground">
          {product.badge}
        </span>
      )}

      {/* Wishlist */}
      <button
        onClick={() => setIsWished(!isWished)}
        className="absolute right-2.5 top-2.5 z-10 rounded-full bg-card/80 p-1.5 text-muted-foreground opacity-0 shadow-sm backdrop-blur-sm transition-all hover:text-destructive group-hover:opacity-100"
        aria-label="Add to wishlist"
      >
        <Heart
          className={`h-4 w-4 ${isWished ? "fill-destructive text-destructive" : ""}`}
        />
      </button>

      {/* Image */}
      <a href="#" className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </a>

      {/* Content */}
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <p className="text-xs text-muted-foreground">{product.brand}</p>
        <a
          href="#"
          className="mt-0.5 line-clamp-2 text-sm font-medium text-card-foreground transition-colors hover:text-primary"
        >
          {product.name}
        </a>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < Math.floor(product.rating)
                    ? "fill-accent text-accent"
                    : "fill-muted text-muted"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            ({product.reviewCount.toLocaleString()})
          </span>
        </div>

        {/* Price */}
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-card-foreground">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
          {discount && (
            <span className="rounded bg-destructive/10 px-1.5 py-0.5 text-xs font-semibold text-destructive">
              -{discount}%
            </span>
          )}
        </div>

        {/* Add to Cart */}
        <button
          onClick={() => addToCart(product)}
          className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </button>
      </div>
    </div>
  )
}
