"use client"

import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { useLang } from "@/lib/i18n"

interface PromoCard {
  id: number
  titleKey: "promo1Title" | "promo2Title"
  descKey: "promo1Desc" | "promo2Desc"
  image: string
  href: string
  accent: string
  bg: string
}

const promos: PromoCard[] = [
  {
    id: 1,
    titleKey: "promo1Title",
    descKey: "promo1Desc",
    image: "/images/banner-vichy.jpg",
    href: "/specials/vichy",
    accent: "bg-[#0b5c9e]",
    bg: "bg-[#d6eaf7]",
  },
  {
    id: 2,
    titleKey: "promo2Title",
    descKey: "promo2Desc",
    image: "/images/banner-bioderma.jpg",
    href: "/specials/bioderma",
    accent: "bg-[#1a6ea8]",
    bg: "bg-[#ddeef7]",
  },
]

export function PromoCards() {
  const { t } = useLang()

  return (
    <section className="mt-10">
      <h2 className="mb-4 text-lg font-semibold text-foreground">
        {t("specialOffers")}
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {promos.map((promo) => (
          <a
            key={promo.id}
            href={promo.href}
            className={`group relative flex h-48 overflow-hidden rounded-xl sm:h-56 md:h-64 ${promo.bg} transition-shadow hover:shadow-xl`}
          >
            {/* Product image — right side */}
            <div className="absolute inset-0">
              <Image
                src={promo.image}
                alt={t(promo.titleKey)}
                fill
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />
              {/* Dark overlay on left for text readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/40 to-transparent" />
            </div>

            {/* Text content */}
            <div className="relative z-10 flex flex-col justify-end p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
                Pharmiperia
              </p>
              <h3 className="mt-1 text-xl font-bold leading-tight text-white sm:text-2xl">
                {t(promo.titleKey)}
              </h3>
              <p className="mt-1.5 max-w-[22ch] text-sm leading-relaxed text-white/80">
                {t(promo.descKey)}
              </p>
              <span
                className={`mt-4 inline-flex w-fit items-center gap-1.5 rounded-full ${promo.accent} px-5 py-2 text-xs font-semibold text-white transition-opacity group-hover:opacity-90`}
              >
                {t("viewOffer")}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
