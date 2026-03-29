"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { useLang } from "@/lib/i18n"
import { useFavorites } from "@/components/favorites-provider"
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
  Award
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface Profile {
  first_name?: string
  last_name?: string
}

export default function AccountPage() {
  const router = useRouter()
  const { user, isLoading: authLoading, signOut } = useAuth()
  const { lang } = useLang()
  const { favorites } = useFavorites()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)

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

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
    router.refresh()
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

  const stats = [
    {
      icon: ShoppingBag,
      number: "0",
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
      number: "0",
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
