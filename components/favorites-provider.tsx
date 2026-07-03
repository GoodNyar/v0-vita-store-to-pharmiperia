"use client"

import { createContext, useContext, useCallback, useEffect, useState, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"
import { isCatalogProductId } from "@/lib/data"
import {
  addUserFavorite,
  listUserFavoriteLegacyIds,
  normalizeFavoriteRowId,
  parseStoredFavoriteIds,
  removeUserFavorite,
  syncLocalFavoritesToUser,
} from "@/lib/commerce/favorites"

const LS_KEY = "pharmiperia_favorites"

function getLocalFavorites(): number[] {
  if (typeof window === "undefined") return []
  try {
    return parseStoredFavoriteIds(JSON.parse(localStorage.getItem(LS_KEY) || "[]"))
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
    const init = async () => {
      const localFavs = getLocalFavorites()
      if (localFavs.length > 0) {
        setFavorites(localFavs)
      }
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser()
        setUser(authUser ? { id: authUser.id } : null)

        if (authUser) {
          const localIds = getLocalFavorites()
          const synced = await syncLocalFavoritesToUser(authUser.id, localIds)
          if (synced.ok) {
            setFavorites(synced.data)
            if (localIds.length > 0) setLocalFavorites([])
          } else {
            const listed = await listUserFavoriteLegacyIds(authUser.id)
            if (listed.ok) setFavorites(listed.data)
          }
        }
      } catch {
        // Keep localStorage favorites on error
      } finally {
        setIsLoading(false)
      }
    }

    init()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        setUser({ id: session.user.id })
        const localFavs = getLocalFavorites()
        const synced = await syncLocalFavoritesToUser(session.user.id, localFavs)
        if (synced.ok) {
          setFavorites(synced.data)
          setLocalFavorites([])
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null)
        setFavorites(getLocalFavorites())
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const toggleFavorite = useCallback(
    async (productId: number) => {
      if (!isCatalogProductId(productId)) return

      const isFav = favorites.includes(productId)
      const newFavorites = isFav
        ? favorites.filter((id) => id !== productId)
        : [...favorites, productId]

      setFavorites(newFavorites)

      if (user) {
        const result = isFav
          ? await removeUserFavorite(user.id, productId)
          : await addUserFavorite(user.id, productId)
        if (!result.ok) {
          setFavorites(favorites)
        }
      } else {
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
    <FavoritesContext.Provider
      value={{ favorites, isLoading, toggleFavorite, isFavorited, isLoggedIn: !!user }}
    >
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

export { normalizeFavoriteRowId }