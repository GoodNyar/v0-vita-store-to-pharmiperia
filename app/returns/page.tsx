import Link from "next/link"
import { LangProvider, useLang } from "@/lib/i18n"
import { CartProvider } from "@/components/cart-context"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CartDrawer } from "@/components/cart-drawer"
import { Button } from "@/components/ui/button"
import { 
  ChevronRight, RotateCcw, CheckCircle2, XCircle, 
  Clock, Package, MessageSquare 
} from "lucide-react"

function ReturnsContent() {
  const { t } = useLang()
  return (
        <div className="flex min-h-screen flex-col bg-background">
          <SiteHeader />
          <CartDrawer />

          {/* Breadcrumbs */}
          <div className="border-b border-border bg-card">
            <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 text-sm">
              <Link href="/" className="text-muted-foreground hover:text-primary">
                {t("breadcrumbHome")}
              </Link>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-foreground">{t("returnsBreadcrumb")}</span>
            </div>
          </div>

          <main className="flex-1 py-12">
            <div className="mx-auto max-w-4xl px-4">
              <h1 className="text-3xl font-bold text-foreground">{t("returnsTitle")}</h1>
              <p className="mt-4 text-muted-foreground">
                {t("returnsSubtitle")}
              </p>

              {/* Guarantee banner */}
              <div className="mt-8 rounded-xl border border-primary/30 bg-primary/5 p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <RotateCcw className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      {t("returns14Title")}
                    </h2>
                    <p className="text-muted-foreground">
                      {t("returns14Desc")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Conditions */}
              <section className="mt-12">
                <h2 className="text-xl font-semibold text-foreground">{t("returnsConditionsTitle")}</h2>
                
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <div className="rounded-xl border border-border bg-card p-6">
                    <div className="mb-4 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-foreground">{t("returnsCanTitle")}</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• {t("returnsCan1")}</li>
                      <li>• {t("returnsCan2")}</li>
                      <li>• {t("returnsCan3")}</li>
                      <li>• {t("returnsCan4")}</li>
                      <li>• {t("returnsCan5")}</li>
                    </ul>
                  </div>

                  <div className="rounded-xl border border-border bg-card p-6">
                    <div className="mb-4 flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-destructive" />
                      <h3 className="font-semibold text-foreground">{t("returnsCannotTitle")}</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• {t("returnsCannot1")}</li>
                      <li>• {t("returnsCannot2")}</li>
                      <li>• {t("returnsCannot3")}</li>
                      <li>• {t("returnsCannot4")}</li>
                      <li>• {t("returnsCannot5")}</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* How to return */}
              <section className="mt-12">
                <h2 className="text-xl font-semibold text-foreground">{t("returnsHowTitle")}</h2>
                
                <div className="mt-6 space-y-4">
                  <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-6">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{t("returnsHow1Title")}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {t("returnsHow1Desc")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-6">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{t("returnsHow2Title")}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {t("returnsHow2Desc")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-6">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{t("returnsHow3Title")}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {t("returnsHow3Desc")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-6">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      4
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{t("returnsHow4Title")}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {t("returnsHow4Desc")}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Refund info */}
              <section className="mt-12">
                <h2 className="text-xl font-semibold text-foreground">{t("returnsRefundTitle")}</h2>
                <div className="mt-4 rounded-xl border border-border bg-card p-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-start gap-3">
                      <Clock className="mt-0.5 h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">{t("returnsRefundTerm")}</p>
                        <p className="text-sm text-muted-foreground">{t("returnsRefundTermValue")}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Package className="mt-0.5 h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">{t("returnsRefundShipping")}</p>
                        <p className="text-sm text-muted-foreground">{t("returnsRefundShippingValue")}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* CTA */}
              <div className="mt-12 rounded-xl border border-border bg-card p-6 text-center">
                <MessageSquare className="mx-auto h-8 w-8 text-primary" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">{t("returnsQuestionsTitle")}</h3>
                <p className="mt-2 text-muted-foreground">
                  {t("returnsQuestionsDesc")}
                </p>
                <Link href="/contact">
                  <Button className="mt-4">{t("contactUsCta")}</Button>
                </Link>
              </div>
            </div>
          </main>

          <SiteFooter />
        </div>
  )
}

export default function ReturnsPage() {
  return (
    <LangProvider>
      <CartProvider>
        <ReturnsContent />
      </CartProvider>
    </LangProvider>
  )
}
