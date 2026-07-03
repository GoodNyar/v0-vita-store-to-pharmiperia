import { SiteHeader } from "@/components/site-header"
import { CartDrawer } from "@/components/cart-drawer"
import { SiteFooter } from "@/components/site-footer"

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <CartDrawer />
      
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:py-10">
          {children}
        </div>
      </main>
      
      <SiteFooter />
    </div>
  )
}
