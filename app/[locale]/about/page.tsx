import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ContentPageShell } from "@/components/content-page-shell"
import { isLocale, type Locale } from "@/lib/i18n/config"
import { translate } from "@/lib/i18n/dictionary"
import { localizedPath } from "@/lib/i18n/routes"
import { buildPageMetadata } from "@/lib/seo/metadata"
import {
  ChevronRight,
  Shield,
  Truck,
  Award,
  Heart,
  Globe,
  Leaf,
  Users,
  CheckCircle2,
} from "lucide-react"

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  return buildPageMetadata({
    locale,
    path: "/about",
    title: translate(locale, "aboutHeroTitle"),
    description: translate(locale, "aboutHeroSubtitle"),
  })
}

export default async function AboutPage({ params }: PageProps) {
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
          <span className="font-medium text-foreground">{t("aboutBreadcrumb")}</span>
        </div>
      </div>

      <main className="flex-1">
        <section className="bg-primary/5 py-16">
          <div className="mx-auto max-w-7xl px-4 text-center">
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">{t("aboutHeroTitle")}</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              {t("aboutHeroSubtitle")}
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="text-2xl font-bold text-foreground md:text-3xl">
                  {t("aboutMissionTitle")}
                </h2>
                <p className="mt-4 text-muted-foreground">{t("aboutMissionText1")}</p>
                <p className="mt-4 text-muted-foreground">{t("aboutMissionText2")}</p>
                <div className="mt-8 grid grid-cols-2 gap-6">
                  {[
                    { icon: CheckCircle2, value: "100%", label: t("aboutStatOriginal") },
                    { icon: Users, value: "50 000+", label: t("aboutStatCustomers") },
                    { icon: Globe, value: "15+", label: t("aboutStatCountries") },
                    { icon: Leaf, value: "8+", label: t("aboutStatBrands") },
                  ].map(({ icon: Icon, value, label }) => (
                    <div key={label} className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{value}</p>
                        <p className="text-sm text-muted-foreground">{label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-secondary">
                <Image
                  src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800"
                  alt={t("aboutImageAlt")}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-card py-16">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="text-center text-2xl font-bold text-foreground md:text-3xl">
              {t("aboutValuesTitle")}
            </h2>
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: Shield, title: t("aboutValueQualityTitle"), desc: t("aboutValueQualityDesc") },
                { icon: Truck, title: t("aboutValueDeliveryTitle"), desc: t("aboutValueDeliveryDesc") },
                { icon: Award, title: t("aboutValueBrandsTitle"), desc: t("aboutValueBrandsDesc") },
                { icon: Heart, title: t("aboutValueCareTitle"), desc: t("aboutValueCareDesc") },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="mt-4 font-semibold text-foreground">{title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="text-center text-2xl font-bold text-foreground md:text-3xl">
              {t("aboutBrandsTitle")}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
              {t("aboutBrandsSubtitle")}
            </p>
            <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
              {["La Roche-Posay", "Vichy", "Bioderma", "Avène", "CeraVe", "Eucerin", "Nuxe", "SVR"].map(
                (brand) => (
                  <div
                    key={brand}
                    className="flex h-24 items-center justify-center rounded-xl border border-border bg-card p-4"
                  >
                    <span className="text-lg font-semibold text-muted-foreground">{brand}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </section>
      </main>
    </ContentPageShell>
  )
}