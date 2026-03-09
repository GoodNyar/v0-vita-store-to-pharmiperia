"use client"

import { useLang } from "@/lib/i18n"
import { Truck, Shield, CreditCard, RotateCcw } from "lucide-react"
import Image from "next/image"

export function WhyBuyUs() {
  const { t } = useLang()

  // maxW controls the visible width of each logo within its fixed-height container
  const paymentMethods = [
    { name: "Visa", src: "/images/payment-logos/visa.png", maxW: "32px" },
    { name: "Mastercard", src: "/images/payment-logos/mastercard.svg", maxW: "28px" },
    { name: "Apple Pay", src: "/images/payment-logos/apple-pay.png", maxW: "44px" },
    { name: "Google Pay", src: "/images/payment-logos/google-pay.png", maxW: "44px" },
    { name: "Revolut", src: "/images/payment-logos/revolut.png", maxW: "44px" },
    { name: "Swedbank", src: "/images/payment-logos/swedbank.png", maxW: "52px" },
    { name: "SEB", src: "/images/payment-logos/seb.jpg", maxW: "28px" },
    { name: "Citadele", src: "/images/payment-logos/citadele.png", maxW: "44px" },
    { name: "Luminor", src: "/images/payment-logos/luminor.jpg", maxW: "44px" },
  ]

  const features = [
    {
      icon: Truck,
      titleKey: "fastDelivery",
      descKey: "fastDeliveryDesc",
      href: "/delivery",
    },
    {
      icon: Shield,
      titleKey: "originalCosmetics",
      descKey: "originalCosmeticsDesc",
      href: "/authenticity",
    },
    {
      icon: CreditCard,
      titleKey: "securePayment",
      descKey: "securePaymentDesc",
      href: "/payment",
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

          return (
            <a
              key={feature.titleKey}
              href={feature.href}
              className="flex flex-col rounded-xl border border-border bg-white p-5 shadow-sm transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-lg"
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
                <div className="mt-3 flex flex-wrap items-center justify-center gap-x-[8px] gap-y-[8px]">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.name}
                      className="flex h-[18px] items-center justify-center opacity-80 transition-opacity duration-200 hover:opacity-100"
                      style={{ width: method.maxW }}
                      title={method.name}
                    >
                      <img
                        src={method.src}
                        alt={method.name}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground whitespace-pre-line">
                  {t(
                    feature.descKey as
                      | "fastDeliveryDesc"
                      | "originalCosmeticsDesc"
                      | "securePaymentDesc"
                      | "easyReturnDesc"
                  )}
                </p>
              )}
            </a>
          )
        })}
      </div>
    </section>
  )
}
