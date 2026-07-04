'use server'

import { revalidatePath } from 'next/cache'
import { requirePermission } from '@/lib/admin/rbac'
import { updateAdminOrderStatus } from '@/lib/commerce/admin-orders'
import { ORDER_STATUSES, type OrderStatus } from '@/lib/commerce/types'
import { sendReviewRequestEmail } from '@/lib/email/review-request'

export async function setOrderStatus(orderId: string, status: string): Promise<void> {
  await requirePermission('orders:write')

  if (!ORDER_STATUSES.includes(status as OrderStatus)) {
    throw new Error('Invalid order status')
  }

  await updateAdminOrderStatus(orderId, status as OrderStatus)
  revalidatePath('/admin/orders')

  if (status === 'delivered') {
    void sendReviewRequestEmail(orderId).catch((err) => {
      console.warn('[admin] review request email failed', { orderId, err })
    })
  }
}