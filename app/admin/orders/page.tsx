import { OrderStatusForm } from '@/components/admin/order-status-form'
import { listAdminOrders } from '@/lib/commerce/admin-orders'
import { formatMoney, moneyFromDb } from '@/lib/money'

export const dynamic = 'force-dynamic'

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('lv-LV', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export default async function AdminOrdersPage() {
  const orders = await listAdminOrders()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Orders</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Latest {orders.length} orders. Status updates apply immediately via RLS.
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-foreground">Order</th>
              <th className="px-4 py-3 text-left font-medium text-foreground">Customer</th>
              <th className="px-4 py-3 text-left font-medium text-foreground">Payment</th>
              <th className="px-4 py-3 text-left font-medium text-foreground">Total</th>
              <th className="px-4 py-3 text-left font-medium text-foreground">Created</th>
              <th className="px-4 py-3 text-left font-medium text-foreground">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  No orders yet.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-3 font-medium text-foreground">{order.orderNumber}</td>
                  <td className="px-4 py-3">
                    <div>{order.firstName} {order.lastName}</div>
                    <div className="text-xs text-muted-foreground">{order.email}</div>
                  </td>
                  <td className="px-4 py-3 capitalize text-muted-foreground">
                    {order.paymentStatus}
                  </td>
                  <td className="px-4 py-3">
                    {formatMoney(
                      moneyFromDb(order.totalCents, order.currency as 'EUR')
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <OrderStatusForm orderId={order.id} currentStatus={order.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}