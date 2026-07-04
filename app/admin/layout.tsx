import Link from 'next/link'
import { AdminAccessError, requireStaff } from '@/lib/admin/auth'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  try {
    await requireStaff()
  } catch (error) {
    if (error instanceof AdminAccessError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
          <div className="max-w-md rounded-lg border border-border bg-card p-8 text-center">
            <h1 className="text-2xl font-semibold text-foreground">403 — Forbidden</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Admin access is required to view this area.
            </p>
            <Link
              href="/lv"
              className="mt-6 inline-block text-sm font-medium text-primary hover:underline"
            >
              Back to storefront
            </Link>
          </div>
        </div>
      )
    }
    throw error
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Pharmiperia Admin
            </p>
            <nav className="mt-2 flex gap-4 text-sm">
              <Link href="/admin/orders" className="text-foreground hover:text-primary">
                Orders
              </Link>
              <Link href="/admin/products" className="text-foreground hover:text-primary">
                Products
              </Link>
              <Link href="/admin/promo" className="text-foreground hover:text-primary">
                Promo
              </Link>
            </nav>
          </div>
          <Link href="/lv" className="text-sm text-muted-foreground hover:text-primary">
            Storefront
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  )
}