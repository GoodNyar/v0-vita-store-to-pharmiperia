"use client"

import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CartDrawer } from "@/components/cart-drawer"
import { CartProvider } from "@/components/cart-context"
import { LangProvider, useLang } from "@/lib/i18n"
import { Package, RotateCcw, CreditCard, User, MessageCircle, ChevronRight } from "lucide-react"
import { useState } from "react"

function HelpContent() {
  const { t } = useLang()
  const [open, setOpen] = useState<number | null>(null)
  const [search, setSearch] = useState("")

  const faqs = [
    { q: t("helpFaq1Q"), a: t("helpFaq1A") },
    { q: t("helpFaq2Q"), a: t("helpFaq2A") },
    { q: t("helpFaq3Q"), a: t("helpFaq3A") },
    { q: t("helpFaq4Q"), a: t("helpFaq4A") },
    { q: t("helpFaq5Q"), a: t("helpFaq5A") },
    { q: t("helpFaq6Q"), a: t("helpFaq6A") },
    { q: t("helpFaq7Q"), a: t("helpFaq7A") },
    { q: t("helpFaq8Q"), a: t("helpFaq8A") },
  ]

  const quickLinks = [
    { icon: Package, label: t("helpLinkOrders"), href: "/account/orders" },
    { icon: RotateCcw, label: t("helpLinkReturns"), href: "/returns" },
    { icon: CreditCard, label: t("helpLinkPayment"), href: "/payment-methods" },
    { icon: User, label: t("helpLinkAccount"), href: "/account" },
    { icon: MessageCircle, label: t("helpLinkContacts"), href: "/contact" },
  ]

  const filtered = faqs.filter(f =>
    f.q.toLowerCase().includes(search.toLowerCase()) ||
    f.a.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
        <SiteHeader />
        <CartDrawer />
        <main className="min-h-screen bg-background">
          <div className="bg-primary/5 border-b border-border py-12">
            <div className="mx-auto max-w-2xl px-4 text-center">
              <h1 className="text-3xl font-bold text-foreground">{t("helpHeroTitle")}</h1>
              <div className="mt-5 relative">
                <input
                  type="text"
                  placeholder={t("helpSearchPlaceholder")}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="h-12 w-full rounded-full border border-border bg-background pl-5 pr-5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-3xl px-4 py-10">
            {/* Quick links */}
            <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-5">
              {quickLinks.map(({ icon: Icon, label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center transition-all hover:border-primary hover:shadow-sm"
                >
                  <Icon className="h-6 w-6 text-primary" />
                  <span className="text-xs font-medium text-foreground">{label}</span>
                </Link>
              ))}
            </div>

            {/* FAQ */}
            <h2 className="mb-4 text-xl font-bold text-foreground">{t("helpFaqTitle")}</h2>
            <div className="space-y-2">
              {filtered.map((faq, i) => (
                <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
                  <button
                    onClick={() => setOpen(open === i ? null : i)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold text-foreground hover:bg-secondary/50 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronRight className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open === i ? "rotate-90" : ""}`} />
                  </button>
                  {open === i && (
                    <div className="border-t border-border px-5 py-4">
                      <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
              {filtered.length === 0 && (
                <p className="py-10 text-center text-sm text-muted-foreground">{t("helpNoResults1")} <Link href="/contact" className="text-primary hover:underline">{t("helpNoResults2")}</Link>.</p>
              )}
            </div>
          </div>
        </main>
        <SiteFooter />
    </>
  )
}

export default function HelpPage() {
  return (
    <LangProvider>
      <CartProvider>
        <HelpContent />
      </CartProvider>
    </LangProvider>
  )
}
