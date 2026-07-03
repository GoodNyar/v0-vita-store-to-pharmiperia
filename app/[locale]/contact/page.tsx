"use client"

import { useState } from "react"
import Link from "next/link"
import { LangProvider, useLang } from "@/lib/i18n"
import { getInfoEmail } from "@/lib/site"
import { CartProvider } from "@/components/cart-context"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CartDrawer } from "@/components/cart-drawer"
import { Button } from "@/components/ui/button"
import { 
  ChevronRight, Mail, Phone, MapPin, Clock, 
  Send, MessageSquare, Loader2 
} from "lucide-react"

function ContactContent() {
  const { t } = useLang()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate sending
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setSuccess(true)
    setLoading(false)
    setName("")
    setEmail("")
    setSubject("")
    setMessage("")
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <CartDrawer />

      {/* Breadcrumbs */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 text-sm">
          <Link href="/" className="text-muted-foreground hover:text-primary">
            {t("breadcrumbHome")}
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-foreground">{t("contactBreadcrumb")}</span>
        </div>
      </div>

      <main className="flex-1 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">
              {t("contactTitle")}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              {t("contactSubtitle")}
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{t("contactPhoneTitle")}</h3>
                    <p className="mt-1 text-muted-foreground">+371 20 123 456</p>
                    <p className="text-sm text-muted-foreground">{t("contactPhoneHours")}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{t("contactEmailTitle")}</h3>
                    <p className="mt-1 text-muted-foreground">{getInfoEmail()}</p>
                    <p className="text-sm text-muted-foreground">{t("contactEmailReply")}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{t("contactAddressTitle")}</h3>
                    <p className="mt-1 text-muted-foreground">
                      Brivibas iela 100<br />
                      Riga, LV-1001<br />
                      Latvia
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{t("contactHoursTitle")}</h3>
                    <p className="mt-1 text-muted-foreground">
                      {t("contactHoursText")}<br />
                      {t("contactHoursSat")}<br />
                      {t("contactHoursSun")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="rounded-xl border border-border bg-card p-6 lg:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <MessageSquare className="h-6 w-6 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">{t("contactFormTitle")}</h2>
                </div>

                {success ? (
                  <div className="rounded-lg border border-primary/50 bg-primary/10 p-6 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                      <Send className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{t("contactSuccessTitle")}</h3>
                    <p className="mt-2 text-muted-foreground">
                      {t("contactSuccessDesc")}
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setSuccess(false)}
                    >
                      {t("contactSendMore")}
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-foreground">
                          {t("contactNameLabel")}
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          placeholder={t("contactNamePlaceholder")}
                          className="h-11 w-full rounded-lg border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-foreground">
                          {t("contactEmailLabel")}
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          placeholder="example@email.com"
                          className="h-11 w-full rounded-lg border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">
                        {t("contactSubjectLabel")}
                      </label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                        className="h-11 w-full rounded-lg border border-border bg-background px-4 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="">{t("contactSubjectSelect")}</option>
                        <option value="order">{t("contactSubjectOrder")}</option>
                        <option value="product">{t("contactSubjectProduct")}</option>
                        <option value="delivery">{t("contactSubjectDelivery")}</option>
                        <option value="return">{t("contactSubjectReturn")}</option>
                        <option value="partnership">{t("contactSubjectPartnership")}</option>
                        <option value="other">{t("contactSubjectOther")}</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">
                        {t("contactMessageLabel")}
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        rows={5}
                        placeholder={t("contactMessagePlaceholder")}
                        className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="h-11 w-full bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t("contactSending")}
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          {t("contactSendMessage")}
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

export default function ContactPage() {
  return (
    <LangProvider>
      <CartProvider>
        <ContactContent />
      </CartProvider>
    </LangProvider>
  )
}
