"use client"

import { useLang } from "@/lib/i18n"
import { Truck, Shield, CreditCard, RotateCcw } from "lucide-react"

export function WhyBuyUs() {
  const { t } = useLang()

  const features = [
    {
      icon: Truck,
      titleKey: "fastDelivery",
      descKey: "fastDeliveryDesc",
      href: null,
    },
    {
      icon: Shield,
      titleKey: "originalCosmetics",
      descKey: "originalCosmeticsDesc",
      href: null,
    },
    {
      icon: CreditCard,
      titleKey: "securePayment",
      descKey: "securePaymentDesc",
      href: null,
    },
    {
      icon: RotateCcw,
      titleKey: "easyReturnTitle",
      descKey: "easyReturnDesc",
      href: "/returns",
    },
  ]

  return (
    <section className="mt-12">
      <h2 className="mb-6 text-lg font-semibold text-foreground">
        {t("whyBuyUs")}
      </h2>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {features.map((feature) => {
          const Icon = feature.icon
          const Component = feature.href ? "a" : "div"

          return (
            <Component
              key={feature.titleKey}
              href={feature.href || undefined}
              className={`flex flex-col rounded-lg border border-border bg-card p-4 shadow-sm transition-all duration-300 ${
                feature.href
                  ? "cursor-pointer hover:shadow-md hover:-translate-y-1"
                  : "hover:shadow-md hover:-translate-y-1"
              } md:p-6`}
            >
              <Icon className="h-6 w-6 text-primary md:h-8 md:w-8" />
              <h3 className="mt-3 text-sm font-semibold text-foreground md:text-base">
                {t(
                  feature.titleKey as
                    | "fastDelivery"
                    | "originalCosmetics"
                    | "securePayment"
                    | "easyReturnTitle"
                )}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground md:text-sm">
                {t(
                  feature.descKey as
                    | "fastDeliveryDesc"
                    | "originalCosmeticsDesc"
                    | "securePaymentDesc"
                    | "easyReturnDesc"
                )}
              </p>
            </Component>
          )
        })}
      </div>
    </section>
  )
}
