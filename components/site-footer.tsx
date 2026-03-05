"use client"

import { Leaf } from "lucide-react"
import { useLang } from "@/lib/i18n"

export function SiteFooter() {
  const { t } = useLang()

  const footerLinks = {
    [t("footerShop")]: [
      t("skincare"),
      t("haircare"),
      t("bodycare"),
      t("sunprotection"),
      t("makeup"),
      t("babymom"),
    ],
    [t("footerHelp")]: [
      t("helpCenter"),
      t("trackOrder"),
      t("shippingInfo"),
      t("returns"),
      t("contactUs"),
    ],
    [t("footerCompany")]: [
      t("aboutUs"),
      t("blog"),
      t("careers"),
      t("press"),
      t("affiliate"),
    ],
    [t("footerAccount")]: [
      t("signIn"),
      t("createAccount"),
      t("myOrders"),
      t("myLists"),
      t("rewards"),
    ],
  }

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <a href="#" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Leaf className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">
                Pharmiperia
              </span>
            </a>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {t("footerDesc")}
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-foreground">{title}</h4>
              <ul className="mt-3 flex flex-col gap-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 md:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; 2026 Pharmiperia. {t("allRightsReserved")}
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <a href="#" className="transition-colors hover:text-primary">
              {t("privacy")}
            </a>
            <a href="#" className="transition-colors hover:text-primary">
              {t("terms")}
            </a>
            <a href="#" className="transition-colors hover:text-primary">
              {t("cookies")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
