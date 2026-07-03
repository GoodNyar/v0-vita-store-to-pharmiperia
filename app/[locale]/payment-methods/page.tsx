"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CartDrawer } from "@/components/cart-drawer"
import { LangProvider, useLang } from "@/lib/i18n"
import { Shield, Lock, CheckCircle, CreditCard, Smartphone, Building2 } from "lucide-react"
import Image from "next/image"

function PaymentMethodsContent() {
  const { t } = useLang()
  const bankCards = [
    { name: "Visa", src: "/images/payment-logos/visa.png", width: 50, height: 32 },
    { name: "Mastercard", src: "/images/payment-logos/mastercard.svg", width: 45, height: 32 },
  ]

  const digitalWallets = [
    { name: "Apple Pay", src: "/images/payment-logos/apple-pay.png", width: 60, height: 32 },
    { name: "Google Pay", src: "/images/payment-logos/google-pay.png", width: 60, height: 32 },
    { name: "Revolut", src: "/images/payment-logos/revolut.png", width: 70, height: 32 },
  ]

  const latvianBanks = [
    { name: "Swedbank", src: "/images/payment-logos/swedbank.png", width: 90, height: 32 },
    { name: "SEB", src: "/images/payment-logos/seb.jpg", width: 50, height: 32 },
    { name: "Citadele", src: "/images/payment-logos/citadele.png", width: 80, height: 32 },
    { name: "Luminor", src: "/images/payment-logos/luminor.jpg", width: 80, height: 32 },
  ]

  return (
    <>
        <SiteHeader />
        <CartDrawer />
        <main className="min-h-screen bg-background">
          <div className="mx-auto max-w-3xl px-4 py-10">
            <h1 className="text-3xl font-bold text-foreground">{t("paymentTitle")}</h1>
            <p className="mt-2 text-muted-foreground">
              {t("paymentSubtitle")}
            </p>

            <div className="mt-8 space-y-4">

              {/* Bank Cards */}
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-bold text-foreground">{t("paymentCardsTitle")}</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-5">
                  {t("paymentCardsDesc")}
                </p>
                <div className="flex flex-wrap items-center gap-6">
                  {bankCards.map((card) => (
                    <img
                      key={card.name}
                      src={card.src}
                      alt={card.name}
                      width={card.width}
                      height={card.height}
                      className="object-contain"
                    />
                  ))}
                </div>
              </div>

              {/* Digital Wallets */}
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Smartphone className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-bold text-foreground">{t("paymentWalletsTitle")}</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-5">
                  {t("paymentWalletsDesc")}
                </p>
                <div className="flex flex-wrap items-center gap-6">
                  {digitalWallets.map((wallet) => (
                    <img
                      key={wallet.name}
                      src={wallet.src}
                      alt={wallet.name}
                      width={wallet.width}
                      height={wallet.height}
                      className="object-contain"
                    />
                  ))}
                </div>
              </div>

              {/* Latvian Banks */}
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-bold text-foreground">{t("paymentBanksTitle")}</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {t("paymentBanksDesc")}
                </p>
                <p className="mb-5 text-xs text-muted-foreground">
                  {t("paymentBanksCheckoutNote")}
                </p>
                <div className="flex flex-wrap items-center gap-6">
                  {latvianBanks.map((bank) => (
                    <img
                      key={bank.name}
                      src={bank.src}
                      alt={bank.name}
                      width={bank.width}
                      height={bank.height}
                      className="object-contain"
                    />
                  ))}
                </div>
              </div>

              {/* Security */}
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-bold text-foreground">{t("paymentSecurityTitle")}</h2>
                </div>
                <div className="space-y-3">
                  {[
                    t("paymentSecurity1"),
                    t("paymentSecurity2"),
                    t("paymentSecurity3"),
                    t("paymentSecurity4"),
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2 text-sm text-foreground">
                      <CheckCircle className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Promo */}
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Lock className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-bold text-foreground">{t("paymentPromoTitle")}</h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t("paymentPromoDesc")}
                </p>
                <div className="mt-4 rounded-lg bg-primary/5 border border-primary/20 p-4">
                  <p className="text-sm font-medium text-primary">{t("paymentPromoNewTitle")}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t("paymentPromoNewDesc1")}{" "}
                    <span className="font-mono font-bold text-foreground">WELCOME10</span>{" "}
                    {t("paymentPromoNewDesc2")}
                  </p>
                </div>
              </div>

              {/* FAQ */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-lg font-bold text-foreground mb-3">{t("paymentFaqTitle")}</h2>
                <div className="space-y-4">
                  {[
                    {
                      q: t("paymentFaq1Q"),
                      a: t("paymentFaq1A"),
                    },
                    {
                      q: t("paymentFaq2Q"),
                      a: t("paymentFaq2A"),
                    },
                    {
                      q: t("paymentFaq3Q"),
                      a: t("paymentFaq3A"),
                    },
                  ].map(({ q, a }) => (
                    <div key={q}>
                      <p className="text-sm font-semibold text-foreground">{q}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
        <SiteFooter />
    </>
  )
}

export default function PaymentMethodsPage() {
  return (
    <LangProvider>
        <PaymentMethodsContent />
    </LangProvider>
  )
}
