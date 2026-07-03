"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CartDrawer } from "@/components/cart-drawer"
import { useLang } from "@/lib/i18n"
import { getSupportEmail } from "@/lib/site"

function CookiesContent() {
  const { t } = useLang()
  const sections = [
    { title: t("cookies1Title"), text: t("cookies1Text") },
    { title: t("cookies2Title"), text: t("cookies2Text") },
    { title: t("cookies3Title"), text: t("cookies3Text") },
    { title: t("cookies4Title"), text: t("cookies4Text") },
    { title: t("cookies5Title"), text: t("cookies5Text") },
  ]

  return (
    <>
      <SiteHeader />
      <CartDrawer />
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <h1 className="text-3xl font-bold text-foreground">{t("cookiesTitle")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("legalLastUpdated")}</p>

          <div className="mt-8 space-y-6">
            {sections.map(({ title, text }) => (
              <div key={title}>
                <h2 className="text-base font-bold text-foreground">{title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-xl border border-border bg-secondary/50 p-5">
            <p className="text-sm text-muted-foreground">
              {t("privacyQuestions")}{" "}
              <a href={`mailto:${getSupportEmail()}`} className="text-primary hover:underline">
                {getSupportEmail()}
              </a>
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}

export default function CookiesPage() {
  return (
      <CookiesContent />
  )
}