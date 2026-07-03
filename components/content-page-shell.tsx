"use client"

import { LangProvider } from "@/lib/i18n"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CartDrawer } from "@/components/cart-drawer"
import type { Locale } from "@/lib/i18n/config"

export function ContentPageShell({
  locale,
  children,
}: {
  locale: Locale
  children: React.ReactNode
}) {
  return (
    <LangProvider initialLang={locale}>
      <div className="flex min-h-screen flex-col bg-background">
        <SiteHeader />
        <CartDrawer />
        {children}
        <SiteFooter />
      </div>
    </LangProvider>
  )
}