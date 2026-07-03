import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ContentPageShell } from "@/components/content-page-shell"
import { Button } from "@/components/ui/button"
import { isLocale, type Locale } from "@/lib/i18n/config"
import { translate } from "@/lib/i18n/dictionary"
import { localizedPath } from "@/lib/i18n/routes"
import { buildPageMetadata } from "@/lib/seo/metadata"
import {
  ChevronRight,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Package,
  MessageSquare,
} from "lucide-react"

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  return buildPageMetadata({
    locale,
    path: "/returns",
    title: translate(locale, "returnsTitle"),
    description: translate(locale, "returnsSubtitle"),
  })
}

export default async function ReturnsPage({ params }: PageProps) {
  const { locale: localeParam } = await params
  if (!isLocale(localeParam)) notFound()
  const locale = localeParam as Locale
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key)

  return (
    <ContentPageShell locale={locale}>
      <div className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 text-sm">
          <Link
            href={localizedPath(locale, "/")}
            className="text-muted-foreground hover:text-primary"
          >
            {t("breadcrumbHome")}
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-foreground">{t("returnsBreadcrumb")}</span>
        </div>
      </div>

      <main className="flex-1 py-12">
        <div className="mx-auto max-w-4xl px-4">
          <h1 className="text-3xl font-bold text-foreground">{t("returnsTitle")}</h1>
          <p className="mt-4 text-muted-foreground">{t("returnsSubtitle")}</p>

          <div className="mt-8 rounded-xl border border-primary/30 bg-primary/5 p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <RotateCcw className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">{t("returns14Title")}</h2>
                <p className="text-muted-foreground">{t("returns14Desc")}</p>
              </div>
            </div>
          </div>

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

          <section className="mt-12">
            <h2 className="text-xl font-semibold text-foreground">{t("returnsHowTitle")}</h2>
            <div className="mt-6 space-y-4">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className="flex items-start gap-4 rounded-xl border border-border bg-card p-6"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {step}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {t(`returnsHow${step}Title` as Parameters<typeof translate>[1])}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {t(`returnsHow${step}Desc` as Parameters<typeof translate>[1])}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

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

          <div className="mt-12 rounded-xl border border-border bg-card p-6 text-center">
            <MessageSquare className="mx-auto h-8 w-8 text-primary" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">{t("returnsQuestionsTitle")}</h3>
            <p className="mt-2 text-muted-foreground">{t("returnsQuestionsDesc")}</p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <Link href={localizedPath(locale, "/account/returns")}>
                <Button variant="default">{t("returnRequestCta")}</Button>
              </Link>
              <Link href={localizedPath(locale, "/contact")}>
                <Button variant="outline">{t("contactUsCta")}</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </ContentPageShell>
  )
}