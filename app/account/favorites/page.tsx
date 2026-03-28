"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { LangProvider, useLang, formatEur } from "@/lib/i18n"
import { CartProvider, useCart } from "@/components/cart-context"
import { PromoBar } from "@/components/promo-bar"
import { SiteHeader } from "@/components/site-header"
import { CartDrawer } from "@/components/cart-drawer"
import { SiteFooter } from "@/components/site-footer"
import { 
  Leaf, Heart, Star, Loader2, ChevronLeft, Trash2, ShoppingCart
} from "lucide-react"

interface FavoriteProduct {
  id: string
  product: {
    id: string
    name: string
    price: number
    original_price: number | null
    image_url: string
    rating: number
    review_count: number
    volume: string
    sku: string
    brand: { name: string }
  }
}

function FavoritesContent() {
  const router = useRouter()
  const { t } = useLang()
  const { addToCart } = useCart()
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const fetchFavorites = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push("/auth/login")
        return
      }

      setUserId(user.id)

      const { data } = await supabase
        .from("favorites")
        .select(`
          id,
          product:products(
            id,
            name,
            price,
            original_price,
            image_url,
            rating,
            review_count,
            volume,
            sku,
            brand:brands(name)
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      setFavorites((data as unknown as FavoriteProduct[]) || [])
      setLoading(false)
    }

    fetchFavorites()
  }, [router])

  const removeFavorite = async (favoriteId: string) => {
    const supabase = createClient()
    await supabase.from("favorites").delete().eq("id", favoriteId)
    setFavorites(prev => prev.filter(f => f.id !== favoriteId))
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
          {/* Breadcrumb */}
          <Link
            href="/account"
            className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            {t("account") || "Аккаунт"}
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">{t("wishlist") || "Избранное"}</h1>
            <p className="mt-2 text-muted-foreground">
              {favorites.length > 0 
                ? `${favorites.length} ${favorites.length === 1 ? 'товар' : 'товаров'}`
                : 'У вас нет избранных товаров'
              }
            </p>
          </div>

          {/* Empty state */}
          {favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-card py-16">
              <Heart className="h-16 w-16 text-muted-foreground/20" />
              <h2 className="mt-4 text-lg font-semibold text-foreground">Нет избранных товаров</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Добавляйте товары в избранное чтобы вернуться к ним позже
              </p>
              <Link
                href="/"
                className="mt-6 rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {t("continueShopping") || "Продолжить покупки"}
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {favorites.map((fav) => (
                <div
                  key={fav.id}
                  className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_6px_20px_rgba(0,0,0,0.14)] transition-all duration-200"
                >
                  {/* Product image */}
                  <Link href={`/products/${fav.product.id}`} className="relative overflow-hidden bg-[#f2f3f5]">
                    <div className="relative w-full" style={{ paddingBottom: "100%" }}>
                      {fav.product.image_url && (
                        <Image
                          src={fav.product.image_url}
                          alt={fav.product.name}
                          fill
                          className="object-contain object-center p-4"
                        />
                      )}
                    </div>
                  </Link>

                  {/* Remove button */}
                  <button
                    onClick={() => removeFavorite(fav.id)}
                    className="absolute right-2 top-2 rounded-full bg-white/90 p-2 shadow-md transition-all hover:bg-white hover:scale-110"
                    aria-label="Remove from favorites"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>

                  {/* Product info */}
                  <div className="flex flex-col gap-2 px-3 py-3">
                    {/* Brand */}
                    <span className="text-xs font-semibold text-primary">
                      {fav.product.brand?.name || "Brand"}
                    </span>

                    {/* Name */}
                    <Link
                      href={`/products/${fav.product.id}`}
                      className="line-clamp-2 text-sm font-bold leading-snug text-foreground hover:text-primary transition-colors"
                    >
                      {fav.product.name}
                    </Link>

                    {/* Rating */}
                    <div className="flex items-center gap-1">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < Math.floor(fav.product.rating)
                                ? "fill-amber-400 text-amber-400"
                                : "fill-gray-300 text-gray-300"
                            }`}
                            strokeWidth={0}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        ({fav.product.review_count})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-base font-bold text-foreground">
                        {formatEur(fav.product.price)}
                      </span>
                      {fav.product.original_price && (
                        <span className="text-xs text-muted-foreground line-through">
                          {formatEur(fav.product.original_price)}
                        </span>
                      )}
                    </div>

                    {/* Add to cart button */}
                    <button
                      onClick={() => addToCart({
                        id: fav.product.id,
                        name: fav.product.name,
                        price: fav.product.price,
                        originalPrice: fav.product.original_price,
                        image: fav.product.image_url,
                        category: "",
                        brand: fav.product.brand?.name || "",
                        rating: fav.product.rating,
                        reviewCount: fav.product.review_count,
                        description: "",
                        volume: fav.product.volume,
                        sku: fav.product.sku,
                        inStock: true,
                        badge: undefined
                      })}
                      className="mt-2 w-full rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:bg-primary/80"
                    >
                      <ShoppingCart className="h-3.5 w-3.5 inline mr-1" />
                      {t("addToCart") || "В корзину"}
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
