"use client"

import { useCallback, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<{ id: string } | null>(null)
  const supabase = createClient()

  // Get current user and fetch their favorites
  useEffect(() => {
    const fetchUserAndFavorites = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setUser(user ? { id: user.id } : null)

        if (user) {
          const { data } = await supabase
            .from("favorites")
            .select("product_id")
            .eq("user_id", user.id)

          if (data) {
            setFavorites(data.map((fav) => fav.product_id))
          }
        }
      } catch (error) {
        console.error("[v0] Error fetching favorites:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserAndFavorites()
  }, [supabase])

  // Toggle favorite
  const toggleFavorite = useCallback(
    async (productId: string) => {
      if (!user) {
        alert("Пожалуйста, войдите в аккаунт чтобы добавить товар в избранное")
        return
      }

      const isFavorited = favorites.includes(productId)

      try {
        if (isFavorited) {
          // Remove from favorites
          await supabase
            .from("favorites")
            .delete()
            .eq("user_id", user.id)
            .eq("product_id", productId)

          setFavorites((prev) => prev.filter((id) => id !== productId))
        } else {
          // Add to favorites
          await supabase.from("favorites").insert({
            user_id: user.id,
            product_id: productId,
          })

          setFavorites((prev) => [...prev, productId])
        }
      } catch (error) {
        console.error("[v0] Error toggling favorite:", error)
        alert("Ошибка при обновлении избранного")
      }
    },
    [user, favorites, supabase]
  )

  const isFavorited = useCallback(
    (productId: string) => favorites.includes(productId),
    [favorites]
  )

  return {
    favorites,
    isLoading,
    toggleFavorite,
    isFavorited,
    isLoggedIn: !!user,
  }
}
