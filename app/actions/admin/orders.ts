'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/admin/auth'
import { updateAdminOrderStatus } from '@/lib/commerce/admin-orders'
import { ORDER_STATUSES, type OrderStatus } from '@/lib/commerce/types'

export async function setOrderStatus(orderId: string, status: string): Promise<void> {
  await requireAdmin()

  if (!ORDER_STATUSES.includes(status as OrderStatus)) {
    throw new Error('Invalid order status')
  }

  await updateAdminOrderStatus(orderId, status as OrderStatus)
  revalidatePath('/admin/orders')
}