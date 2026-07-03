import * as Sentry from '@sentry/nextjs'

import { isSentryEnabled } from '@/lib/sentry/shared'

export type CheckoutStage =
  | 'session_create'
  | 'session_fetch'
  | 'embedded_checkout'
  | 'webhook_fulfill'
  | 'webhook_email'

export interface CheckoutErrorContext {
  stage: CheckoutStage
  orderId?: string
  orderNumber?: string
  sessionId?: string
}

export function captureCheckoutError(error: unknown, context: CheckoutErrorContext): void {
  const runtime = typeof window === 'undefined' ? 'server' : 'client'
  if (!isSentryEnabled(runtime)) return

  Sentry.withScope((scope) => {
    scope.setTag('commerce.checkout', 'true')
    scope.setTag('commerce.stage', context.stage)
    scope.setLevel('error')

    if (context.orderId || context.orderNumber || context.sessionId) {
      scope.setContext('checkout', {
        orderId: context.orderId ?? null,
        orderNumber: context.orderNumber ?? null,
        sessionId: context.sessionId ?? null,
      })
    }

    const exception = error instanceof Error ? error : new Error(String(error))
    Sentry.captureException(exception)
  })
}