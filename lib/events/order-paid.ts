import 'server-only'

import { consumePromoCode } from '@/lib/commerce/promo'
import { clearServerCart } from '@/lib/commerce/server-cart'
import { sendOrderConfirmationEmail } from '@/lib/email/order-confirmation'
import { decrementStockForOrder } from '@/lib/inventory/decrement'
import { isInsufficientStockError } from '@/lib/inventory/errors'
import {
  markOrderNeedsInventoryAttention,
} from '@/lib/orders'
import { captureCheckoutError } from '@/lib/sentry/capture-checkout'
import { createAdminClient } from '@/lib/supabase/admin'
import type { OrderPaidEvent } from './types'

async function accrueLoyaltyForOrder(orderId: string): Promise<void> {
  const supabase = createAdminClient()
  const { error } = await supabase.rpc('accrue_loyalty_for_order', { p_order_id: orderId })
  if (error) {
    console.warn('[events/order.paid] loyalty accrual failed', { orderId, error: error.message })
  }
}

/**
 * Runs paid-order side effects idempotently. Each step guards itself (email sent_at,
 * inventory_adjusted_at, loyalty UNIQUE, promo_consumed_at) — safe on webhook retry
 * regardless of orders.payment_status already being paid.
 */
export async function handleOrderPaid(event: OrderPaidEvent): Promise<void> {
  const { orderId, checkoutSessionId } = event

  try {
    const emailResult = await sendOrderConfirmationEmail(orderId)
    if (emailResult.sent) {
      console.info('[events/order.paid] confirmation email sent', {
        orderId,
        messageId: emailResult.messageId,
      })
    }
  } catch (emailErr) {
    captureCheckoutError(emailErr, {
      stage: 'webhook_email',
      orderId,
      sessionId: checkoutSessionId,
    })
    console.error('[events/order.paid] email failed (continuing)', emailErr)
  }

  try {
    await decrementStockForOrder(orderId)
  } catch (decrementErr) {
    if (isInsufficientStockError(decrementErr)) {
      captureCheckoutError(decrementErr, {
        stage: 'webhook_fulfill',
        orderId,
        sessionId: checkoutSessionId,
      })
      await markOrderNeedsInventoryAttention(orderId)
    } else {
      throw decrementErr
    }
  }

  await accrueLoyaltyForOrder(orderId)

  const supabase = createAdminClient()
  const { data: order } = await supabase
    .from('orders')
    .select('promo_code_id, user_id')
    .eq('id', orderId)
    .maybeSingle()

  if (order?.promo_code_id) {
    try {
      await consumePromoCode(order.promo_code_id, orderId)
    } catch (promoErr) {
      console.warn('[events/order.paid] promo consumption failed', { orderId, promoErr })
    }
  }

  if (order?.user_id) {
    try {
      await clearServerCart(order.user_id)
    } catch (cartErr) {
      console.warn('[events/order.paid] server cart clear failed', { orderId, cartErr })
    }
  }
}