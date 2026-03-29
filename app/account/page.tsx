"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { useLang } from "@/lib/i18n"
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
  ShoppingBag
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

  const menuItems = [
    {
      href: "/account/orders",
      icon: Package,
      label: lang === "ru" ? "Мои заказы" : "Mani pasūtījumi",
      description: lang === "ru" ? "История и статус заказов" : "Pasūtījumu vēsture un statuss",
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
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-10">
      {/* User profile header */}
      <div className="mb-8 flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 sm:mb-0 sm:mr-6">
          <User className="h-10 w-10 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            {lang === "ru" ? "Привет" : "Sveiks"}, {displayName}!
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
          {profileLoading && (
            <p className="mt-1 text-xs text-muted-foreground">
              {lang === "ru" ? "Загрузка профиля..." : "Profils tiek ielādēts..."}
            </p>
          )}
        </div>
      </div>

      {/* Quick stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <ShoppingBag className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
          <p className="text-2xl font-bold text-foreground">0</p>
          <p className="text-xs text-muted-foreground">
            {lang === "ru" ? "Заказов" : "Pasūtījumi"}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <Heart className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
          <p className="text-2xl font-bold text-foreground">0</p>
          <p className="text-xs text-muted-foreground">
            {lang === "ru" ? "В избранном" : "Izlasē"}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <MapPin className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
          <p className="text-2xl font-bold text-foreground">0</p>
          <p className="text-xs text-muted-foreground">
            {lang === "ru" ? "Адресов" : "Adreses"}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <div className="mx-auto mb-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            %
          </div>
          <p className="text-2xl font-bold text-foreground">0</p>
          <p className="text-xs text-muted-foreground">
            {lang === "ru" ? "Бонусов" : "Bonusi"}
          </p>
        </div>
      </div>

      {/* Menu items */}
      <div className="mb-8 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Link>
        ))}
      </div>

      {/* Sign out button */}
      <Button
        variant="outline"
        className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
        onClick={handleSignOut}
      >
        <LogOut className="mr-2 h-4 w-4" />
        {lang === "ru" ? "Выйти из аккаунта" : "Iziet no konta"}
      </Button>
    </div>
  )
}
