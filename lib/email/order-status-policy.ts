import type { OrderStatus } from '@/lib/commerce/types'

export type OrderStatusEmail = 'shipped' | 'review_request' | 'refund_notice'

export function getOrderStatusEmail(status: OrderStatus): OrderStatusEmail | null {
  switch (status) {
    case 'shipped':
      return 'shipped'
    case 'delivered':
      return 'review_request'
    case 'refunded':
      return 'refund_notice'
    default:
      return null
  }
}
