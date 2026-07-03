import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ContentPageShell } from "@/components/content-page-shell"
import { isLocale, type Locale } from "@/lib/i18n/config"
import { translate } from "@/lib/i18n/dictionary"
import { buildPageMetadata } from "@/lib/seo/metadata"
import { getSupportEmail } from "@/lib/site"

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  return buildPageMetadata({
    locale,
    path: "/privacy",
    title: translate(locale, "privacyTitle"),
    description: translate(locale, "privacy1Text"),
  })
}

export default async function PrivacyPage({ params }: PageProps) {
  const { locale: localeParam } = await params
  if (!isLocale(localeParam)) notFound()
  const locale = localeParam as Locale
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key)

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
    <ContentPageShell locale={locale}>
      <main className="min-h-screen flex-1 bg-background">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <h1 className="text-3xl font-bold text-foreground">{t("privacyTitle")}</h1>
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
    </ContentPageShell>
  )
}