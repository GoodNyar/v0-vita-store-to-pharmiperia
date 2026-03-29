"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PromoBar } from "@/components/promo-bar"
import { CartDrawer } from "@/components/cart-drawer"
import { CartProvider } from "@/components/cart-context"
import { LangProvider } from "@/lib/i18n"
import { Package, Search } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

export default function TrackPage() {
  const [trackingNumber, setTrackingNumber] = useState("")
  const [searched, setSearched] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (trackingNumber.trim()) setSearched(true)
  }

  return (
    <LangProvider>
      <CartProvider>
        <PromoBar />
        <SiteHeader />
        <CartDrawer />
        <main className="min-h-screen bg-background">
          <div className="mx-auto max-w-2xl px-4 py-16 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Package className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Отследить заказ</h1>
            <p className="mt-2 text-muted-foreground">Введите номер заказа или трек-номер из письма</p>

            <form onSubmit={handleSearch} className="mt-8 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={e => setTrackingNumber(e.target.value)}
                  placeholder="Номер заказа или трек-номер..."
                  className="h-12 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <button type="submit" className="h-12 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
                Найти
              </button>
            </form>

            {searched && (
              <div className="mt-8 rounded-xl border border-border bg-card p-8 text-center">
                <p className="text-sm text-muted-foreground">Заказ с номером <span className="font-semibold text-foreground">«{trackingNumber}»</span> не найден.</p>
                <p className="mt-2 text-sm text-muted-foreground">Проверьте номер или войдите в аккаунт для просмотра заказов.</p>
                <div className="mt-4 flex justify-center gap-3">
                  <Link href="/account/orders" className="inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                    Мои заказы
                  </Link>
                  <Link href="/contact" className="inline-flex h-10 items-center rounded-lg border border-border bg-background px-4 text-sm font-medium hover:bg-secondary">
                    Написать нам
                  </Link>
                </div>
              </div>
            )}

            {!searched && (
              <div className="mt-10 text-left space-y-3">
                <p className="text-sm font-semibold text-foreground">Где найти номер заказа?</p>
                <p className="text-sm text-muted-foreground">Номер заказа указан в письме-подтверждении, которое мы отправили на ваш email после оплаты. Трек-номер придёт отдельно после отправки посылки.</p>
                <p className="text-sm text-muted-foreground">Если вы зарегистрированы — <Link href="/account/orders" className="text-primary hover:underline">войдите в аккаунт</Link> и посмотрите историю заказов.</p>
              </div>
            )}
          </div>
        </main>
        <SiteFooter />
      </CartProvider>
    </LangProvider>
  )
}
