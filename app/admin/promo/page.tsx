import { requirePermission } from '@/lib/admin/rbac'
import { listAdminPromoCodes } from '@/lib/commerce/admin-promo'
import { formatMoney, moneyFromDb } from '@/lib/money'

export const dynamic = 'force-dynamic'

function formatDiscount(type: string, valueCents: number): string {
  if (type === 'percent') {
    return `${(valueCents / 100).toFixed(0)}%`
  }
  return formatMoney(moneyFromDb(valueCents))
}

function formatDate(value: string | null): string {
  if (!value) return '—'
  return new Intl.DateTimeFormat('lv-LV', { dateStyle: 'medium' }).format(new Date(value))
}

export default async function AdminPromoPage() {
  await requirePermission('promo:read')
  const promos = await listAdminPromoCodes()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Promo codes</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Read-only campaign overview. Checkout validates codes via{' '}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">validate_promo_code</code> RPC —
          public enumeration is disabled (ADR M-1).
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-foreground">Code</th>
              <th className="px-4 py-3 text-left font-medium text-foreground">Discount</th>
              <th className="px-4 py-3 text-left font-medium text-foreground">Min order</th>
              <th className="px-4 py-3 text-left font-medium text-foreground">Usage</th>
              <th className="px-4 py-3 text-left font-medium text-foreground">Valid</th>
              <th className="px-4 py-3 text-left font-medium text-foreground">Active</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card">
            {promos.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  No promo codes configured.
                </td>
              </tr>
            ) : (
              promos.map((promo) => (
                <tr key={promo.id}>
                  <td className="px-4 py-3 font-mono text-xs font-medium text-foreground">
                    {promo.code}
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    {formatDiscount(promo.discountType, promo.discountValueCents)}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatMoney(moneyFromDb(promo.minOrderAmountCents))}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {promo.usedCount}
                    {promo.maxUses != null ? ` / ${promo.maxUses}` : ''}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(promo.validFrom)} — {formatDate(promo.validUntil)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        promo.isActive ? 'text-green-600' : 'text-muted-foreground'
                      }
                    >
                      {promo.isActive ? 'yes' : 'no'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground">
        Phase 3 stub — create/edit UI and manager write actions will follow in a later PR.
      </p>
    </div>
  )
}