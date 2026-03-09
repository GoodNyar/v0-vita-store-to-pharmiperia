"use client"

import { useLang } from "@/lib/i18n"
import { Truck, Shield, CreditCard, RotateCcw } from "lucide-react"
import Image from "next/image"

export function WhyBuyUs() {
  const { t } = useLang()

  const paymentMethods = [
    { name: "Visa", src: "/images/payment-logos/visa.svg" },
    { name: "Mastercard", src: "/images/payment-logos/mastercard.svg" },
    { name: "Apple Pay", src: "/images/payment-logos/apple-pay.png" },
    { name: "Google Pay", src: "/images/payment-logos/google-pay.png" },
    { name: "Swedbank", src: "/images/payment-logos/swedbank.png" },
    { name: "SEB", src: "/images/payment-logos/seb.jpg" },
    { name: "Citadele", src: "/images/payment-logos/citadele.png" },
    { name: "Luminor", src: "/images/payment-logos/luminor.jpg" },
    { name: "Revolut", src: "/images/payment-logos/revolut.png" },
  ]

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
      showPaymentLogos: true,
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

              {/* Payment logos for secure payment card */}
              {feature.showPaymentLogos ? (
                <div className="mt-3 flex flex-wrap items-center justify-center gap-x-[10px] gap-y-[8px]">
                  {paymentMethods.map((method) => (
                    <img
                      key={method.name}
                      src={method.src}
                      alt={method.name}
                      title={method.name}
                      className="h-[16px] max-h-[16px] w-auto object-contain opacity-80 transition-opacity duration-200 hover:opacity-100"
                    />
                  ))}
                </div>
              ) : (
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {t(
                    feature.descKey as
                      | "fastDeliveryDesc"
                      | "originalCosmeticsDesc"
                      | "securePaymentDesc"
                      | "easyReturnDesc"
                  )}
                </p>
              )}
            </Component>
          )
        })}
      </div>
    </section>
  )
}
