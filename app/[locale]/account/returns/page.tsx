import Link from "next/link"
import { redirect } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CartDrawer } from "@/components/cart-drawer"
import { ReturnRequestPanel } from "@/components/return-request-panel"
import { fetchReturnRequests } from "@/app/actions/returns"
import { createClient } from "@/lib/supabase/server"
import { isLocale } from "@/lib/i18n/config"
import { translate } from "@/lib/i18n/dictionary"
import { ChevronLeft } from "lucide-react"

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function AccountReturnsPage({ params }: PageProps) {
  const { locale: localeParam } = await params
  if (!isLocale(localeParam)) {
    redirect("/lv/account")
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/${localeParam}/auth/login`)
  }

  const result = await fetchReturnRequests()
  const t = (key: Parameters<typeof translate>[1]) => translate(localeParam, key)

  if (!result.ok) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <SiteHeader />
        <CartDrawer />
        <main className="mx-auto max-w-4xl flex-1 px-4 py-8">
          <p className="text-muted-foreground">{t("returnLoadError")}</p>
        </main>
        <SiteFooter />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <CartDrawer />

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <Link
            href={`/${localeParam}/account`}
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            {t("accountTitle")}
          </Link>

          <h1 className="mb-2 text-2xl font-bold text-foreground">{t("returnAccountTitle")}</h1>
          <p className="mb-8 text-muted-foreground">{t("returnAccountSubtitle")}</p>

          <ReturnRequestPanel
            initialRequests={result.requests}
            eligibleOrders={result.eligibleOrders}
          />
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}