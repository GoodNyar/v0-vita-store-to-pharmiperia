"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { LangProvider, formatEur } from "@/lib/i18n"
import { CartProvider, useCart } from "@/components/cart-context"
import { Button } from "@/components/ui/button"
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
    brand: { name: string }
  }
}

function FavoritesContent() {
  const router = useRouter()
  const { addItem } = useCart()
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
            brand:brands(name)
          )
        `)
        .eq("user_id", user.id)

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
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-1.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Leaf className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Pharmiperia</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="mx-auto max-w-5xl px-4">
          {/* Back link */}
          <Link 
            href="/account" 
            className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
          >
            <ChevronLeft className="h-4 w-4" />
            Назад в аккаунт
          </Link>

          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Избранное</h1>
              <p className="text-sm text-muted-foreground">
                {favorites.length} товаров
              </p>
            </div>
          </div>

          {favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card py-16">
              <Heart className="mb-4 h-16 w-16 text-muted-foreground/50" />
              <h2 className="text-xl font-semibold text-foreground">Избранное пусто</h2>
              <p className="mt-2 text-muted-foreground">
                Добавляйте товары в избранное, чтобы не потерять их
              </p>
              <Link href="/" className="mt-6">
                <Button>Перейти к покупкам</Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {favorites.map(({ id, product }) => (
                <div
                  key={id}
                  className="group relative rounded-xl border border-border bg-card p-3 transition-shadow hover:shadow-md"
                >
                  <button
                    onClick={() => removeFavorite(id)}
                    className="absolute right-3 top-3 z-10 rounded-full bg-card/80 p-1.5 text-destructive opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <Link href={`/products/${product.id}`}>
                    <div className="relative aspect-square overflow-hidden rounded-lg bg-secondary">
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      {product.original_price && (
                        <span className="absolute left-2 top-2 rounded-full bg-destructive px-2 py-0.5 text-xs font-bold text-destructive-foreground">
                          -{Math.round((1 - product.price / product.original_price) * 100)}%
                        </span>
                      )}
                    </div>
                  </Link>

                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground">{product.brand.name}</p>
                    <Link href={`/products/${product.id}`}>
                      <h3 className="mt-1 font-medium text-foreground line-clamp-2 hover:text-primary">
                        {product.name}
                      </h3>
                    </Link>
                    
                    <div className="mt-1 flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium text-foreground">{product.rating}</span>
                      <span className="text-xs text-muted-foreground">
                        ({product.review_count.toLocaleString()})
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-primary">
                          {formatEur(product.price)}
                        </span>
                        {product.original_price && (
                          <span className="ml-2 text-sm text-muted-foreground line-through">
                            {formatEur(product.original_price)}
                          </span>
                        )}
                      </div>
                      <Button
                        size="sm"
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                        onClick={() => addItem({
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          image: product.image_url,
                          brand: product.brand.name
                        })}
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
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
