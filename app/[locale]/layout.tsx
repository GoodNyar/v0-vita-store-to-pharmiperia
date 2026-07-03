import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CookieConsentBanner } from "@/components/cookie-consent-banner"
import { LocaleHtmlLang } from "@/components/locale-html-lang"
import { LangProvider, type Lang } from "@/lib/i18n"
import { isLocale, type Locale } from "@/lib/i18n/config"
import { buildHreflangAlternates } from "@/lib/seo/metadata"
import { localizedPath } from "@/lib/i18n/routes"

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return [{ locale: "lv" }, { locale: "ru" }]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}

  return {
    alternates: buildHreflangAlternates(localizedPath(locale as Locale, "/")),
  }
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params

  if (!isLocale(locale)) {
    notFound()
  }

  return (
    <LangProvider initialLang={locale as Lang}>
      <LocaleHtmlLang />
      {children}
      <CookieConsentBanner />
    </LangProvider>
  )
}