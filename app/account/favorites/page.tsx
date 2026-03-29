"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { LangProvider, useLang, formatEur } from "@/lib/i18n"
import { CartProvider, useCart } from "@/components/cart-context"
import { PromoBar } from "@/components/promo-bar"
import { SiteHeader } from "@/components/site-header"
import { CartDrawer } from "@/components/cart-drawer"
import { SiteFooter } from "@/components/site-footer"
import { useFavorites } from "@/hooks/use-favorites"
import { Heart, Star, Loader2, ChevronLeft, Trash2, ShoppingCart, LogIn } from "lucide-react"

const LS_KEY = "pharmiperia_favorites"

function FavoritesContent() {
  const { t } = useLang()
  const { addToCart } = useCart()
  const { favorites, isLoading, toggleFavorite, isLoggedIn } = useFavorites()
  const [products, setProducts] = useState<any[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)

  // Fetch product details for all favorited IDs
  useEffect(() => {
    if (isLoading) return
    if (favorites.length === 0) {
      setProducts([])
      return
    }

    const fetchProducts = async () => {
      setLoadingProducts(true)
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from("products")
          .select(`
            id, name, price, original_price, image_url,
            rating, review_count, volume, sku,
            brand:brands(name)
          `)
          .in("id", favorites)

        setProducts(data || [])
      } catch (err) {
        console.error("Error fetching favorite products:", err)
      } finally {
        setLoadingProducts(false)
      }
    }

    fetchProducts()
  }, [favorites, isLoading])

  if (isLoading || loadingProducts) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <PromoBar />
        <SiteHeader />
        <CartDrawer />
        <main className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <SiteFooter />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PromoBar />
      <SiteHeader />
      <CartDrawer />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            {t("continueShopping")}
          </Link>

          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {t("wishlist")}
              </h1>
              <p className="mt-1 text-muted-foreground">
                {products.length > 0
                  ? `${products.length} ${products.length === 1 ? "товар" : products.length < 5 ? "товара" : "товаров"}`
                  : t("noFavorites") || "Нет избранных товаров"}
              </p>
            </div>
          </div>

          {/* Banner for guests — save favorites with account */}
          {!isLoggedIn && favorites.length > 0 && (
            <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-primary/20 bg-primary/5 px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Войдите чтобы сохранить избранное навсегда
                </p>
                <p className="text-xs text-muted-foreground">
                  Сейчас список сохранён в браузере. После входа он синхронизируется с аккаунтом.
                </p>
              </div>
              <Link
                href="/auth/login"
                className="flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <LogIn className="h-4 w-4" />
                Войти
              </Link>
            </div>
          )}

          {/* Empty state */}
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-card py-16">
              <Heart className="h-16 w-16 text-muted-foreground/20" />
              <h2 className="mt-4 text-lg font-semibold text-foreground">
                {t("noFavorites") || "Нет избранных товаров"}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Нажмите на сердечко на товаре чтобы добавить в избранное
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
                  <Link href={`/products/${product.id}`} className="relative block overflow-hidden bg-[#f2f3f5]">
                    <div className="relative w-full" style={{ paddingBottom: "100%" }}>
                      {product.image_url && (
                        <Image
                          src={product.image_url}
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
                      {product.brand?.name || ""}
                    </span>
                    <Link
                      href={`/products/${product.id}`}
                      className="line-clamp-2 text-sm font-bold leading-snug text-foreground transition-colors hover:text-primary"
                    >
                      {product.name}
                    </Link>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.floor(product.rating ?? 0)
                              ? "fill-amber-400 text-amber-400"
                              : "fill-gray-200 text-gray-200"
                          }`}
                          strokeWidth={0}
                        />
                      ))}
                      <span className="text-xs text-muted-foreground">
                        ({product.review_count ?? 0})
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-bold text-foreground">
                        {formatEur(product.price)}
                      </span>
                      {product.original_price && (
                        <span className="text-xs text-muted-foreground line-through">
                          {formatEur(product.original_price)}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() =>
                        addToCart({
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          originalPrice: product.original_price,
                          image: product.image_url,
                          category: "",
                          brand: product.brand?.name || "",
                          rating: product.rating,
                          reviewCount: product.review_count,
                          description: "",
                          volume: product.volume,
                          sku: product.sku,
                          inStock: true,
                          badge: undefined,
                        })
                      }
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
      </main>

      <SiteFooter />
    </div>
  )
}

export default function FavoritesPage() {
  return (
    <LangProvider>
      <CartProvider>
        <FavoritesContent />
      </CartProvider>
    </LangProvider>
  )
}
