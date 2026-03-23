"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { 
  Leaf, User, Package, Heart, MapPin, Settings, LogOut, 
  ChevronRight, Loader2, Gift, Bell, CreditCard
} from "lucide-react"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface Profile {
  first_name: string | null
  last_name: string | null
  email: string | null
  phone: string | null
}

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push("/auth/login")
        return
      }

      setUser(user)

      // Fetch profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      setProfile(profile)
      setLoading(false)
    }

    getUser()
  }, [router])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const menuItems = [
    { icon: Package, label: "Мои заказы", href: "/account/orders", badge: "2" },
    { icon: Heart, label: "Избранное", href: "/account/favorites" },
    { icon: MapPin, label: "Адреса доставки", href: "/account/addresses" },
    { icon: CreditCard, label: "Способы оплаты", href: "/account/payment" },
    { icon: Gift, label: "Бонусы и промокоды", href: "/account/bonuses", badge: "150" },
    { icon: Bell, label: "Уведомления", href: "/account/notifications" },
    { icon: Settings, label: "Настройки", href: "/account/settings" },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-1.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Leaf className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Pharmiperia</span>
          </Link>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Выйти
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 py-8">
        <div className="mx-auto max-w-3xl px-4">
          {/* Profile card */}
          <div className="mb-6 rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <h1 className="text-xl font-bold text-foreground">
                  {profile?.first_name || "Пользователь"} {profile?.last_name || ""}
                </h1>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
              <Link href="/account/profile">
                <Button variant="outline" size="sm">
                  Редактировать
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-3 gap-4 border-t border-border pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">3</p>
                <p className="text-xs text-muted-foreground">Заказов</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">150</p>
                <p className="text-xs text-muted-foreground">Бонусов</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">5</p>
                <p className="text-xs text-muted-foreground">В избранном</p>
              </div>
            </div>
          </div>

          {/* Promo banner */}
          <div className="mb-6 rounded-xl border border-primary/30 bg-primary/5 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Скидка 10% на первый заказ!</p>
                <p className="text-sm text-muted-foreground">Используйте код: <span className="font-mono font-bold text-primary">WELCOME10</span></p>
              </div>
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Применить
              </Button>
            </div>
          </div>

          {/* Menu */}
          <div className="rounded-2xl border border-border bg-card">
            {menuItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-6 py-4 transition-colors hover:bg-muted ${
                  index !== menuItems.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <item.icon className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium text-foreground">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.badge && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </div>

          {/* Logout button mobile */}
          <Button
            variant="outline"
            className="mt-6 h-12 w-full border-destructive/50 text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Выйти из аккаунта
          </Button>
        </div>
      </main>
    </div>
  )
}
