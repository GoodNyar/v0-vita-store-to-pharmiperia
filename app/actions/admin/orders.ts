'use server'

import { revalidatePath } from 'next/cache'
import { requirePermission } from '@/lib/admin/rbac'
import { updateAdminOrderStatus } from '@/lib/commerce/admin-orders'
import { ORDER_STATUSES, type OrderStatus } from '@/lib/commerce/types'
import { getOrderStatusEmail } from '@/lib/email/order-status-policy'
import { sendRefundNoticeEmail } from '@/lib/email/refund-notice'
import { sendReviewRequestEmail } from '@/lib/email/review-request'
import { sendOrderShippedEmail } from '@/lib/email/shipped'

async function sendStatusEmail(orderId: string, status: OrderStatus): Promise<void> {
  const email = getOrderStatusEmail(status)

  switch (email) {
    case 'shipped':
      await sendOrderShippedEmail(orderId)
      break
    case 'review_request':
      await sendReviewRequestEmail(orderId)
      break
    case 'refund_notice':
      await sendRefundNoticeEmail(orderId)
      break
  }
}

export async function setOrderStatus(orderId: string, status: string): Promise<void> {
  await requirePermission('orders:write')

  if (!ORDER_STATUSES.includes(status as OrderStatus)) {
    throw new Error('Invalid order status')
  }

  await updateAdminOrderStatus(orderId, status as OrderStatus)
  revalidatePath('/admin/orders')

  const resolvedStatus = status as OrderStatus
  const statusEmail = getOrderStatusEmail(resolvedStatus)
  if (statusEmail) {
    void sendStatusEmail(orderId, resolvedStatus).catch((err) => {
      console.warn('[admin] order status email failed', { orderId, status, statusEmail, err })
    })
  }
}
