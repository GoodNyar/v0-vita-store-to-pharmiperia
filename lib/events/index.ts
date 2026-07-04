import 'server-only'

import { handleOrderPaid } from './order-paid'
import type { CommerceEvent } from './types'

export type { CommerceEvent, OrderPaidEvent } from './types'

export async function dispatchCommerceEvent(event: CommerceEvent): Promise<void> {
  switch (event.type) {
    case 'order.paid':
      await handleOrderPaid(event)
      break
  }
}