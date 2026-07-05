"use client"

import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CartDrawer } from "@/components/cart-drawer"
import { useLang } from "@/lib/i18n"
import { Shield, Award, Truck, CheckCircle } from "lucide-react"

function QualityContent() {
  const { t } = useLang()
  return (
    <>
        <SiteHeader />
        <CartDrawer />
        <main className="min-h-screen bg-background">
          <div className="mx-auto max-w-3xl px-4 py-10">
            <h1 className="text-3xl font-bold text-foreground">{t("qualityTitle")}</h1>
            <p className="mt-2 text-muted-foreground">{t("qualitySubtitle")}</p>

            <div className="mt-8 space-y-6">
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-bold text-foreground">{t("qualityOriginalTitle")}</h2>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{t("qualityOriginalDesc")}</p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Truck className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-bold text-foreground">{t("qualityStorageTitle")}</h2>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{t("qualityStorageDesc")}</p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-bold text-foreground">{t("qualityGuaranteeTitle")}</h2>
                </div>
                <div className="space-y-3">
                  {[
                    t("qualityGuarantee1"),
                    t("qualityGuarantee2"),
                    t("qualityGuarantee3"),
                    t("qualityGuarantee4"),
                    t("qualityGuarantee5"),
                  ].map(item => (
                    <div key={item} className="flex items-start gap-2 text-sm text-foreground">
                      <CheckCircle className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-primary/5 border border-primary/20 p-6">
                <h2 className="font-bold text-foreground mb-2">{t("qualityProblemTitle")}</h2>
                <p className="text-sm text-muted-foreground mb-4">{t("qualityProblemDesc")}</p>
                <Link
                  href="/contact"
                  className="inline-flex h-10 items-center rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  {t("contactUsCta")}
                </Link>
              </div>
            </div>
          </div>
        </main>
        <SiteFooter />
    </>
  )
}

export default function QualityPage() {
  return <QualityContent />
}
