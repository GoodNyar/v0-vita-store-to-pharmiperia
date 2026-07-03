import { notFound } from "next/navigation"
import { LocaleHtmlLang } from "@/components/locale-html-lang"
import { LangProvider, type Lang } from "@/lib/i18n"
import { isLocale } from "@/lib/i18n/config"

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return [{ locale: "lv" }, { locale: "ru" }]
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
    </LangProvider>
  )
}