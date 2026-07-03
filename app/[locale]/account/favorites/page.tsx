"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useLang, formatMoney } from "@/lib/i18n"
import { useCart } from "@/components/cart-context"
import { useAuth } from "@/components/auth-provider"
import { useFavorites } from "@/components/favorites-provider"
import { products as allProducts, getProductSlug, type Product } from "@/lib/data"
import { Heart, Star, Loader2, ChevronLeft, Trash2, ShoppingCart, LogIn } from "lucide-react"

export default function FavoritesPage() {
  const { t, localizedPath } = useLang()
  const { addToCart } = useCart()
  const { user } = useAuth()
  const { favorites, isLoading, toggleFavorite } = useFavorites()
  const [products, setProducts] = useState<Product[]>([])

  // Get product details from local data.ts
  useEffect(() => {
    if (isLoading) return
    if (favorites.length === 0) {
      setProducts([])
      return
    }

    // Filter products from lib/data.ts by favorited IDs
    const favoriteProducts = allProducts.filter(p => favorites.includes(p.id))
    setProducts(favoriteProducts)
  }, [favorites, isLoading])

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-10">
      <Link
        href="/account"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        {t("backHome")}
      </Link>

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            {t("wishlist")}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {products.length > 0
              ? `${products.length} ${products.length === 1 ? (t("product")) : products.length < 5 ? (t("products")) : (t("productsLabel"))}`
              : t("noFavorites")}
          </p>
        </div>
      </div>

      {/* Banner for guests */}
      {!user && favorites.length > 0 && (
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-primary/20 bg-primary/5 px-5 py-4">
          <div>
            <p className="text-sm font-semibold text-foreground">
              {t("loginToSaveFavorites")}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("favoritesLocalSync")}
            </p>
          </div>
          <Link
            href="/auth/login"
            className="flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <LogIn className="h-4 w-4" />
            {t("signIn")}
          </Link>
        </div>
      )}

      {/* Empty state */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-card py-16">
          <Heart className="h-16 w-16 text-muted-foreground/20" />
          <h2 className="mt-4 text-lg font-semibold text-foreground">
            {t("noFavorites")}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground text-center px-4">
            {t("noFavoritesText")}
          </p>
          <Link
            href="/"
            className="mt-6 rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t("continueShopping")}
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_6px_20px_rgba(0,0,0,0.10)] transition-all duration-200 hover:shadow-[0_8px_28px_rgba(0,0,0,0.16)]"
            >
              {/* Image */}
              <Link href={localizedPath(`/products/${getProductSlug(product)}`)} className="relative block overflow-hidden bg-[#f2f3f5]">
                <div className="relative w-full" style={{ paddingBottom: "100%" }}>
                  {product.image && (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain object-center p-4"
                    />
                  )}
                </div>
              </Link>

              {/* Remove from favorites */}
              <button
                onClick={() => toggleFavorite(product.id)}
                className="absolute right-2 top-2 rounded-full bg-white/90 p-2 shadow-md transition-all hover:scale-110 hover:bg-white"
                aria-label="Удалить из избранного"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </button>

              {/* Info */}
              <div className="flex flex-col gap-2 px-3 py-3">
                <span className="text-xs font-semibold text-primary">
                  {product.brand}
                </span>
                <Link
                  href={localizedPath(`/products/${getProductSlug(product)}`)}
                  className="line-clamp-2 text-sm font-bold leading-snug text-foreground transition-colors hover:text-primary"
                >
                  {product.name}
                </Link>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < Math.floor(product.rating)
                          ? "fill-amber-400 text-amber-400"
                          : "fill-gray-200 text-gray-200"
                      }`}
                      strokeWidth={0}
                    />
                  ))}
                  <span className="text-xs text-muted-foreground">
                    ({product.reviewCount})
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-base font-bold text-foreground">
                    {formatMoney(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-muted-foreground line-through">
                      {formatMoney(product.originalPrice)}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => addToCart(product)}
                  className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                  {t("addToCart")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
