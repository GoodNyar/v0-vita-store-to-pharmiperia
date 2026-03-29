'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { 
  User, Package, Heart, MapPin, Settings, LogOut, 
  ChevronRight, Gift, Bell, CreditCard
} from 'lucide-react'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface Profile {
  id?: string
  first_name?: string | null
  last_name?: string | null
  email?: string | null
  phone?: string | null
}

interface AccountContentProps {
  initialUser: SupabaseUser
  initialProfile: Profile | null
}

export default function AccountContent({ initialUser, initialProfile }: AccountContentProps) {
  const router = useRouter()
  const [profile] = useState<Profile | null>(initialProfile)

  const handleLogout = async () => {
    const supabase = createClient()
    console.log('[v0] Client: Logging out...')
    await supabase.auth.signOut()
    console.log('[v0] Client: Logout complete')
    router.push('/')
    router.refresh()
  }

  const menuItems = [
    { icon: Package, label: 'Мои заказы', href: '/account/orders', badge: '2' },
    { icon: Heart, label: 'Избранное', href: '/account/favorites' },
    { icon: MapPin, label: 'Адреса доставки', href: '/account/addresses' },
    { icon: CreditCard, label: 'Способы оплаты', href: '/account/payment' },
    { icon: Gift, label: 'Бонусы и промокоды', href: '/account/bonuses', badge: '150' },
    { icon: Bell, label: 'Уведомления', href: '/account/notifications' },
    { icon: Settings, label: 'Настройки', href: '/account/settings' },
  ]

  const displayName = profile?.first_name || profile?.last_name 
    ? `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim()
    : initialUser.email?.split('@')[0] || 'Пользователь'

  return (
    <main className="flex-1 py-8">
      <div className="mx-auto max-w-3xl px-4">
        {/* Profile card */}
        <div className="mb-6 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground">{displayName}</h1>
              <p className="text-sm text-muted-foreground">{initialUser.email}</p>
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
                index !== menuItems.length - 1 ? 'border-b border-border' : ''
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

        {/* Logout button */}
        <div className="mt-6 flex gap-3">
          <Button
            variant="outline"
            className="h-12 flex-1 border-destructive/50 text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Выйти из аккаунта
          </Button>
        </div>
      </div>
    </main>
  )
}
