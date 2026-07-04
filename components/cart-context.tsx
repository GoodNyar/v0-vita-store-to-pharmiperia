"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react"
import { type Product } from "@/lib/data"
import { multiplyMoney, sumMoney, type Money } from "@/lib/money"
import {
  loadAuthenticatedCart,
  mergeGuestCartToServer,
  persistCartLine,
  persistClearCart,
  persistRemoveCartLine,
} from "@/app/actions/cart"
import { fetchCatalogProducts } from "@/app/actions/catalog"
import { createClient } from "@/lib/supabase/client"
import { isLocale, type Locale } from "@/lib/i18n/config"
import { trackAddToCart } from "@/lib/analytics/client"

interface CartItem {
  product: Product
  quantity: number
}

/** Minimal payload from category/search listings (Supabase-shaped). */
export interface QuickAddItem {
  id: number
  name: string
  price: Money
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
  totalMoney: Money
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
  isServerBacked: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = "pharmiperia:v3:cart"

function localeFromPathname(): Locale {
  if (typeof window === "undefined") return "lv"
  return window.location.pathname.startsWith("/ru") ? "ru" : "lv"
}

function isMoney(value: unknown): value is Money {
  return (
    typeof value === "object" &&
    value != null &&
    "amount" in value &&
    "currency" in value &&
    typeof (value as Money).amount === "number" &&
    (value as Money).currency === "EUR"
  )
}

function isValidCartItem(item: unknown): item is CartItem {
  if (typeof item !== "object" || item == null) return false
  const candidate = item as CartItem
  return (
    typeof candidate.quantity === "number" &&
    typeof candidate.product === "object" &&
    candidate.product != null &&
    isMoney(candidate.product.price)
  )
}

function loadCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isValidCartItem)
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

function resolveProduct(input: QuickAddItem, catalog: Product[]): Product {
  const fromCatalog = catalog.find((p) => p.id === input.id)
  if (fromCatalog) return fromCatalog

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
  const [isServerBacked, setIsServerBacked] = useState(false)
  const catalogRef = useRef<Product[]>([])
  const userIdRef = useRef<string | null>(null)
  const supabase = createClient()

  const hydrateFromServer = useCallback(async (locale: Locale) => {
    const result = await loadAuthenticatedCart(locale)
    if (result.ok) {
      setItems(result.items)
      saveCartToStorage(result.items)
      setIsServerBacked(true)
      return true
    }
    setIsServerBacked(false)
    return false
  }, [])

  useEffect(() => {
    const saved = loadCartFromStorage()
    const hydrationTimer = window.setTimeout(() => {
      setItems(saved)
    }, 0)

    const locale = localeFromPathname()
    if (isLocale(locale)) {
      void fetchCatalogProducts(locale).then((catalog) => {
        if (catalog.length > 0) {
          catalogRef.current = catalog
        }
      })

      void supabase.auth.getUser().then(({ data }) => {
        userIdRef.current = data.user?.id ?? null
        if (data.user) {
          void hydrateFromServer(locale)
        }
      })
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      userIdRef.current = session?.user?.id ?? null
      const currentLocale = localeFromPathname()
      if (!isLocale(currentLocale)) return

      if (event === "SIGNED_IN" && session?.user) {
        const guestCart = loadCartFromStorage()
        if (guestCart.length > 0) {
          await mergeGuestCartToServer(
            currentLocale,
            guestCart.map((line) => ({
              legacyId: line.product.id,
              quantity: line.quantity,
            }))
          )
        }
        await hydrateFromServer(currentLocale)
      }

      if (event === "SIGNED_OUT") {
        setIsServerBacked(false)
        const localOnly = loadCartFromStorage()
        setItems(localOnly)
      }
    })

    return () => {
      window.clearTimeout(hydrationTimer)
      subscription.unsubscribe()
    }
  }, [supabase.auth, hydrateFromServer])

  const persistIfAuthenticated = useCallback(
    async (legacyId: number, quantity: number) => {
      if (!userIdRef.current) return
      const locale = localeFromPathname()
      if (!isLocale(locale)) return
      await persistCartLine(locale, legacyId, quantity)
    },
    []
  )

  const addToCart = useCallback((product: Product) => {
    trackAddToCart({
      itemId: String(product.id),
      itemName: product.name,
      price: product.price.amount / 100,
      currency: product.price.currency,
      quantity: 1,
    })
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      const nextQty = (existing?.quantity ?? 0) + 1
      const updated = mergeCartItem(prev, product, 1)
      saveCartToStorage(updated)
      void persistIfAuthenticated(product.id, nextQty)
      return updated
    })
    setIsCartOpen(true)
  }, [persistIfAuthenticated])

  const addItem = useCallback((input: QuickAddItem) => {
    const product = resolveProduct(input, catalogRef.current)
    const quantity = Math.max(1, input.quantity ?? 1)
    trackAddToCart({
      itemId: String(product.id),
      itemName: product.name,
      price: product.price.amount / 100,
      currency: product.price.currency,
      quantity,
    })
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      const nextQty = (existing?.quantity ?? 0) + quantity
      const updated = mergeCartItem(prev, product, quantity)
      saveCartToStorage(updated)
      void persistIfAuthenticated(product.id, nextQty)
      return updated
    })
    setIsCartOpen(true)
  }, [persistIfAuthenticated])

  const removeFromCart = useCallback((productId: number) => {
    setItems((prev) => {
      const updated = prev.filter((item) => item.product.id !== productId)
      saveCartToStorage(updated)
      void persistRemoveCartLine(productId)
      return updated
    })
  }, [])

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => {
        const updated = prev.filter((item) => item.product.id !== productId)
        saveCartToStorage(updated)
        void persistRemoveCartLine(productId)
        return updated
      })
      return
    }
    setItems((prev) => {
      const updated = prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
      saveCartToStorage(updated)
      void persistIfAuthenticated(productId, quantity)
      return updated
    })
  }, [persistIfAuthenticated])

  const clearCart = useCallback(() => {
    setItems([])
    saveCartToStorage([])
    void persistClearCart()
  }, [])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalMoney = sumMoney(
    items.map((item) => multiplyMoney(item.product.price, item.quantity))
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
        totalMoney,
        isCartOpen,
        setIsCartOpen,
        isServerBacked,
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