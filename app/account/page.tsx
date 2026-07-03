"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/components/auth-provider"
import { useLang } from "@/lib/i18n"
import { useCart } from "@/components/cart-context"
import { useFavorites } from "@/components/favorites-provider"
import { products as allProducts, type Product } from "@/lib/data"
import { createClient } from "@/lib/supabase/client"
import { 
  User, 
  Heart, 
  Package, 
  LogOut, 
  ChevronRight,
  Loader2,
  RotateCcw,
  Plus,
  Edit2,
  X,
  Star,
  Zap,
  Phone,
  Mail,
  CreditCard
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface Profile {
  id?: string
  first_name?: string
  last_name?: string
  phone?: string
  email?: string
  country?: string
  city?: string
  address?: string
  postal_code?: string
}

interface Order {
  id: string
  orderNumber: string
  date: string
  status: "delivered" | "in_progress" | "cancelled"
  total: number
  products: Array<{ id: string; name: string; image: string }>
}

type ActiveSection = "profile" | "orders" | "favorites" | "bonus" | "addresses" | "notifications"

export default function AccountPage() {
  const router = useRouter()
  const { user, isLoading: authLoading, signOut } = useAuth()
  const { t } = useLang()
  const { addToCart } = useCart()
  const { favorites } = useFavorites()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState<Profile>({})
  const [orders, setOrders] = useState<Order[]>([])
  const [bonusPoints, setBonusPoints] = useState(150)
  const bonusMax = 200
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([])
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const [toastPos, setToastPos] = useState({ x: 0, y: 0 })
  const [savedData, setSavedData] = useState<Profile | null>(null)
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [activeSection, setActiveSection] = useState<ActiveSection>("profile")
  
  // Notifications state
  const [notifications, setNotifications] = useState({
    push: false,
    email: false,
    recommendations: false,
    deals: false,
    subscribed: false,
  })

  // Show toast notification near cursor
  const showToast = (message: string, e?: React.MouseEvent, type: "success" | "error" = "success") => {
    if (e) {
      setToastPos({ x: e.clientX, y: e.clientY - 50 })
    }
    setToast({ message, type })
    setTimeout(() => setToast(null), 1800)
  }

  const bonusEquivalent = (bonusPoints * 0.01).toFixed(2)
  const bonusProgress = (bonusPoints / bonusMax) * 100

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login")
    }
  }, [authLoading, user, router])

  // Load profile - show cache instantly, refresh from Supabase in background
  useEffect(() => {
    if (!user) return
    
    // 1. Show cached data instantly (if exists)
    const localData = localStorage.getItem(`profile_${user.id}`)
    if (localData) {
      try {
        const parsed = JSON.parse(localData)
        setProfile(parsed)
        setSavedData(parsed)
        setProfileLoading(false) // Immediate UI update with cached data
      } catch {
        // Corrupt cache, skip
      }
    } else {
      // No cache - show empty profile
      const emptyProfile = { id: user.id, email: user.email }
      setProfile(emptyProfile)
      setSavedData(emptyProfile)
      setProfileLoading(false)
    }

    // 2. Refresh from Supabase in background (don't block UI)
    async function refreshFromSupabase() {
      const supabase = createClient()
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, first_name, last_name, phone, email, country, city, address, postal_code")
          .eq("id", user.id)
          .maybeSingle()
        
        if (error) throw error
        
        if (data) {
          setProfile(data)
          setSavedData(data)
          localStorage.setItem(`profile_${user.id}`, JSON.stringify(data))
        }
      } catch (err) {
        console.error("[v0] Supabase refresh error:", err)
        // Keep cached data on error
      }
    }

    refreshFromSupabase()
  }, [user])

  // Sync formData with savedData when opening form
  useEffect(() => {
    if (isEditing && savedData) {
      // Load saved data but NEVER auto-fill phone field for privacy
      const dataToLoad = { ...savedData }
      dataToLoad.phone = "" // Always start with empty phone field
      setFormData(dataToLoad)
      setErrors({})
    }
  }, [isEditing])

  // Load mock orders
  useEffect(() => {
    const mockOrders: Order[] = [
      {
        id: "1",
        orderNumber: "#4521",
        date: "2025-03-25",
        status: "delivered",
        total: 49.99,
        products: [
          { id: "1", name: "Средство для кожи", image: allProducts[0]?.image || "" },
          { id: "2", name: "Маска для волос", image: allProducts[1]?.image || "" },
        ],
      },
      {
        id: "2",
        orderNumber: "#4520",
        date: "2025-03-20",
        status: "in_progress",
        total: 89.99,
        products: [
          { id: "3", name: "Крем SPF 50", image: allProducts[2]?.image || "" },
        ],
      },
    ]
    setOrders(mockOrders)

    // Get recommended products based on last order + popular items
    if (mockOrders[0] && mockOrders[0].products.length > 0) {
      const lastOrderIds = new Set(mockOrders[0].products.map(p => p.id))
      const filtered = allProducts
        .filter(p => !lastOrderIds.has(p.id.toString()))
        .slice(0, 4)
      setRecommendedProducts(filtered)
    }
  }, [])

  const handleSaveProfile = async (e: React.MouseEvent) => {
    if (!user) return
    
    // Validate required fields
    const newErrors: Record<string, boolean> = {}
    if (!formData.first_name?.trim()) newErrors.first_name = true
    if (!formData.last_name?.trim()) newErrors.last_name = true
    // Phone must have exactly 8 digits (stored as pure digits in state)
    const phoneDigits = (formData.phone || "").replace(/\D/g, "")
    if (phoneDigits.length !== 8) newErrors.phone = true
    if (!formData.city?.trim()) newErrors.city = true
    if (!formData.address?.trim()) newErrors.address = true
    if (!formData.postal_code?.trim()) newErrors.postal_code = true
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      showToast(t("fillAllFields"), e, "error")
      return
    }
    setErrors({})
    
    // Check if data changed
    const currentData = JSON.stringify({
      first_name: formData.first_name,
      last_name: formData.last_name,
      phone: formData.phone,
      city: formData.city,
      address: formData.address,
      postal_code: formData.postal_code,
    })
    const savedDataStr = JSON.stringify({
      first_name: savedData?.first_name,
      last_name: savedData?.last_name,
      phone: savedData?.phone,
      city: savedData?.city,
      address: savedData?.address,
      postal_code: savedData?.postal_code,
    })
    
    if (currentData === savedDataStr) {
      showToast(t("alreadySaved"), e)
      setIsEditing(false)
      return
    }

    setIsSaving(true)
    
    const supabase = createClient()
    
    // Format phone with +371 prefix for database storage
    const formattedPhone = formData.phone ? `+371 ${formData.phone}` : null
    
    // Try to save with all fields first
    let { error } = await supabase
      .from("profiles")
      .upsert(
        {
          id: user.id,
          first_name: formData.first_name || null,
          last_name: formData.last_name || null,
          phone: formattedPhone,
          country: "Latvija",
          city: formData.city || null,
          address: formData.address || null,
          postal_code: formData.postal_code || null,
        },
        { onConflict: "id" }
      )

    // If error due to missing columns, try without them
    if (error && error.message?.includes("column")) {
      const { error: error2 } = await supabase
        .from("profiles")
        .upsert(
          {
            id: user.id,
            first_name: formData.first_name || null,
            last_name: formData.last_name || null,
            phone: formattedPhone,
          },
          { onConflict: "id" }
        )
      error = error2
    }

    setIsSaving(false)

    if (error) {
      console.error("[v0] Save error:", error)
      showToast(t("savingError"), e)
      return
    }

    // Update local state
    const newProfile = {
      id: user.id,
      first_name: formData.first_name,
      last_name: formData.last_name,
      phone: formData.phone,
      email: user.email,
      country: "Latvija",
      city: formData.city,
      address: formData.address,
      postal_code: formData.postal_code,
    }
    setProfile(newProfile)
    setSavedData(newProfile)
    
    // Save to localStorage for persistence
    localStorage.setItem(`profile_${user.id}`, JSON.stringify(newProfile))
    
    setIsEditing(false)
    showToast(t("dataSaved"), e)
  }

  const handleSignOut = async () => {
    await signOut()
  }

  const handleResetProfile = async (e: React.MouseEvent) => {
    if (!user) return
    
    // Prevent double-click
    if (isResetting) return
    
    setIsResetting(true)
    const supabase = createClient()
    
    try {
      // Clear in Supabase with empty strings for all editable fields
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          first_name: "",
          last_name: "",
          phone: "",
          country: "",
          city: "",
          address: "",
          postal_code: "",
        }, { onConflict: "id" })

      if (error && !error.message?.includes("column")) {
        throw error
      }
      
      // Update local state - keep only id and email
      const emailOnlyProfile = {
        id: user.id,
        email: user.email,
      }
      setProfile(emailOnlyProfile)
      setSavedData(emailOnlyProfile)
      setFormData(emailOnlyProfile)
      
      // Clear localStorage
      localStorage.removeItem(`profile_${user.id}`)
      
      // Close modal first, then show toast
      setShowResetConfirm(false)
      showToast(t("dataCleared"), e, "success")
      
    } catch (err) {
      console.error("[v0] Reset error:", err)
      showToast(t("clearingError"), e, "error")
      // Close modal even on error to prevent stuck state
      setShowResetConfirm(false)
    } finally {
      // Always reset loading state
      setIsResetting(false)
    }
  }

  const repeatOrder = (order: Order) => {
    order.products.forEach((p) => {
      const product = allProducts.find((prod) => prod.id.toString() === p.id)
      if (product) {
        addToCart(product)
      }
    })
  }

  if (authLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) return null

  const displayName = profile?.first_name 
    ? `${profile.first_name} ${profile.last_name || ""}`.trim()
    : user.email?.split("@")[0] || "User"

  const lastOrder = orders[0]

  // Get favorite products
  const favoriteProducts = allProducts.filter(p => favorites.includes(p.id))

  // Sidebar navigation items
  const sidebarItems = [
    { id: "profile" as const, icon: User, label: t("myData") },
    { id: "orders" as const, icon: Package, label: t("orderHistory") },
    { id: "favorites" as const, icon: Heart, label: t("favorites"), count: favorites.length },
    { id: "bonus" as const, icon: CreditCard, label: t("loyaltyCard") },
    { id: "addresses" as const, icon: Package, label: t("deliveryAddresses") },
    { id: "notifications" as const, icon: Zap, label: t("notifications") },
  ]

  return (
    <>
      {/* Page title */}
      <h1 className="text-2xl font-bold text-foreground mb-6">
        {t("accountTitle")}
      </h1>

      {/* 2-Column Layout */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        
        {/* ===== SIDEBAR ===== */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="lg:sticky lg:top-24 space-y-2">
            {/* Navigation */}
            <nav className="rounded-xl border border-border bg-card overflow-hidden">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-b border-border last:border-b-0 ${
                    activeSection === item.id 
                      ? "bg-primary text-primary-foreground" 
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.count !== undefined && item.count > 0 && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      activeSection === item.id 
                        ? "bg-white/20 text-primary-foreground" 
                        : "bg-primary/10 text-primary"
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>

            {/* Help section */}
            <div className="rounded-xl border border-border bg-card p-4 space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {t("needHelp")}
              </p>
              <div className="space-y-2">
                <a href="tel:+37129952852" className="flex items-center gap-2 text-sm text-primary hover:underline">
                  <Phone className="h-4 w-4" />
                  +371 29 952 852
                </a>
                <a href="mailto:info@pharmiperia.com" className="flex items-center gap-2 text-sm text-primary hover:underline">
                  <Mail className="h-4 w-4" />
                  info@pharmiperia.com
                </a>
              </div>
              <p className="text-xs text-muted-foreground">
                {t("workingHours")}
              </p>
              <a href="mailto:info@pharmiperia.com" className="w-full">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full justify-center"
                >
                  {t("contact")}
                </Button>
              </a>
            </div>

            {/* Logout button */}
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="w-full justify-start gap-2"
            >
              <LogOut className="h-4 w-4" />
              {t("logOut")}
            </Button>
          </div>
        </aside>

        {/* ===== MAIN CONTENT ===== */}
        <main className="flex-1 min-w-0">
          
          {/* ===== PROFILE SECTION ===== */}
          {activeSection === "profile" && (
            <div className="space-y-6">
              {/* Profile card */}
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 flex-shrink-0">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground">{displayName}</h2>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    className="flex-shrink-0"
                  >
                    <Edit2 className="mr-2 h-4 w-4" />
                    {t("edit")}
                  </Button>
                </div>

                {/* Profile details grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {t("phone")}
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {profile?.phone 
                        ? (profile.phone.startsWith("+371") ? profile.phone : `+371 ${profile.phone}`)
                        : "—"
                      }
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {t("country")}
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {profile?.country ? (t("latvia")) : "—"}
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {t("city")}
                    </p>
                    <p className="text-sm font-medium text-foreground">{profile?.city || "—"}</p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {t("postalCode")}
                    </p>
                    <p className="text-sm font-medium text-foreground">{profile?.postal_code || "—"}</p>
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {t("address")}
                    </p>
                    <p className="text-sm font-medium text-foreground">{profile?.address || "—"}</p>
                  </div>
                </div>
              </div>

              {/* Repeat last order CTA */}
              {lastOrder && (
                <button
                  onClick={() => repeatOrder(lastOrder)}
                  className="w-full group relative overflow-hidden rounded-xl bg-gradient-to-r from-primary to-primary/90 p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]"
                >
                  <div className="space-y-4">
                    {/* Title row */}
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-white">
                        {t("repeatLastOrder")}
                      </h3>
                      <span className="text-xs text-white/60">{lastOrder.date}</span>
                    </div>

                    {/* Product thumbnails */}
                    {lastOrder.products.length > 0 && (
                      <div className="flex items-center gap-2">
                        {lastOrder.products.slice(0, 4).map((p, i) => (
                          <div key={i} className="relative h-12 w-12 rounded-lg bg-white/20 overflow-hidden flex-shrink-0 border border-white/20">
                            {p.image ? (
                              <Image src={p.image} alt={p.name} fill className="object-cover" />
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <Package className="h-5 w-5 text-white/60" />
                              </div>
                            )}
                          </div>
                        ))}
                        {lastOrder.products.length > 4 && (
                          <span className="text-xs text-white/70 ml-1">+{lastOrder.products.length - 4}</span>
                        )}
                      </div>
                    )}

                    {/* Order info row */}
                    <div className="flex items-center justify-between pt-1 border-t border-white/20">
                      <div className="text-left">
                        <p className="text-xs text-white/70">{t("orderNumber")}</p>
                        <p className="text-sm font-semibold text-white">{lastOrder.orderNumber}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-white/70">{t("total")}</p>
                        <p className="text-lg font-bold text-white">€{lastOrder.total.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </button>
              )}
            </div>
          )}

          {/* ===== ORDERS SECTION ===== */}
          {activeSection === "orders" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">
                  {t("myOrders")}
                </h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {t("orderHistoryDesc")}
              </p>

              {orders.length === 0 ? (
                <div className="rounded-xl border border-border bg-card p-8 text-center">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {t("noOrdersText")}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div key={order.id} className="rounded-xl border border-border bg-card p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold text-foreground">{order.orderNumber}</p>
                          <p className="text-xs text-muted-foreground">{order.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-foreground">€{order.total.toFixed(2)}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            order.status === "delivered" 
                              ? "bg-green-100 text-green-700" 
                              : order.status === "in_progress"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700"
                          }`}>
                            {order.status === "delivered" 
                              ? (t("orderDelivered"))
                              : order.status === "in_progress"
                              ? (t("orderInProgress"))
                              : (t("orderCancelled"))
                            }
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {order.products.slice(0, 3).map((p, i) => (
                          <div key={i} className="relative h-10 w-10 rounded-lg bg-muted overflow-hidden">
                            {p.image && (
                              <Image src={p.image} alt={p.name} fill className="object-cover" />
                            )}
                          </div>
                        ))}
                        {order.products.length > 3 && (
                          <span className="text-xs text-muted-foreground">+{order.products.length - 3}</span>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => repeatOrder(order)}
                          className="ml-auto text-primary"
                        >
                          <RotateCcw className="h-4 w-4 mr-1" />
                          {t("repeat")}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ===== FAVORITES SECTION ===== */}
          {activeSection === "favorites" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-foreground">
                {t("favorites")}
              </h2>

              {favoriteProducts.length === 0 ? (
                <div className="rounded-xl border border-border bg-card p-8 text-center">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    {t("noFavoritesText")}
                  </p>
                  <Link href="/products">
                    <Button>{t("goToCatalog")}</Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {favoriteProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      className="group flex flex-col rounded-xl border border-border bg-card overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/50"
                    >
                      <div className="relative h-32 sm:h-40 bg-muted overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform group-hover:scale-110"
                        />
                      </div>
                      <div className="flex flex-col gap-1 p-3 flex-1">
                        <p className="text-xs font-semibold text-primary">{product.brand}</p>
                        <p className="text-sm font-bold text-foreground line-clamp-2">{product.name}</p>
                        <div className="flex items-center justify-between mt-auto pt-2">
                          <span className="font-bold text-foreground">€{product.price}</span>
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              addToCart(product)
                            }}
                            className="flex items-center justify-center rounded-lg bg-primary/10 text-primary p-2 transition-all hover:bg-primary hover:text-primary-foreground"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ===== BONUS SECTION ===== */}
          {activeSection === "bonus" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-foreground">
                {t("loyaltyCard")}
              </h2>

              {/* Bonus card visual */}
              <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-white overflow-hidden aspect-[1.6/1] max-w-md">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                <div className="relative h-full flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-white/60 uppercase tracking-wider mb-1">
                        {t("balance")}
                      </p>
                      <p className="text-3xl font-bold">€{bonusEquivalent}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                      <Zap className="h-5 w-5 text-amber-400" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-white/80 mb-1">pharmiperia</p>
                    <p className="text-xs text-white/40">{displayName}</p>
                  </div>
                </div>
              </div>

              {/* Bonus details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-border bg-card p-4">
                  <p className="text-xs text-muted-foreground mb-1">{t("points")}</p>
                  <p className="text-2xl font-bold text-foreground">{bonusPoints}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4">
                  <p className="text-xs text-muted-foreground mb-1">{t("toNextLevel")}</p>
                  <p className="text-2xl font-bold text-foreground">{bonusMax - bonusPoints}</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">{t("progress")}</span>
                  <span className="font-medium text-foreground">{bonusProgress.toFixed(0)}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-500"
                    style={{ width: `${bonusProgress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  1 {t("pointUnit")} = 0.01 €
                </p>
              </div>
            </div>
          )}

          {/* ===== ADDRESSES SECTION ===== */}
          {activeSection === "addresses" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-foreground">
                {t("deliveryAddresses")}
              </h2>
              
              <div className="rounded-xl border border-border bg-card p-8 text-center">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {t("noAddressesText")}
                </p>
              </div>
            </div>
          )}

          {/* ===== NOTIFICATIONS SECTION ===== */}
          {activeSection === "notifications" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-foreground">
                {t("notifications")}
              </h2>

              {/* Push Notifications Block */}
              <div className="rounded-xl border border-border bg-card p-4 flex items-start justify-between">
                <div className="flex-1 pr-4">
                  <h3 className="font-semibold text-foreground">
                    {t("pushNotifications")}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t("notificationDesc")}
                  </p>
                </div>
                <button
                  onClick={() => setNotifications({ ...notifications, push: !notifications.push })}
                  className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors ${
                    notifications.push ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                      notifications.push ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              {/* Email Notifications Block */}
              <div className="rounded-xl border border-border bg-card p-4 flex items-start justify-between">
                <div className="flex-1 pr-4">
                  <h3 className="font-semibold text-foreground">
                    {t("emailNotifications")}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t("offersAndNews")}
                  </p>
                </div>
                <button
                  onClick={() => setNotifications({ ...notifications, email: !notifications.email })}
                  className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors ${
                    notifications.email ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                      notifications.email ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              {/* Recommendations Block */}
              <div className="rounded-xl border border-border bg-card p-4 flex items-start justify-between">
                <div className="flex-1 pr-4">
                  <h3 className="font-semibold text-foreground">
                    {t("recommendations")}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t("basedOnPurchases")}
                  </p>
                </div>
                <button
                  onClick={() => setNotifications({ ...notifications, recommendations: !notifications.recommendations })}
                  className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors ${
                    notifications.recommendations ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                      notifications.recommendations ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              {/* Deals & Discounts Block */}
              <div className="rounded-xl border border-border bg-card p-4 flex items-start justify-between">
                <div className="flex-1 pr-4">
                  <h3 className="font-semibold text-foreground">
                    {t("dealsAndDiscounts")}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t("salesAndSpecial")}
                  </p>
                </div>
                <button
                  onClick={() => setNotifications({ ...notifications, deals: !notifications.deals })}
                  className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors ${
                    notifications.deals ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                      notifications.deals ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              {/* Bonus: Newsletter subscription card */}
              <div className="rounded-xl bg-gradient-to-br from-primary to-primary/90 p-4 text-white mt-6">
                <h3 className="font-bold text-lg mb-1">
                  {t("get10Off")}
                </h3>
                <p className="text-white/90 text-sm mb-3">
                  {t("subscribeNewsletter")}
                </p>
                <button
                  onClick={() => {
                    setNotifications({ ...notifications, subscribed: !notifications.subscribed })
                    showToast(
                      notifications.subscribed 
                        ? t("unsubscribedFromNewsletter")
                        : t("youAreSubscribed")
                    )
                  }}
                >
                  {notifications.subscribed ? t("subscribed") : t("subscribe")}
                </button>
              </div>
            </div>
          )}

          {/* ===== RECOMMENDED PRODUCTS (only on profile) ===== */}
          {activeSection === "profile" && recommendedProducts.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-bold text-foreground mb-4">
                {t("weRecommend")}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {recommendedProducts.slice(0, 4).map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="group flex flex-col rounded-xl border border-border bg-card overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/50"
                  >
                    <div className="relative h-32 sm:h-36 bg-muted overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-110"
                      />
                    </div>
                    <div className="flex flex-col gap-1 p-3 flex-1">
                      <p className="text-xs font-semibold text-primary">{product.brand}</p>
                      <p className="text-sm font-medium text-foreground line-clamp-2">{product.name}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < Math.floor(product.rating)
                                ? "fill-amber-400 text-amber-400"
                                : "fill-gray-200 text-gray-200"
                            }`}
                            strokeWidth={0}
                          />
                        ))}
                      </div>
                      <div className="flex items-center justify-between mt-auto pt-2">
                        <span className="font-bold text-foreground">€{product.price}</span>
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            addToCart(product)
                          }}
                          className="flex items-center justify-center rounded-lg bg-primary/10 text-primary p-1.5 text-xs transition-all hover:bg-primary hover:text-primary-foreground"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ===== EDIT PROFILE — SLIDE-IN DRAWER (right side) ===== */}
      {/* Backdrop — close without saving */}
      <div
        onClick={() => {
          setIsEditing(false)
        }}
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 ${isEditing ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      />
      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-background shadow-2xl border-l border-border transition-transform duration-300 ease-out ${isEditing ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4 flex-shrink-0">
          <h2 className="text-lg font-bold text-foreground">
            {t("editProfile")}
          </h2>
          <button
            onClick={() => {
              setErrors({})
              setIsEditing(false)
            }}
            className="rounded-lg p-2 transition-colors hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form — compact, no scroll needed */}
        <div className="flex-1 px-6 py-4 space-y-3 overflow-y-auto">

          {/* Row: Имя + Фамилия */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">
                {t("firstName")} <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                name="given-name"
                autoComplete="given-name"
                value={formData.first_name || ""}
                onChange={(e) => { setFormData({ ...formData, first_name: e.target.value }); setErrors({ ...errors, first_name: false }) }}
                className={`w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${errors.first_name ? "border-red-500" : "border-border"}`}
                placeholder={t("firstName")}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">
                {t("lastName")} <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                name="family-name"
                autoComplete="family-name"
                value={formData.last_name || ""}
                onChange={(e) => { setFormData({ ...formData, last_name: e.target.value }); setErrors({ ...errors, last_name: false }) }}
                className={`w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${errors.last_name ? "border-red-500" : "border-border"}`}
                placeholder={t("lastName")}
              />
            </div>
          </div>

          {/* Телефон */}
          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">
              {t("mobilePhone")} <span className="text-primary">*</span>
            </label>
            <div className="flex flex-col gap-1">
              <div className="flex">
                <div className="rounded-l-lg border border-r-0 border-border bg-muted px-3 py-2 text-sm text-muted-foreground flex items-center gap-2">
                  <Image 
                    src="/flags/latvia.svg" 
                    alt="Latvia flag" 
                    width={24} 
                    height={12}
                    className="w-6 h-3"
                  />
                  <span>+371</span>
                </div>
                <input
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  inputMode="numeric"
                  maxLength={11}
                  placeholder="29 123 456"
                  value={(formData.phone || "").replace(/\D/g, "")}
                  onChange={(e) => {
                    const input = e.target.value.replace(/\D/g, "")
                    
                    // Убрать дублирующийся код 371 если пользователь вставил с кодом
                    let digits = input.startsWith("371") ? input.slice(3) : input
                    
                    // Ограничиться 8 цифрами
                    digits = digits.slice(0, 8)
                    
                    // Сохранить полный формат в state только для валидных 8 цифр
                    // Если меньше 8 - сохранить как есть (без +371)
                    setFormData({ ...formData, phone: digits })
                    
                    // Не показывать ошибку во время ввода - только на blur
                    setErrors({ ...errors, phone: false })
                  }}
                  onBlur={(e) => {
                    const digits = (formData.phone || "").replace(/\D/g, "")
                    // Ошибка только если было что-то введено И не 8 цифр
                    if (digits.length > 0 && digits.length !== 8) {
                      setErrors({ ...errors, phone: true })
                    }
                  }}
                  className={`flex-1 rounded-r-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${errors.phone ? "border-red-500" : "border-border"}`}
                />
              </div>
              {errors.phone && (
                <p className="text-xs text-red-500">
                  {t("invalidPhoneNumber")}
                </p>
              )}
            </div>
          </div>

          {/* Email — read only */}
          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">
              {t("email")} <span className="text-primary">*</span>
            </label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-muted-foreground cursor-not-allowed"
            />
          </div>

          {/* Row: Страна (locked) + Город */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">
                {t("country")} <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                value={t("latvia")}
                disabled
                className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-muted-foreground cursor-not-allowed"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">
                {t("city")} <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                name="city"
                autoComplete="address-level2"
                value={formData.city || ""}
                onChange={(e) => { setFormData({ ...formData, city: e.target.value }); setErrors({ ...errors, city: false }) }}
                className={`w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${errors.city ? "border-red-500" : "border-border"}`}
                placeholder="Rīga"
              />
            </div>
          </div>

          {/* Адрес */}
          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">
              {t("address")} <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              name="street-address"
              autoComplete="street-address"
              value={formData.address || ""}
              onChange={(e) => { setFormData({ ...formData, address: e.target.value }); setErrors({ ...errors, address: false }) }}
              className={`w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${errors.address ? "border-red-500" : "border-border"}`}
              placeholder={t("streetAddress")}
            />
          </div>

          {/* Почтовый индекс */}
          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">
              {t("postalCode")} <span className="text-primary">*</span>
            </label>
            <div className="flex">
              <div className="rounded-l-lg border border-r-0 border-border bg-muted px-3 py-2 text-sm text-muted-foreground flex items-center">
                LV-
              </div>
              <input
                type="text"
                name="postal-code"
                autoComplete="postal-code"
                value={(formData.postal_code || "").replace("LV-", "")}
                onChange={(e) => { 
                  const digits = e.target.value.replace(/\D/g, "")
                  const formatted = digits ? `LV-${digits}` : ""
                  setFormData({ ...formData, postal_code: formatted })
                  setErrors({ ...errors, postal_code: false })
                }}
                className={`flex-1 rounded-r-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${errors.postal_code ? "border-red-500" : "border-border"}`}
                placeholder="1010"
                inputMode="numeric"
                maxLength={4}
              />
            </div>
          </div>
        </div>

        {/* Footer buttons */}
        <div className="flex flex-col gap-3 border-t border-border px-6 py-4 flex-shrink-0">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setErrors({})
                setIsEditing(false)
              }}
              className="flex-1"
            >
              {t("cancel")}
            </Button>
            <Button
              onClick={(e) => handleSaveProfile(e)}
              disabled={isSaving}
              className="flex-1"
            >
              {isSaving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {t("save")}
            </Button>
          </div>
          <Button
            variant="ghost"
            onClick={() => setShowResetConfirm(true)}
            className="flex-1 text-red-500 hover:bg-red-50 hover:text-red-600"
          >
            {t("resetData")}
          </Button>
        </div>
      </div>

      {/* Reset confirmation dialog */}
      {showResetConfirm && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isResetting) {
              setShowResetConfirm(false)
              setIsResetting(false)
            }
          }}
        >
          <div 
            className="rounded-lg bg-card p-6 shadow-lg max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-2">
              {t("clearProfile")}
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              {t("clearProfileConfirm")}
            </p>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setShowResetConfirm(false)
                  setIsResetting(false)
                }}
                disabled={isResetting}
                className="flex-1"
              >
                {t("cancel")}
              </Button>
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleResetProfile(e)
                }}
                disabled={isResetting}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white"
              >
                {isResetting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {t("clear")}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Toast notification near cursor */}
      {toast && (
        <div 
          className="fixed z-[100] pointer-events-none animate-in fade-in zoom-in-95 duration-200"
          style={{ left: toastPos.x, top: toastPos.y, transform: "translate(-50%, -100%)" }}
        >
          <div className={`rounded-lg px-3 py-2 text-sm font-medium text-white shadow-xl whitespace-nowrap flex items-center gap-2 ${toast.type === "error" ? "bg-red-400" : "bg-emerald-500"}`}>
            <span>{toast.type === "error" ? "!" : "✓"}</span>
            {toast.message}
          </div>
        </div>
      )}
    </>
  )
}
