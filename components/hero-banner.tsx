"use client"

import Image from "next/image"
import Link from "next/link"
import { useLang } from "@/lib/i18n"

const brands = [
  { name: "Bioderma",       slug: "bioderma",       logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Bioderma_logo.svg/320px-Bioderma_logo.svg.png" },
  { name: "Vichy",          slug: "vichy",           logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Vichy_logo.svg/320px-Vichy_logo.svg.png" },
  { name: "La Roche-Posay", slug: "la-roche-posay",  logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/La_Roche-Posay_logo.svg/320px-La_Roche-Posay_logo.svg.png" },
  { name: "Avène",          slug: "avene",           logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Avene_logo.svg/320px-Avene_logo.svg.png" },
  { name: "Nuxe",           slug: "nuxe",            logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Nuxe_logo.svg/320px-Nuxe_logo.svg.png" },
  { name: "Caudalie",       slug: "caudalie",        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Caudalie_logo.svg/320px-Caudalie_logo.svg.png" },
  { name: "Clinique",       slug: "clinique",        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Clinique_logo.svg/320px-Clinique_logo.svg.png" },
  { name: "Biotherm",       slug: "biotherm",        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Biotherm_logo.svg/320px-Biotherm_logo.svg.png" },
  { name: "Uriage",         slug: "uriage",          logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Uriage_logo.svg/320px-Uriage_logo.svg.png" },
  { name: "Evian",          slug: "evian",           logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Evian_logo.svg/320px-Evian_logo.svg.png" },
]

// Text-based brand tiles — clean, premium pharmacy aesthetic
// using real brand name typography since external SVG logos may not load in sandbox
function BrandTile({ brand }: { brand: typeof brands[0] }) {
  return (
    <Link
      href={`/brands/${brand.slug}`}
      className="group flex items-center justify-center rounded-xl border border-border bg-card px-3 py-4 shadow-sm transition-all duration-200 hover:border-primary/40 hover:shadow-md"
      aria-label={brand.name}
    >
      <span className="text-center text-sm font-semibold tracking-wide text-foreground/70 transition-colors group-hover:text-primary">
        {brand.name}
      </span>
    </Link>
  )
}

export function HeroBanner() {
  const { t } = useLang()

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex flex-col lg:flex-row">
        {/* Left column — text */}
        <div className="flex flex-col items-start justify-center px-8 py-12 lg:w-[42%] lg:px-12 lg:py-16">
          {/* Eyebrow */}
          <span className="mb-4 inline-block rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
            Pharmiperia
          </span>

          <h1 className="text-balance text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
            {t("heroTitle")}
          </h1>

          <p className="mt-4 max-w-sm text-pretty text-base leading-relaxed text-muted-foreground">
            {t("heroSubtitle")}
          </p>

          <Link
            href="/catalogue"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg"
          >
            {t("heroCta")}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>

          {/* Small trust note */}
          <p className="mt-6 text-xs text-muted-foreground">
            10 премиальных брендов • Оригинальная продукция
          </p>
        </div>

        {/* Divider */}
        <div className="hidden w-px bg-border lg:block" aria-hidden="true" />

        {/* Right column — brand grid */}
        <div className="flex flex-1 items-center justify-center bg-background/50 px-6 py-10 lg:px-10 lg:py-12">
          <div className="grid w-full max-w-md grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:max-w-none">
            {brands.map((brand) => (
              <BrandTile key={brand.slug} brand={brand} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
