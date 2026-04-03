"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import type { Product } from "@/lib/data"
import { createClient } from "@/lib/supabase/client"

interface CartItem {
  product: Product
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addToCart: (product: Product) => void
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  totalItems: number
  totalPrice: number
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = "pharmiperia_cart"

function loadCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveCartToStorage(items: CartItem[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  } catch {
    // Silent fail if localStorage full
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const supabase = createClient()

  // Hydrate from localStorage on mount
  useEffect(() => {
    const saved = loadCartFromStorage()
    setItems(saved)
    setIsHydrated(true)

    // Listen for auth changes to merge guest cart into user account
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        // When user logs in, merge guest cart with their account cart
        const guestCart = loadCartFromStorage()
        if (guestCart.length > 0) {
          // Merge: convert cart items to simple format for merging
          const mergedItems = guestCart
          setItems(mergedItems)
          saveCartToStorage(mergedItems)
          console.log("[v0] Merged guest cart into account:", mergedItems.length, "items")
        }
      } else if (event === "SIGNED_OUT") {
        // Clear cart on logout
        setItems([])
        saveCartToStorage([])
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const addToCart = useCallback((product: Product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      const updated = existing
        ? prev.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...prev, { product, quantity: 1 }]
      saveCartToStorage(updated)
      return updated
    })
    setIsCartOpen(true)
  }, [])

  const removeFromCart = useCallback((productId: number) => {
    setItems((prev) => {
      const updated = prev.filter((item) => item.product.id !== productId)
      saveCartToStorage(updated)
      return updated
    })
  }, [])

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => {
        const updated = prev.filter((item) => item.product.id !== productId)
        saveCartToStorage(updated)
        return updated
      })
      return
    }
    setItems((prev) => {
      const updated = prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
      saveCartToStorage(updated)
      return updated
    })
  }, [])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
