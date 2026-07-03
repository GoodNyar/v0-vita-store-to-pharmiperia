'use client'

import { useTransition } from 'react'
import { setOrderStatus } from '@/app/actions/admin/orders'
import { ORDER_STATUSES } from '@/lib/commerce/types'

export function OrderStatusForm({
  orderId,
  currentStatus,
}: {
  orderId: string
  currentStatus: string
}) {
  const [pending, startTransition] = useTransition()

  return (
    <select
      aria-label="Order status"
      className="rounded-md border border-border bg-background px-2 py-1 text-sm"
      value={currentStatus}
      disabled={pending}
      onChange={(event) => {
        const nextStatus = event.target.value
        startTransition(async () => {
          await setOrderStatus(orderId, nextStatus)
        })
      }}
    >
      {ORDER_STATUSES.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  )
}