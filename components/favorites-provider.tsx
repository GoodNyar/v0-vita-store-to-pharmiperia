"use client"

import { createContext, useContext, useCallback, useEffect, useState, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"
import { isCatalogProductId, normalizeProductId } from "@/lib/data"

const LS_KEY = "pharmiperia_favorites"

function parseFavoriteIds(raw: unknown): number[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map((id) => normalizeProductId(id as string | number))
    .filter(isCatalogProductId)
}

function getLocalFavorites(): number[] {
  if (typeof window === "undefined") return []
  try {
    return parseFavoriteIds(JSON.parse(localStorage.getItem(LS_KEY) || "[]"))
  } catch {
    return []
  }
}

function setLocalFavorites(ids: number[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(LS_KEY, JSON.stringify(ids))
}

type FavoritesContextType = {
  favorites: number[]
  isLoading: boolean
  toggleFavorite: (productId: number) => Promise<void>
  isFavorited: (productId: number) => boolean
  isLoggedIn: boolean
}

const FavoritesContext = createContext<FavoritesContextType | null>(null)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<{ id: string } | null>(null)
  const supabase = createClient()

  useEffect(() => {
    // Load localStorage immediately for instant display
    const localFavs = getLocalFavorites()
    if (localFavs.length > 0) {
      setFavorites(localFavs)
    }

    const init = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user ? { id: user.id } : null)

        if (user) {
          // Fetch from DB
          const { data, error } = await supabase
            .from("favorites")
            .select("product_id")
            .eq("user_id", user.id)

          if (error) {
            setIsLoading(false)
            return
          }

          const dbFavs =
            data
              ?.map((f: { product_id: string | number }) =>
                normalizeProductId(f.product_id)
              )
              .filter(isCatalogProductId) || []

          // Merge any locally saved favorites into DB
          const localFavs = getLocalFavorites()
          const toSync = localFavs.filter((id) => !dbFavs.includes(id))

          if (toSync.length > 0) {
            await supabase.from("favorites").insert(
              toSync.map((product_id) => ({
                user_id: user.id,
                product_id: String(product_id),
              }))
            )
            setLocalFavorites([])
          }

          const merged = [...new Set([...dbFavs, ...toSync])]
          setFavorites(merged)
        }
        // For guests, favorites are already loaded from localStorage above
      } catch (error) {
        // Keep localStorage favorites on error
      } finally {
        setIsLoading(false)
      }
    }

    init()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        setUser({ id: session.user.id })
        const localFavs = getLocalFavorites()
        
        // First fetch existing DB favorites
        const { data: existingData } = await supabase
          .from("favorites")
          .select("product_id")
          .eq("user_id", session.user.id)
        const existingIds =
          existingData
            ?.map((f: { product_id: string | number }) =>
              normalizeProductId(f.product_id)
            )
            .filter(isCatalogProductId) || []
        
        // Merge local into DB (only new ones, skip duplicates)
        if (localFavs.length > 0) {
          const toInsert = localFavs.filter(id => !existingIds.includes(id))
          if (toInsert.length > 0) {
            await supabase.from("favorites").insert(
              toInsert.map((product_id) => ({
                user_id: session.user.id,
                product_id: String(product_id),
              }))
            )
          }
          setLocalFavorites([]) // Clear local after merge
        }
        
        // Set merged favorites
        const merged = [...new Set([...existingIds, ...localFavs])]
        setFavorites(merged)
      } else if (event === "SIGNED_OUT") {
        setUser(null)
        // Keep favorites for guest use after logout - don't clear localStorage
        // Only clear in-memory state, guest will use localStorage
        setFavorites(getLocalFavorites())
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const toggleFavorite = useCallback(
    async (productId: number) => {
      const isFav = favorites.includes(productId)
      
      // Update state IMMEDIATELY for instant UI feedback
      const newFavorites = isFav
        ? favorites.filter((id) => id !== productId)
        : [...favorites, productId]
      
      setFavorites(newFavorites)

      if (user) {
        // Logged in — sync with DB in background
        try {
          if (isFav) {
            await supabase
              .from("favorites")
              .delete()
              .eq("user_id", user.id)
              .eq("product_id", String(productId))
          } else {
            await supabase.from("favorites").insert({
              user_id: user.id,
              product_id: String(productId),
            })
          }
        } catch (error) {
          // Revert on error
          setFavorites(favorites)
        }
      } else {
        // Not logged in — save to localStorage
        setLocalFavorites(newFavorites)
      }
    },
    [user, favorites]
  )

  const isFavorited = useCallback(
    (productId: number) => favorites.includes(productId),
    [favorites]
  )

  return (
    <FavoritesContext.Provider value={{ favorites, isLoading, toggleFavorite, isFavorited, isLoggedIn: !!user }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error("useFavorites must be used within FavoritesProvider")
  }
  return context
}