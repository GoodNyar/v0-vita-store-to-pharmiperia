"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CartDrawer } from "@/components/cart-drawer"
import { CartProvider } from "@/components/cart-context"
import { LangProvider, useLang } from "@/lib/i18n"
import { Lock, Database, Eye, Shield } from "lucide-react"

function DataSecurityContent() {
  const { t } = useLang()
  const items = [
    { icon: Lock, title: t("dataSec1Title"), text: t("dataSec1Text") },
    { icon: Database, title: t("dataSec2Title"), text: t("dataSec2Text") },
    { icon: Eye, title: t("dataSec3Title"), text: t("dataSec3Text") },
    { icon: Shield, title: t("dataSec4Title"), text: t("dataSec4Text") },
  ]

  return (
    <>
      <SiteHeader />
      <CartDrawer />
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <h1 className="text-3xl font-bold text-foreground">{t("dataSecTitle")}</h1>
          <p className="mt-2 text-muted-foreground">{t("dataSecSubtitle")}</p>

          <div className="mt-8 space-y-6">
            {items.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-bold text-foreground">{title}</h2>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
              </div>
            ))}

            <p className="text-xs text-muted-foreground text-center">{t("dataSecFooter")}</p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}

export default function DataSecurityPage() {
  return (
    <LangProvider>
      <CartProvider>
        <DataSecurityContent />
      </CartProvider>
    </LangProvider>
  )
}
