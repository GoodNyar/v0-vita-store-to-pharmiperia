"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CartDrawer } from "@/components/cart-drawer"
import { useLang } from "@/lib/i18n"
import { Package, Search } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

function TrackContent() {
  const { t } = useLang()
  const [trackingNumber, setTrackingNumber] = useState("")
  const [searched, setSearched] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (trackingNumber.trim()) setSearched(true)
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Package className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">{t("trackTitle")}</h1>
        <p className="mt-2 text-muted-foreground">{t("trackSubtitle")}</p>

        <form onSubmit={handleSearch} className="mt-8 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={trackingNumber}
              onChange={e => setTrackingNumber(e.target.value)}
              placeholder={t("trackPlaceholder")}
              className="h-12 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button type="submit" className="h-12 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
            {t("trackSearch")}
          </button>
        </form>

        {searched && (
          <div className="mt-8 rounded-xl border border-border bg-card p-8 text-center">
            <p className="text-sm text-muted-foreground">{t("trackNotFound1")} <span className="font-semibold text-foreground">{`«${trackingNumber}»`}</span> {t("trackNotFound2")}</p>
            <p className="mt-2 text-sm text-muted-foreground">{t("trackCheckNumber")}</p>
            <div className="mt-4 flex justify-center gap-3">
              <Link href="/account/orders" className="inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                {t("trackMyOrders")}
              </Link>
              <Link href="/contact" className="inline-flex h-10 items-center rounded-lg border border-border bg-background px-4 text-sm font-medium hover:bg-secondary">
                {t("trackWriteUs")}
              </Link>
            </div>
          </div>
        )}

        {!searched && (
          <div className="mt-10 text-left space-y-3">
            <p className="text-sm font-semibold text-foreground">{t("trackWhereTitle")}</p>
            <p className="text-sm text-muted-foreground">{t("trackWhereText")}</p>
            <p className="text-sm text-muted-foreground">{t("trackLoggedIn1")} <Link href="/account/orders" className="text-primary hover:underline">{t("trackLoggedIn2")}</Link> {t("trackLoggedIn3")}</p>
          </div>
        )}
      </div>
    </main>
  )
}

export default function TrackPage() {
  return (
    <>
      <SiteHeader />
      <CartDrawer />
      <TrackContent />
      <SiteFooter />
    </>
  )
}
