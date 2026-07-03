"use client"

import Link from "next/link"
import Image from "next/image"
import { LangProvider, useLang } from "@/lib/i18n"
import { CartProvider } from "@/components/cart-context"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CartDrawer } from "@/components/cart-drawer"
import { 
  ChevronRight, Shield, Truck, Award, Heart, 
  Globe, Leaf, Users, CheckCircle2 
} from "lucide-react"

function AboutContent() {
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
              <span className="font-medium text-foreground">{t("aboutBreadcrumb")}</span>
            </div>
          </div>

          <main className="flex-1">
            {/* Hero */}
            <section className="bg-primary/5 py-16">
              <div className="mx-auto max-w-7xl px-4 text-center">
                <h1 className="text-3xl font-bold text-foreground md:text-4xl">
                  {t("aboutHeroTitle")}
                </h1>
                <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                  {t("aboutHeroSubtitle")}
                </p>
              </div>
            </section>

            {/* Mission */}
            <section className="py-16">
              <div className="mx-auto max-w-7xl px-4">
                <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground md:text-3xl">
                      {t("aboutMissionTitle")}
                    </h2>
                    <p className="mt-4 text-muted-foreground">
                      {t("aboutMissionText1")}
                    </p>
                    <p className="mt-4 text-muted-foreground">
                      {t("aboutMissionText2")}
                    </p>
                    <div className="mt-8 grid grid-cols-2 gap-6">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">100%</p>
                          <p className="text-sm text-muted-foreground">{t("aboutStatOriginal")}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">50 000+</p>
                          <p className="text-sm text-muted-foreground">{t("aboutStatCustomers")}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Globe className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">15+</p>
                          <p className="text-sm text-muted-foreground">{t("aboutStatCountries")}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Leaf className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">8+</p>
                          <p className="text-sm text-muted-foreground">{t("aboutStatBrands")}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-secondary">
                    <Image
                      src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800"
                      alt={t("aboutImageAlt")}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Values */}
            <section className="bg-card py-16">
              <div className="mx-auto max-w-7xl px-4">
                <h2 className="text-center text-2xl font-bold text-foreground md:text-3xl">
                  {t("aboutValuesTitle")}
                </h2>
                <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                  <div className="text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                      <Shield className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="mt-4 font-semibold text-foreground">{t("aboutValueQualityTitle")}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {t("aboutValueQualityDesc")}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                      <Truck className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="mt-4 font-semibold text-foreground">{t("aboutValueDeliveryTitle")}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {t("aboutValueDeliveryDesc")}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                      <Award className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="mt-4 font-semibold text-foreground">{t("aboutValueBrandsTitle")}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {t("aboutValueBrandsDesc")}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                      <Heart className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="mt-4 font-semibold text-foreground">{t("aboutValueCareTitle")}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {t("aboutValueCareDesc")}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Brands */}
            <section className="py-16">
              <div className="mx-auto max-w-7xl px-4">
                <h2 className="text-center text-2xl font-bold text-foreground md:text-3xl">
                  {t("aboutBrandsTitle")}
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
                  {t("aboutBrandsSubtitle")}
                </p>
                <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
                  {["La Roche-Posay", "Vichy", "Bioderma", "Avène", "CeraVe", "Eucerin", "Nuxe", "SVR"].map(brand => (
                    <div 
                      key={brand} 
                      className="flex h-24 items-center justify-center rounded-xl border border-border bg-card p-4"
                    >
                      <span className="text-lg font-semibold text-muted-foreground">{brand}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </main>

          <SiteFooter />
        </div>
  )
}

export default function AboutPage() {
  return (
    <LangProvider>
      <CartProvider>
        <AboutContent />
      </CartProvider>
    </LangProvider>
  )
}
