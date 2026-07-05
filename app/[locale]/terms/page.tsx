"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CartDrawer } from "@/components/cart-drawer"
import { useLang } from "@/lib/i18n"

function TermsContent() {
  const { t } = useLang()
  const sections = [
    { title: t("terms1Title"), text: t("terms1Text") },
    { title: t("terms2Title"), text: t("terms2Text") },
    { title: t("terms3Title"), text: t("terms3Text") },
    { title: t("terms4Title"), text: t("terms4Text") },
    { title: t("terms5Title"), text: t("terms5Text") },
    { title: t("terms6Title"), text: t("terms6Text") },
    { title: t("terms7Title"), text: t("terms7Text") },
    { title: t("terms8Title"), text: t("terms8Text") },
  ]

  return (
    <>
      <SiteHeader />
      <CartDrawer />
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <h1 className="text-3xl font-bold text-foreground">{t("termsTitle")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("legalLastUpdated")}</p>

          <div className="mt-8 space-y-6">
            {sections.map(({ title, text }) => (
              <div key={title} className="border-b border-border pb-6 last:border-0">
                <h2 className="text-base font-bold text-foreground">{title}</h2>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}

export default function TermsPage() {
  return <TermsContent />
}
