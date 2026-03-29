"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/components/auth-provider"
import { useLang, formatEur } from "@/lib/i18n"
import { useFavorites } from "@/components/favorites-provider"
import { useCart } from "@/components/cart-context"
import { products as allProducts } from "@/lib/data"
import { createClient } from "@/lib/supabase/client"
import { 
  User, 
  Heart, 
  Package, 
  MapPin, 
  Settings, 
  LogOut, 
  ChevronRight,
  Loader2,
  ShoppingBag,
  Award,
  RotateCcw,
  Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface Profile {
  first_name?: string
  last_name?: string
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
  const { favorites } = useFavorites()
  const { addToCart } = useCart()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
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
        .select("first_name, last_name")
        .eq("id", user.id)
        .maybeSingle()
      
      setProfile(data)
      setProfileLoading(false)
    }

    if (user) {
      loadProfile()
    }
  }, [user])

  // Load orders (mock data for now - in real app would fetch from DB)
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
    setOrdersLoading(false)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
    router.refresh()
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
      icon: Heart,
      number: favorites.length.toString(),
      label: lang === "ru" ? "Избранное" : "Vēlmju saraksts",
    },
    {
      icon: MapPin,
      number: "0",
      label: lang === "ru" ? "Адреса" : "Adreses",
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
      href: "/account/addresses",
      icon: MapPin,
      label: lang === "ru" ? "Адреса доставки" : "Piegādes adreses",
      description: lang === "ru" ? "Управление адресами" : "Adrešu pārvaldība",
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
      {/* Header: Profile + Logout */}
      <div className="mb-12 flex items-center justify-between rounded-2xl bg-gradient-to-r from-primary/5 to-primary/10 p-6 sm:p-8">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-primary/15 ring-2 ring-primary/30">
            <User className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground sm:text-2xl">
              {displayName}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
            {profileLoading && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                {lang === "ru" ? "Загрузка..." : "Ielāde..."}
              </p>
            )}
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSignOut}
          className="whitespace-nowrap text-sm"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {lang === "ru" ? "Выйти" : "Iziet"}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="mb-12 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
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

      {/* Quick Actions */}
      <div className="mb-12 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        <button
          onClick={() => orders.length > 0 && repeatOrder(orders[0])}
          disabled={orders.length === 0}
          className="flex items-center gap-3 rounded-xl bg-card p-5 sm:p-6 text-left shadow-sm transition-all duration-300 hover:shadow-md hover:bg-primary/5 disabled:opacity-50 disabled:cursor-not-allowed border border-border hover:border-primary/30"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <RotateCcw className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">
              {lang === "ru" ? "Повторить заказ" : "Atkārtot pasūtījumu"}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {lang === "ru" ? "Последний заказ" : "Pēdējais pasūtījums"}
            </p>
          </div>
        </button>

        <Link
          href="/account/favorites"
          className="flex items-center gap-3 rounded-xl bg-card p-5 sm:p-6 text-left shadow-sm transition-all duration-300 hover:shadow-md hover:bg-primary/5 border border-border hover:border-primary/30"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Heart className="h-6 w-6 text-primary fill-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">
              {lang === "ru" ? "Избранное" : "Vēlmju saraksts"}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {favorites.length} {lang === "ru" ? "товаров" : "preces"}
            </p>
          </div>
        </Link>

        <button
          onClick={() => document.querySelector('[aria-label="Shopping Cart"]')?.click()}
          className="flex items-center gap-3 rounded-xl bg-card p-5 sm:p-6 text-left shadow-sm transition-all duration-300 hover:shadow-md hover:bg-primary/5 border border-border hover:border-primary/30"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <ShoppingBag className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">
              {lang === "ru" ? "Корзина" : "Iepirkumu grozs"}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {lang === "ru" ? "Открыть" : "Atvērt"}
            </p>
          </div>
        </button>
      </div>

      {/* Orders History */}
      <div className="mb-12">
        <h2 className="mb-6 text-xl font-bold text-foreground">
          {lang === "ru" ? "История заказов" : "Pasūtījumu vēsture"}
        </h2>

        {ordersLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-border bg-card/50 py-12 text-center">
            <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-foreground font-medium">
              {lang === "ru" ? "У вас пока нет заказов" : "Jums vēl nav pasūtījumu"}
            </p>
            <p className="mt-2 text-sm text-muted-foreground mb-4">
              {lang === "ru" ? "Начните покупки — ваши заказы появятся здесь" : "Sāciet iepirkties — jūsu pasūtījumi parādīsies šeit"}
            </p>
            <Link href="/" className="inline-block">
              <Button size="sm" variant="outline">
                {lang === "ru" ? "Перейти к покупкам" : "Iet uz iepirkšanos"}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusColors = {
                delivered: { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", label: lang === "ru" ? "Доставлен" : "Piegādāts" },
                in_progress: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", label: lang === "ru" ? "В пути" : "Ceļā" },
                cancelled: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", label: lang === "ru" ? "Отменен" : "Atcelts" },
              }
              const status = statusColors[order.status]

              return (
                <div
                  key={order.id}
                  className="rounded-xl border border-border bg-card p-5 sm:p-6 transition-all duration-300 hover:shadow-md"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div>
                      <p className="font-bold text-foreground">{order.orderNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.date).toLocaleDateString(lang === "ru" ? "ru-RU" : "lv-LV")}
                      </p>
                    </div>
                    <div className={`inline-flex rounded-full px-3 py-1 text-sm font-medium border ${status.bg} ${status.border} ${status.text}`}>
                      {status.label}
                    </div>
                    <p className="text-lg font-bold text-foreground">
                      €{order.total.toFixed(2)}
                    </p>
                  </div>

                  <div className="mb-4 flex gap-2">
                    {order.products.slice(0, 3).map((product, i) => (
                      <div
                        key={i}
                        className="relative h-16 w-16 rounded-lg bg-muted overflow-hidden ring-1 ring-border"
                      >
                        {product.image && (
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                    ))}
                    {order.products.length > 3 && (
                      <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted ring-1 ring-border text-sm font-semibold text-foreground">
                        +{order.products.length - 3}
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={() => repeatOrder(order)}
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    {lang === "ru" ? "Повторить заказ" : "Atkārtot pasūtījumu"}
                  </Button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
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
