"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { X, Star, Minus, Plus, Heart, ShoppingCart, ExternalLink } from "lucide-react"
import { useCart } from "@/components/cart-context"
import { useFavorites } from "@/components/favorites-provider"
import { useLang, formatEur } from "@/lib/i18n"
import type { Product } from "@/lib/data"

interface QuickViewModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const { t } = useLang()
  const { addToCart } = useCart()
  const { isFavorited, toggleFavorite } = useFavorites()
  const [quantity, setQuantity] = useState(1)

  // Reset quantity when product changes
  useEffect(() => {
    setQuantity(1)
  }, [product?.id])

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [isOpen, onClose])

  if (!isOpen || !product) return null

  const isFav = isFavorited(product.id)

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative z-10 w-full max-w-3xl rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 shadow-md transition-colors hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid md:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-square bg-gray-50 p-8">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain"
            />
            
            {/* Badges */}
            <div className="absolute left-4 top-4 flex flex-col gap-2">
              {product.originalPrice && (
                <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white">
                  -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                </span>
              )}
              {product.isNew && (
                <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  {t("new")}
                </span>
              )}
            </div>

            {/* Favorite button */}
            <button
              onClick={() => toggleFavorite(product.id)}
              className="absolute right-4 top-4 rounded-full bg-white/90 p-2 shadow-md transition-all hover:bg-white hover:scale-110"
            >
              <Heart
                className={`h-5 w-5 transition-colors ${
                  isFav ? "fill-red-500 text-red-500" : "text-gray-400"
                }`}
              />
            </button>
          </div>

          {/* Info */}
          <div className="flex flex-col p-6">
            <div className="text-sm text-muted-foreground">{product.brand}</div>
            <h2 className="mt-1 text-xl font-bold text-foreground">{product.name}</h2>
            
            {/* Rating */}
            <div className="mt-2 flex items-center gap-2">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviewCount.toLocaleString()})
              </span>
            </div>

            {/* Volume */}
            <div className="mt-3 text-sm text-muted-foreground">
              {product.volume}
            </div>

            {/* Description */}
            <p className="mt-4 text-sm text-muted-foreground line-clamp-3">
              {product.description}
            </p>

            {/* Price */}
            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-primary">
                {formatEur(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatEur(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Stock */}
            <div className={`mt-2 text-sm ${product.inStock ? "text-green-600" : "text-red-500"}`}>
              {product.inStock ? t("inStock") : t("outOfStock")}
            </div>

            {/* Quantity + Add to cart */}
            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center rounded-lg border border-border">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex h-10 w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex h-10 w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:bg-primary/80 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingCart className="h-4 w-4" />
                {t("addToCart")}
              </button>
            </div>

            {/* View full page link */}
            <Link
              href={`/products/${product.id}`}
              className="mt-4 flex items-center justify-center gap-2 text-sm text-primary hover:underline"
              onClick={onClose}
            >
              {t("viewDetails")}
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
