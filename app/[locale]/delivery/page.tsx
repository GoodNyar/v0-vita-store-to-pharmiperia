import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ContentPageShell } from "@/components/content-page-shell"
import { DeliveryCarriersSection } from "@/components/delivery-carriers-section"
import { isLocale, type Locale } from "@/lib/i18n/config"
import { translate } from "@/lib/i18n/dictionary"
import { localizedPath } from "@/lib/i18n/routes"
import { buildPageMetadata } from "@/lib/seo/metadata"
import {
  Truck,
  Package,
  Clock,
  ChevronLeft,
  ShieldCheck,
  RotateCcw,
  Home,
} from "lucide-react"

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  return buildPageMetadata({
    locale,
    path: "/delivery",
    title: translate(locale, "deliveryTitle"),
    description: translate(locale, "deliverySubtitle"),
  })
}

export default async function DeliveryPage({ params }: PageProps) {
  const { locale: localeParam } = await params
  if (!isLocale(localeParam)) notFound()
  const locale = localeParam as Locale
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key)

  return (
    <ContentPageShell locale={locale}>
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-10">
          <Link
            href={localizedPath(locale, "/")}
            className="mb-8 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ChevronLeft className="h-4 w-4" />
            {t("backToHome")}
          </Link>

          <div className="mb-10">
            <h1 className="text-3xl font-bold text-foreground">{t("deliveryTitle")}</h1>
            <p className="mt-2 text-muted-foreground">{t("deliverySubtitle")}</p>
          </div>

          <div className="mb-10 flex items-center gap-4 rounded-xl border border-primary/20 bg-primary/10 px-6 py-5">
            <Truck className="h-8 w-8 flex-shrink-0 text-primary" />
            <div>
              <p className="font-semibold text-foreground">{t("deliveryFreeBanner")}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">{t("deliveryFreeBannerDesc")}</p>
            </div>
          </div>

          <section className="mb-10">
            <h2 className="mb-5 flex items-center gap-2 text-xl font-semibold text-foreground">
              <Home className="h-5 w-5 text-primary" />
              {t("deliveryCourierTitle")}
            </h2>
            <div className="rounded-xl border border-border bg-card px-6 py-5">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{t("deliveryCourierName")}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{t("deliveryCourierDesc")}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {t("deliveryCourierTime")}
                  </p>
                </div>
                <div className="mt-3 text-left sm:mt-0 sm:ml-8 sm:text-right">
                  <span className="text-lg font-bold text-primary">5,99 €</span>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="mb-5 flex items-center gap-2 text-xl font-semibold text-foreground">
              <Package className="h-5 w-5 text-primary" />
              {t("deliveryParcelTitle")}
            </h2>
            <DeliveryCarriersSection />
          </section>

          <section className="mb-10">
            <h2 className="mb-5 text-xl font-semibold text-foreground">{t("deliveryHowItWorks")}</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { step: "1", title: t("deliveryStep1Title"), desc: t("deliveryStep1Desc") },
                { step: "2", title: t("deliveryStep2Title"), desc: t("deliveryStep2Desc") },
                { step: "3", title: t("deliveryStep3Title"), desc: t("deliveryStep3Desc") },
              ].map(({ step, title, desc }) => (
                <div key={step} className="rounded-xl border border-border bg-card p-5">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-base font-bold text-primary-foreground">
                    {step}
                  </div>
                  <p className="font-semibold text-foreground">{title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-10 grid gap-4 sm:grid-cols-2">
            <div id="returns" className="flex scroll-mt-24 gap-4 rounded-xl border border-border bg-card p-5">
              <RotateCcw className="mt-0.5 h-6 w-6 flex-shrink-0 text-primary" />
              <div>
                <p className="font-semibold text-foreground">{t("deliveryReturn14")}</p>
                <p className="mt-1 text-sm text-muted-foreground">{t("deliveryReturnDesc")}</p>
              </div>
            </div>
            <div id="guarantee" className="flex scroll-mt-24 gap-4 rounded-xl border border-border bg-card p-5">
              <ShieldCheck className="mt-0.5 h-6 w-6 flex-shrink-0 text-primary" />
              <div>
                <p className="font-semibold text-foreground">{t("deliveryOriginal")}</p>
                <p className="mt-1 text-sm text-muted-foreground">{t("deliveryOriginalDesc")}</p>
              </div>
            </div>
          </section>

          <div className="rounded-xl bg-primary px-6 py-6 text-center text-primary-foreground">
            <p className="text-lg font-semibold">{t("deliveryCtaTitle")}</p>
            <p className="mt-1 text-sm text-primary-foreground/80">{t("deliveryCtaDesc")}</p>
            <Link
              href={localizedPath(locale, "/")}
              className="mt-4 inline-block rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-white/90"
            >
              {t("deliveryCtaButton")}
            </Link>
          </div>
        </div>
      </main>
    </ContentPageShell>
  )
}