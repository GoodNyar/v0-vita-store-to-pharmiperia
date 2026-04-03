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
      
      <main className="flex-1 mx-auto max-w-6xl w-full px-4 py-8 sm:py-12">
        {children}
      </main>
      
      <SiteFooter />
    </div>
  )
}
