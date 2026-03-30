"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/components/auth-provider"
import { useLang } from "@/lib/i18n"
import { useCart } from "@/components/cart-context"
import { products as allProducts, type Product } from "@/lib/data"
import { createClient } from "@/lib/supabase/client"
import { 
  User, 
  Heart, 
  Package, 
  Settings, 
  LogOut, 
  ChevronRight,
  Loader2,
  Award,
  RotateCcw,
  Plus,
  Edit2,
  X,
  Star,
  Zap
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

export default function AccountPage() {
  const router = useRouter()
  const { user, isLoading: authLoading, signOut } = useAuth()
  const { lang } = useLang()
  const { addToCart } = useCart()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState<Profile>({})
  const [orders, setOrders] = useState<Order[]>([])
  const [bonusPoints, setBonusPoints] = useState(150)
  const bonusMax = 200
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([])
  const [toast, setToast] = useState<string | null>(null)
  const [toastPos, setToastPos] = useState({ x: 0, y: 0 })
  const [savedData, setSavedData] = useState<Profile | null>(null)

  // Show toast notification near cursor
  const showToast = (message: string, e?: React.MouseEvent) => {
    if (e) {
      setToastPos({ x: e.clientX, y: e.clientY - 50 })
    }
    setToast(message)
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

  // Load profile
  useEffect(() => {
    async function loadProfile() {
      if (!user) return
      
      const supabase = createClient()
      const { data } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, phone, email, country, city, address, postal_code")
        .eq("id", user.id)
        .maybeSingle()
      
      if (data) {
        setProfile(data)
        setFormData(data)
        setSavedData(data)
      } else {
        setProfile({ id: user.id })
        setFormData({ id: user.id })
        setSavedData({ id: user.id })
      }
      setProfileLoading(false)
    }

    if (user) {
      loadProfile()
    }
  }, [user])

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
      showToast(lang === "ru" ? "Данные уже сохранены" : "Dati jau saglabāti", e)
      setIsEditing(false)
      return
    }

    setIsSaving(true)
    
    const supabase = createClient()
    
    // Try to save with all fields first
    let { error } = await supabase
      .from("profiles")
      .upsert(
        {
          id: user.id,
          first_name: formData.first_name || null,
          last_name: formData.last_name || null,
          phone: formData.phone || null,
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
            phone: formData.phone || null,
          },
          { onConflict: "id" }
        )
      error = error2
    }

    setIsSaving(false)

    if (error) {
      console.error("[v0] Save error:", error)
      showToast(lang === "ru" ? "Ошибка сохранения" : "Kļūda saglabājot", e)
      return
    }

    // Update local state with all fields (even if not saved to DB yet)
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
    setIsEditing(false)
    showToast(lang === "ru" ? "Профиль обновлен ✓" : "Profils atjaunināts ✓", e)
  }

    setIsSaving(true)
    
    const supabase = createClient()
    const { error } = await supabase
      .from("profiles")
      .upsert(
        {
          id: user.id,
          first_name: formData.first_name || null,
          last_name: formData.last_name || null,
          phone: formData.phone || null,
          country: "Latvija",
          city: formData.city || null,
          address: formData.address || null,
          postal_code: formData.postal_code || null,
        },
        { onConflict: "id" }
      )

    setIsSaving(false)

    if (error) {
      showToast(lang === "ru" ? "Ошибка сохранения" : "Kļūda saglabājot", e)
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
    setIsEditing(false)
    showToast(lang === "ru" ? "Профиль обновлен" : "Profils atjaunināts", e)
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
    router.refresh()
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

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      {/* ===== HERO SECTION ===== */}
      <div className="mb-16 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 p-8 sm:p-12 border border-slate-200/50">
        <div className="flex flex-col gap-8 sm:gap-12 sm:flex-row sm:items-start sm:justify-between">
          {/* Left: Profile Info */}
          <div className="flex items-start gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex-shrink-0">
              <User className="h-10 w-10 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground mb-0.5">{displayName}</h1>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              {profile?.phone && (
                <p className="text-sm text-muted-foreground">{profile.phone}</p>
              )}
              {profile?.country && (
                <p className="text-sm text-muted-foreground">{lang === "ru" ? "Латвия" : "Latvija"}</p>
              )}
              {profile?.city && (
                <p className="text-sm text-muted-foreground">{profile.city}</p>
              )}
              {profile?.postal_code && (
                <p className="text-sm text-muted-foreground">{profile.postal_code}</p>
              )}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex gap-3 sm:flex-col-reverse w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="flex-1 sm:flex-none"
            >
              <LogOut className="mr-2 h-4 w-4" />
              {lang === "ru" ? "Выйти" : "Iziet"}
            </Button>
            <Button
              size="sm"
              onClick={() => setIsEditing(true)}
              className="flex-1 sm:flex-none"
            >
              <Edit2 className="mr-2 h-4 w-4" />
              {lang === "ru" ? "Профиль" : "Profils"}
            </Button>
          </div>
        </div>
      </div>

      {/* ===== BONUS SECTION ===== */}
      <div className="mb-16 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 p-8 border border-amber-200/30">
        <div className="flex items-start justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-5 w-5 text-amber-600" />
              <h2 className="text-xl font-bold text-foreground">
                {lang === "ru" ? "Ваши бонусы" : "Jūsu bonusi"}
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">1 балл = 0.01 €</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          <div className="rounded-lg bg-white/60 backdrop-blur-sm p-4 border border-white/40">
            <p className="text-xs text-muted-foreground mb-1">{lang === "ru" ? "Баланс" : "Bilance"}</p>
            <p className="text-3xl font-bold text-amber-600">{bonusPoints}</p>
          </div>
          <div className="rounded-lg bg-white/60 backdrop-blur-sm p-4 border border-white/40">
            <p className="text-xs text-muted-foreground mb-1">{lang === "ru" ? "Значит" : "Nozīmē"}</p>
            <p className="text-3xl font-bold text-amber-600">€{bonusEquivalent}</p>
          </div>
          <div className="rounded-lg bg-white/60 backdrop-blur-sm p-4 border border-white/40 col-span-2 sm:col-span-1">
            <p className="text-xs text-muted-foreground mb-1">{lang === "ru" ? "До следующего" : "Līdz nākamajam"}</p>
            <p className="text-2xl font-bold text-foreground">{bonusMax - bonusPoints}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="h-2 rounded-full bg-white/40 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
              style={{ width: `${bonusProgress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{bonusProgress.toFixed(0)}%</span>
            <span>{lang === "ru" ? "До следующего уровня" : "Līdz nākamajam lyģim"}</span>
          </div>
        </div>
      </div>

      {/* ===== MAIN CTA: REPEAT ORDER ===== */}
      {lastOrder && (
        <div className="mb-16">
          <button
            onClick={() => repeatOrder(lastOrder)}
            className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-primary/95 to-primary/90 p-8 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] active:scale-95"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm flex-shrink-0">
                <RotateCcw className="h-10 w-10 text-white" />
              </div>
              
              <div className="flex-1 text-left">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {lang === "ru" ? "Повторить последний заказ" : "Atkārtot pēdējo pasūtījumu"}
                </h3>
                <div className="flex items-center gap-4">
                  {lastOrder.products.slice(0, 3).map((p, i) => (
                    <div
                      key={i}
                      className="relative h-12 w-12 rounded-lg bg-white/20 overflow-hidden ring-1 ring-white/30"
                    >
                      {p.image && (
                        <Image
                          src={p.image}
                          alt={p.name}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                  ))}
                  {lastOrder.products.length > 3 && (
                    <div className="text-sm font-semibold text-white">
                      +{lastOrder.products.length - 3}
                    </div>
                  )}
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <p className="text-white/80 text-sm mb-1">{lang === "ru" ? "Сумма" : "Summa"}</p>
                <p className="text-3xl font-bold text-white mb-3">€{lastOrder.total.toFixed(2)}</p>
                <div className="flex items-center justify-end text-white gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm font-semibold">{lang === "ru" ? "Повторить" : "Atkārtot"}</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </button>
        </div>
      )}

      {/* ===== RECOMMENDED PRODUCTS ===== */}
      {recommendedProducts.length > 0 && (
        <div className="mb-16">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {lang === "ru" ? "Рекомендуем вам" : "Mēs iesakām"}
            </h2>
            <p className="text-muted-foreground">
              {lang === "ru" ? "Популярные товары и�� ваших категорий" : "Populāras preces no jūsu kategorijām"}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {recommendedProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group flex flex-col rounded-xl border border-border bg-card overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/50"
              >
                <div className="relative h-40 sm:h-48 bg-muted overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-110"
                  />
                </div>

                <div className="flex flex-col gap-2 p-3 sm:p-4 flex-1">
                  <p className="text-xs font-semibold text-primary">{product.brand}</p>
                  <p className="text-sm font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </p>
                  
                  <div className="flex items-center gap-1 mt-auto mb-2">
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
                    <span className="text-xs text-muted-foreground ml-1">
                      ({product.reviewCount})
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-1">
                      <span className="font-bold text-foreground">€{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-muted-foreground line-through">
                          €{product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      addToCart(product)
                    }}
                    className="mt-3 w-full flex items-center justify-center gap-1 rounded-lg bg-primary/10 text-primary py-2 text-xs font-semibold transition-all hover:bg-primary hover:text-primary-foreground"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    {lang === "ru" ? "Добавить" : "Pievienot"}
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ===== QUICK ACCESS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/account/orders"
          className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:shadow-md hover:border-primary/30 hover:bg-primary/5"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors">
            <Package className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {lang === "ru" ? "Мои заказы" : "Mani pasūtījumi"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {lang === "ru" ? "История покупок" : "Pirkumu vēsture"}
            </p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
        </Link>

        <Link
          href="/account/favorites"
          className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:shadow-md hover:border-primary/30 hover:bg-primary/5"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors">
            <Heart className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {lang === "ru" ? "Избранное" : "Vēlmju saraksts"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {lang === "ru" ? "Сохранённые товары" : "Saglabātās preces"}
            </p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
        </Link>

        <Link
          href="/account/settings"
          className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:shadow-md hover:border-primary/30 hover:bg-primary/5"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors">
            <Settings className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {lang === "ru" ? "Настройки" : "Iestatījumi"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {lang === "ru" ? "Профиль и адреса" : "Profils un adreses"}
            </p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
        </Link>
      </div>

      {/* ===== EDIT PROFILE — SLIDE-IN DRAWER (right side) ===== */}
      {/* Backdrop */}
      <div
        onClick={() => { setFormData(savedData || {}); setIsEditing(false) }}
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 ${isEditing ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      />
      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-background shadow-2xl border-l border-border transition-transform duration-300 ease-out ${isEditing ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4 flex-shrink-0">
          <h2 className="text-lg font-bold text-foreground">
            {lang === "ru" ? "Редактировать профиль" : "Rediģēt profilu"}
          </h2>
          <button
            onClick={() => { setFormData(savedData || {}); setIsEditing(false) }}
            className="rounded-lg p-2 transition-colors hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form — compact, no scroll needed */}
        <div className="flex-1 px-6 py-4 space-y-3 overflow-hidden">

          {/* Row: Имя + Фамилия */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">
                {lang === "ru" ? "Имя" : "Vārds"} <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                name="given-name"
                autoComplete="given-name"
                value={formData.first_name || ""}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={lang === "ru" ? "Имя" : "Vārds"}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">
                {lang === "ru" ? "Фамилия" : "Uzvārds"} <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                name="family-name"
                autoComplete="family-name"
                value={formData.last_name || ""}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={lang === "ru" ? "Фамилия" : "Uzvārds"}
              />
            </div>
          </div>

          {/* Телефон */}
          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">
              {lang === "ru" ? "Мобильный телефон" : "Mobilā tālruņa numurs"} <span className="text-primary">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              autoComplete="tel"
              value={formData.phone || ""}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="+371 2X XXX XXX"
            />
          </div>

          {/* Email — read only */}
          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">
              {lang === "ru" ? "E-mail" : "E-pasta adrese"} <span className="text-primary">*</span>
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
                {lang === "ru" ? "Страна" : "Valsts"} <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                value={lang === "ru" ? "Латвия" : "Latvija"}
                disabled
                className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-muted-foreground cursor-not-allowed"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">
                {lang === "ru" ? "Город" : "Pilsēta"} <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                name="city"
                autoComplete="address-level2"
                value={formData.city || ""}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Rīga"
              />
            </div>
          </div>

          {/* Адрес */}
          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">
              {lang === "ru" ? "Адрес" : "Adrese"} <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              name="street-address"
              autoComplete="street-address"
              value={formData.address || ""}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder={lang === "ru" ? "Улица, номер дома" : "Iela, mājas numurs"}
            />
          </div>

          {/* Почтовый индекс */}
          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">
              {lang === "ru" ? "Почтовый индекс" : "Pasta indekss"} <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              name="postal-code"
              autoComplete="postal-code"
              value={formData.postal_code || ""}
              onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="LV-1010"
            />
          </div>
        </div>

        {/* Footer buttons */}
        <div className="flex gap-3 border-t border-border px-6 py-4 flex-shrink-0">
          <Button
            variant="outline"
            onClick={() => {
              // Reset to saved data or clear all except email
              if (savedData) {
                setFormData(savedData)
              } else {
                setFormData({
                  id: user?.id,
                  first_name: "",
                  last_name: "",
                  phone: "",
                  city: "",
                  address: "",
                  postal_code: "",
                })
              }
              setIsEditing(false)
            }}
            className="flex-1"
          >
            {lang === "ru" ? "Отмена" : "Atcelt"}
          </Button>
          <Button
            onClick={(e) => handleSaveProfile(e)}
            disabled={isSaving}
            className="flex-1"
          >
            {isSaving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {lang === "ru" ? "Сохранить" : "Saglabāt"}
          </Button>
        </div>
      </div>

      {/* Toast notification near cursor */}
      {toast && (
        <div 
          className="fixed z-[100] pointer-events-none animate-in fade-in zoom-in-95 duration-200"
          style={{ left: toastPos.x, top: toastPos.y, transform: "translate(-50%, -100%)" }}
        >
          <div className="rounded-lg bg-foreground px-3 py-2 text-sm font-medium text-background shadow-xl whitespace-nowrap">
            {toast}
          </div>
        </div>
      )}
    </div>
  )
}
