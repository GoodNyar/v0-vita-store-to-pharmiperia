"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react"
import { products, type Product } from "@/lib/data"
import { createClient } from "@/lib/supabase/client"

interface CartItem {
  product: Product
  quantity: number
}

/** Minimal payload from category/search listings (Supabase-shaped). */
export interface QuickAddItem {
  id: number
  name: string
  price: number
  image?: string
  brand?: string
  quantity?: number
}

interface CartContextType {
  items: CartItem[]
  addToCart: (product: Product) => void
  addItem: (item: QuickAddItem) => void
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
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

function resolveProduct(input: QuickAddItem): Product {
  const catalog = products.find((p) => p.id === input.id)
  if (catalog) return catalog

  return {
    id: input.id,
    sku: String(input.id),
    name: input.name,
    brand: input.brand ?? "",
    volume: "",
    description: "",
    price: input.price,
    rating: 0,
    reviewCount: 0,
    image: input.image ?? "/placeholder.svg",
    category: "skincare",
    inStock: true,
  }
}

function mergeCartItem(
  prev: CartItem[],
  product: Product,
  quantity: number
): CartItem[] {
  const existing = prev.find((item) => item.product.id === product.id)
  if (existing) {
    return prev.map((item) =>
      item.product.id === product.id
        ? { ...item, quantity: item.quantity + quantity }
        : item
    )
  }
  return [...prev, { product, quantity }]
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const saved = loadCartFromStorage()
    setItems(saved)

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        const guestCart = loadCartFromStorage()
        if (guestCart.length > 0) {
          setItems(guestCart)
          saveCartToStorage(guestCart)
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const addToCart = useCallback((product: Product) => {
    setItems((prev) => {
      const updated = mergeCartItem(prev, product, 1)
      saveCartToStorage(updated)
      return updated
    })
    setIsCartOpen(true)
  }, [])

  const addItem = useCallback((input: QuickAddItem) => {
    const product = resolveProduct(input)
    const quantity = Math.max(1, input.quantity ?? 1)
    setItems((prev) => {
      const updated = mergeCartItem(prev, product, quantity)
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

  const clearCart = useCallback(() => {
    setItems([])
    saveCartToStorage([])
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
        addItem,
        removeFromCart,
        updateQuantity,
        clearCart,
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