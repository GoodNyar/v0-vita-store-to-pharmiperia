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
    <section className="mt-12 rounded-xl bg-[#fafafa] px-4 py-8 md:px-6 md:py-10">
      <h2 className="mb-6 text-lg font-semibold text-foreground">
        {t("whyBuyUs")}
      </h2>

      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {features.map((feature) => {
          const Icon = feature.icon
          const Component = feature.href ? "a" : "div"

          return (
            <Component
              key={feature.titleKey}
              href={feature.href || undefined}
              className={`flex flex-col rounded-xl border border-border bg-white p-5 shadow-sm transition-all duration-200 ${
                feature.href ? "cursor-pointer" : ""
              } hover:-translate-y-1 hover:shadow-md`}
            >
              {/* Icon container */}
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Icon className="h-5 w-5 text-primary" strokeWidth={1.75} />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-foreground">
                {t(
                  feature.titleKey as
                    | "fastDelivery"
                    | "originalCosmetics"
                    | "securePayment"
                    | "easyReturnTitle"
                )}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
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
