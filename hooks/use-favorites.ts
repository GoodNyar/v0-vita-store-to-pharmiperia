"use client"

import { useCallback, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

const LS_KEY = "pharmiperia_favorites"

function getLocalFavorites(): string[] {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "[]")
  } catch {
    return []
  }
}

function setLocalFavorites(ids: string[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(LS_KEY, JSON.stringify(ids))
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<{ id: string } | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const init = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user ? { id: user.id } : null)

        if (user) {
          // Fetch from DB
          const { data } = await supabase
            .from("favorites")
            .select("product_id")
            .eq("user_id", user.id)

          const dbFavs = data?.map((f) => f.product_id) || []

          // Merge any locally saved favorites into DB
          const localFavs = getLocalFavorites()
          const toSync = localFavs.filter((id) => !dbFavs.includes(id))

          if (toSync.length > 0) {
            await supabase.from("favorites").insert(
              toSync.map((product_id) => ({ user_id: user.id, product_id }))
            )
            // Clear local after sync
            setLocalFavorites([])
          }

          const merged = [...new Set([...dbFavs, ...toSync])]
          setFavorites(merged)
        } else {
          // Not logged in — use localStorage
          setFavorites(getLocalFavorites())
        }
      } catch (error) {
        // Fallback to localStorage on any error
        setFavorites(getLocalFavorites())
      } finally {
        setIsLoading(false)
      }
    }

    init()

    // Listen for auth changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        setUser({ id: session.user.id })
        // Sync localStorage favorites to DB after login
        const localFavs = getLocalFavorites()
        if (localFavs.length > 0) {
          await supabase.from("favorites").insert(
            localFavs.map((product_id) => ({ user_id: session.user.id, product_id }))
          ).select()
          setLocalFavorites([])
        }
        const { data } = await supabase
          .from("favorites")
          .select("product_id")
          .eq("user_id", session.user.id)
        setFavorites(data?.map((f) => f.product_id) || [])
      } else if (event === "SIGNED_OUT") {
        setUser(null)
        setFavorites([])
        setLocalFavorites([])
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const toggleFavorite = useCallback(
    async (productId: string) => {
      const isFav = favorites.includes(productId)

      if (user) {
        // Logged in — sync with DB
        try {
          if (isFav) {
            await supabase
              .from("favorites")
              .delete()
              .eq("user_id", user.id)
              .eq("product_id", productId)
            setFavorites((prev) => prev.filter((id) => id !== productId))
          } else {
            await supabase.from("favorites").insert({
              user_id: user.id,
              product_id: productId,
            })
            setFavorites((prev) => [...prev, productId])
          }
        } catch (error) {
          console.error("Error toggling favorite:", error)
        }
      } else {
        // Not logged in — save to localStorage
        const updated = isFav
          ? favorites.filter((id) => id !== productId)
          : [...favorites, productId]
        setFavorites(updated)
        setLocalFavorites(updated)
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
