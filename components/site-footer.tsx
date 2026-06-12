"use client"

import Link from "next/link"
import { Leaf } from "lucide-react"
import { useLang } from "@/lib/i18n"

export function SiteFooter() {
  const { t } = useLang()

  const footerColumns = [
    {
      titleKey: "footerStoreTitle",
      links: [
        { labelKey: "footerStoreFace", href: "/category/face" },
        { labelKey: "footerStoreHair", href: "/category/hair" },
        { labelKey: "footerStoreBody", href: "/category/body" },
        { labelKey: "footerStoreSuncare", href: "/category/suncare" },
        { labelKey: "footerStoreMakeup", href: "/category/makeup" },
      ],
    },
    {
      titleKey: "footerHelpTitle",
      links: [
        { labelKey: "footerHelpCenter", href: "/help" },
        { labelKey: "footerHelpTrack", href: "/track" },
        { labelKey: "footerHelpDelivery", href: "/delivery" },
        { labelKey: "footerHelpPayment", href: "/payment-methods" },
        { labelKey: "footerHelpReturns", href: "/returns" },
        { labelKey: "footerHelpContact", href: "/contact" },
      ],
    },
    {
      titleKey: "footerCompanyTitle",
      links: [
        { labelKey: "footerCompanyAbout", href: "/about" },
        { labelKey: "footerCompanyBlog", href: "/blog" },
        { labelKey: "footerCompanyReviews", href: "/reviews" },
        { labelKey: "footerCompanyPartners", href: "/partners" },
        { labelKey: "footerCompanyQuality", href: "/quality" },
      ],
    },
    {
      titleKey: "footerAccountTitle",
      links: [
        { labelKey: "footerAccountLogin", href: "/auth/login" },
        { labelKey: "footerAccountSignUp", href: "/auth/sign-up" },
        { labelKey: "footerAccountOrders", href: "/account/orders" },
        { labelKey: "footerAccountFavorites", href: "/account/favorites" },
        { labelKey: "footerAccountLoyalty", href: "/account/loyalty" },
      ],
    },
  ]

  const legalLinks = [
    { labelKey: "footerPrivacy", href: "/privacy" },
    { labelKey: "footerDataSecurity", href: "/data-security" },
    { labelKey: "footerTerms", href: "/terms" },
  ]

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Leaf className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">Pharmiperia</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {t("footerBrandDesc")}
            </p>
          </div>

          {/* Link columns */}
          {footerColumns.map((col) => (
            <div key={col.titleKey}>
              <h4 className="text-sm font-semibold text-foreground">{t(col.titleKey)}</h4>
              <ul className="mt-3 flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {t(link.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 md:flex-row">
          <p className="text-xs text-muted-foreground">
            {t("footerCopyright")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-muted-foreground transition-colors hover:text-primary"
              >
                {t(link.labelKey)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
