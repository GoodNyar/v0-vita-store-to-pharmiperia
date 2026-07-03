"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CartDrawer } from "@/components/cart-drawer"
import { LangProvider, useLang } from "@/lib/i18n"
import { getSupportEmail } from "@/lib/site"

function PrivacyContent() {
  const { t } = useLang()
  const sections = [
    { title: t("privacy1Title"), text: t("privacy1Text") },
    { title: t("privacy2Title"), text: t("privacy2Text") },
    { title: t("privacy3Title"), text: t("privacy3Text") },
    { title: t("privacy4Title"), text: t("privacy4Text") },
    { title: t("privacy5Title"), text: t("privacy5Text") },
    { title: t("privacy6Title"), text: t("privacy6Text") },
    { title: t("privacy7Title"), text: t("privacy7Text") },
    { title: t("privacy8Title"), text: t("privacy8Text") },
    { title: t("privacy9Title"), text: t("privacy9Text") },
  ]

  return (
    <>
        <SiteHeader />
        <CartDrawer />
        <main className="min-h-screen bg-background">
          <div className="mx-auto max-w-3xl px-4 py-10">
            <h1 className="text-3xl font-bold text-foreground">{t("privacyTitle")}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{t("legalLastUpdated")}</p>

            <div className="mt-8 space-y-6">
              {sections.map(({ title, text }) => (
                <div key={title}>
                  <h2 className="text-base font-bold text-foreground">{title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{text}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-xl bg-secondary/50 border border-border p-5">
              <p className="text-sm text-muted-foreground">{t("privacyQuestions")} <a href={`mailto:${getSupportEmail()}`} className="text-primary hover:underline">{getSupportEmail()}</a></p>
            </div>
          </div>
        </main>
        <SiteFooter />
    </>
  )
}

export default function PrivacyPage() {
  return (
    <LangProvider>
        <PrivacyContent />
    </LangProvider>
  )
}
