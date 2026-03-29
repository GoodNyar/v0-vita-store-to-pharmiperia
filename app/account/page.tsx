"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { useLang } from "@/lib/i18n"
import { useCart } from "@/components/cart-context"
import { products as allProducts } from "@/lib/data"
import { createClient } from "@/lib/supabase/client"
import { 
  User, 
  Heart, 
  Package, 
  Settings, 
  LogOut, 
  ChevronRight,
  Loader2,
  ShoppingBag,
  Award,
  RotateCcw,
  Zap,
  X,
  Edit2
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface Profile {
  id?: string
  first_name?: string
  last_name?: string
  phone?: string
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
        .select("id, first_name, last_name, phone, country, city, address, postal_code")
        .eq("id", user.id)
        .maybeSingle()
      
      if (data) {
        setProfile(data)
        setFormData(data)
      } else {
        setProfile({ id: user.id })
        setFormData({ id: user.id })
      }
      setProfileLoading(false)
    }

    if (user) {
      loadProfile()
    }
  }, [user])

  // Load orders (mock data - used only for "Repeat Order" button)
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
      {
        id: "3",
        orderNumber: "#4519",
        date: "2025-03-10",
        status: "delivered",
        total: 29.99,
        products: [
          { id: "4", name: "Шампунь", image: allProducts[3]?.image || "" },
          { id: "5", name: "Кондиционер", image: allProducts[4]?.image || "" },
          { id: "6", name: "Сыворотка", image: allProducts[5]?.image || "" },
        ],
      },
    ]
    setOrders(mockOrders)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
    router.refresh()
  }

  const handleSaveProfile = async () => {
    if (!user) return
    
    setIsSaving(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          first_name: formData.first_name || "",
          last_name: formData.last_name || "",
          phone: formData.phone || "",
          country: formData.country || "",
          city: formData.city || "",
          address: formData.address || "",
          postal_code: formData.postal_code || "",
        })
      
      if (error) {
        console.error("Error saving profile:", error)
        return
      }
      
      setProfile(formData)
      setIsEditing(false)
    } finally {
      setIsSaving(false)
    }
  }

  const repeatOrder = (order: Order) => {
    order.products.forEach((p) => {
      const product = allProducts.find((prod) => prod.id === p.id)
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

  if (!user) {
    return null
  }

  const displayName = profile?.first_name 
    ? `${profile.first_name} ${profile.last_name || ""}`.trim()
    : user.email?.split("@")[0] || "User"

  const bonusEquivalent = (bonusPoints * 0.01).toFixed(2)
  const bonusProgress = (bonusPoints / bonusMax) * 100
  const bonusRemaining = bonusMax - bonusPoints

  const stats = [
    {
      icon: ShoppingBag,
      number: orders.length.toString(),
      label: lang === "ru" ? "Заказы" : "Pasūtījumi",
    },
    {
      icon: Award,
      number: bonusPoints.toString(),
      label: lang === "ru" ? "Бонусы" : "Bonusi",
    },
  ]

  const menuItems = [
    {
      href: "/account/orders",
      icon: Package,
      label: lang === "ru" ? "Мои заказы" : "Mani pasūtījumi",
      description: lang === "ru" ? "История и статус заказов" : "Pasūtījumu vēsture",
    },
    {
      href: "/account/favorites",
      icon: Heart,
      label: lang === "ru" ? "Избранное" : "Vēlmju saraksts",
      description: lang === "ru" ? "Сохранённые товары" : "Saglabātās preces",
    },
    {
      href: "/account/settings",
      icon: Settings,
      label: lang === "ru" ? "Настройки" : "Iestatījumi",
      description: lang === "ru" ? "Профиль и безопасность" : "Profils un drošība",
    },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
      {/* Enhanced Hero Block with Gradient */}
      <div className="mb-12 rounded-3xl overflow-hidden shadow-lg">
        <div className="relative bg-gradient-to-r from-primary via-primary/60 to-primary/20 p-8 sm:p-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            {/* Left: Profile Info */}
            <div className="flex items-start gap-4 sm:gap-6 flex-1">
              <div className="flex h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm ring-2 ring-white/30 shadow-lg">
                <User className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  {displayName}
                </h1>
                <p className="mt-2 text-sm sm:text-base text-white/90">{user.email}</p>
                
                {/* Additional Info: Phone & City (only if exists) */}
                {(profile?.phone || profile?.city) && (
                  <div className="mt-3 flex flex-col gap-1 text-sm text-white/80">
                    {profile?.phone && <span>{profile.phone}</span>}
                    {profile?.city && <span>{profile.city}{profile?.country ? `, ${profile.country}` : ""}</span>}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Buttons */}
            <div className="flex flex-col sm:flex-col gap-2 w-full sm:w-auto">
              <Button
                onClick={() => setIsEditing(true)}
                variant="secondary"
                size="sm"
                className="whitespace-nowrap text-sm w-full sm:w-auto"
              >
                <Edit2 className="mr-2 h-4 w-4" />
                {lang === "ru" ? "Редактировать" : "Rediģēt"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="whitespace-nowrap text-sm w-full sm:w-auto bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <LogOut className="mr-2 h-4 w-4" />
                {lang === "ru" ? "Выйти" : "Iziet"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-card shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border p-6">
              <h2 className="text-xl font-bold text-foreground">
                {lang === "ru" ? "Редактировать профиль" : "Rediģēt profilu"}
              </h2>
              <button
                onClick={() => setIsEditing(false)}
                className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    {lang === "ru" ? "Имя" : "Vārds"}
                  </label>
                  <input
                    type="text"
                    value={formData.first_name || ""}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    placeholder={lang === "ru" ? "Иван" : "Vārds"}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    {lang === "ru" ? "Фамилия" : "Uzvārds"}
                  </label>
                  <input
                    type="text"
                    value={formData.last_name || ""}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    placeholder={lang === "ru" ? "Петров" : "Uzvārds"}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    {lang === "ru" ? "Телефон" : "Tālrunis"}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone || ""}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+371 25123456"
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Email (disabled) */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    {lang === "ru" ? "Email" : "E-pasts"}
                  </label>
                  <input
                    type="email"
                    value={user.email || ""}
                    disabled
                    className="w-full rounded-lg border border-border bg-muted px-4 py-2.5 text-muted-foreground cursor-not-allowed"
                  />
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    {lang === "ru" ? "Страна" : "Valsts"}
                  </label>
                  <input
                    type="text"
                    value={formData.country || ""}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder={lang === "ru" ? "Латвия" : "Latvija"}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    {lang === "ru" ? "Город" : "Pilsēta"}
                  </label>
                  <input
                    type="text"
                    value={formData.city || ""}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder={lang === "ru" ? "Рига" : "Rīga"}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Address */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    {lang === "ru" ? "Адрес" : "Adrese"}
                  </label>
                  <input
                    type="text"
                    value={formData.address || ""}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder={lang === "ru" ? "ул. Гагарина, 10" : "Gagarīna iela 10"}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Postal Code */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    {lang === "ru" ? "Почтовый индекс" : "Pasta indekss"}
                  </label>
                  <input
                    type="text"
                    value={formData.postal_code || ""}
                    onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                    placeholder="LV-1234"
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 border-t border-border p-6 justify-end">
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
              >
                {lang === "ru" ? "Отмена" : "Atcelt"}
              </Button>
              <Button
                onClick={handleSaveProfile}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {lang === "ru" ? "Сохранение..." : "Saglabā..."}
                  </>
                ) : (
                  lang === "ru" ? "Сохранить" : "Saglabāt"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards - Only Orders and Bonus */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="group rounded-xl bg-card p-4 sm:p-6 text-center shadow-sm transition-all duration-300 hover:shadow-md hover:ring-1 hover:ring-primary/30"
          >
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/15">
              <stat.icon className="h-6 w-6 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">{stat.number}</p>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Bonus Block */}
      <div className="mb-12 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 p-6 sm:p-8 border border-accent/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/20">
            <Zap className="h-6 w-6 text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">
              {lang === "ru" ? "Ваши бонусы" : "Jūsu bonusi"}
            </h3>
            <p className="text-sm text-muted-foreground">1 балл = 0.01 €</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6 sm:grid-cols-3">
          <div className="rounded-lg bg-card p-4">
            <p className="text-sm text-muted-foreground">
              {lang === "ru" ? "Баланс" : "Bilance"}
            </p>
            <p className="text-2xl font-bold text-accent mt-1">{bonusPoints}</p>
          </div>
          <div className="rounded-lg bg-card p-4">
            <p className="text-sm text-muted-foreground">
              {lang === "ru" ? "Эквивалент" : "Ekvivalents"}
            </p>
            <p className="text-2xl font-bold text-accent mt-1">€{bonusEquivalent}</p>
          </div>
          <div className="rounded-lg bg-card p-4 col-span-2 sm:col-span-1">
            <p className="text-sm text-muted-foreground">
              {lang === "ru" ? "До следующего уровня" : "Līdz nākamajam"}
            </p>
            <p className="text-2xl font-bold text-foreground mt-1">{bonusRemaining}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs sm:text-sm">
            <span className="font-medium">{lang === "ru" ? "Прогресс" : "Progresa"}</span>
            <span className="text-muted-foreground">{bonusProgress.toFixed(0)}%</span>
          </div>
          <div className="h-3 rounded-full bg-card overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent to-accent/80 transition-all duration-500"
              style={{ width: `${bonusProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main CTA: Repeat Order */}
      <div className="mb-12">
        <button
          onClick={() => orders.length > 0 && repeatOrder(orders[0])}
          disabled={orders.length === 0}
          className="w-full rounded-2xl bg-gradient-to-r from-primary to-primary/80 p-6 sm:p-8 text-left shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <RotateCcw className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white">
                {lang === "ru" ? "Повторить последний заказ" : "Atkārtot pēdējo pasūtījumu"}
              </h3>
              <p className="mt-1 text-sm text-white/80">
                {orders.length > 0 
                  ? `${lang === "ru" ? "Сумма" : "Summa"}: €${orders[0].total.toFixed(2)}`
                  : lang === "ru" ? "У вас пока нет заказов" : "Jums vēl nav pasūtījumu"}
              </p>
            </div>
            <ChevronRight className="h-6 w-6 text-white flex-shrink-0" />
          </div>
        </button>
      </div>

      {/* Navigation Cards Grid - 3 items only */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex flex-col rounded-xl border border-border bg-card p-5 sm:p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/30 hover:bg-primary/5"
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/15">
              <item.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground transition-colors group-hover:text-primary">
              {item.label}
            </h3>
            <p className="mt-1 flex-1 text-xs sm:text-sm text-muted-foreground">
              {item.description}
            </p>
            <div className="mt-3 flex items-center text-primary opacity-0 transition-all group-hover:opacity-100">
              <ChevronRight className="h-4 w-4" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
