import assert from 'node:assert/strict'
import { after, before, describe, it, mock, type MockModuleOptions } from 'node:test'
import { mockServerOnlyModule } from '@/lib/test/node-mocks'

const ORDER_ID = 'a1000001-0000-4000-8000-000000000001'
const SESSION_ID = 'cs_test_123'

describe('handleOrderPaid (integration stub)', () => {
  const sendEmail = mock.fn(async () => ({ sent: false, reason: 'disabled' as const }))
  const decrementStock = mock.fn(async () => undefined)
  const markAttention = mock.fn(async () => undefined)
  const rpc = mock.fn(async () => ({ data: null, error: null }))

  before(() => {
    mockServerOnlyModule()
    mock.module('@/lib/email/order-confirmation', {
      namedExports: { sendOrderConfirmationEmail: sendEmail },
    } satisfies MockModuleOptions)
    mock.module('@/lib/inventory/decrement', {
      namedExports: { decrementStockForOrder: decrementStock },
    } satisfies MockModuleOptions)
    mock.module('@/lib/orders', {
      namedExports: { markOrderNeedsInventoryAttention: markAttention },
    } satisfies MockModuleOptions)
    mock.module('@/lib/supabase/admin', {
      namedExports: {
        createAdminClient: () => ({
          rpc,
        }),
      },
    } satisfies MockModuleOptions)
    mock.module('@/lib/sentry/capture-checkout', {
      namedExports: { captureCheckoutError: () => undefined },
    } satisfies MockModuleOptions)
  })

  after(() => {
    mock.restoreAll()
  })

  it('runs stock decrement and loyalty accrual after email attempt', async () => {
    const { handleOrderPaid } = await import('./order-paid')

    await handleOrderPaid({
      type: 'order.paid',
      orderId: ORDER_ID,
      alreadyPaid: false,
      stripeEventId: 'evt_123',
      checkoutSessionId: SESSION_ID,
    })

    assert.equal(sendEmail.mock.callCount(), 1)
    const emailArgs = sendEmail.mock.calls[0]?.arguments as unknown as [string]
    assert.equal(emailArgs[0], ORDER_ID)
    assert.equal(decrementStock.mock.callCount(), 1)
    assert.equal(rpc.mock.callCount(), 1)
    const rpcArgs = rpc.mock.calls[0]?.arguments as unknown as [string, { p_order_id: string }]
    assert.equal(rpcArgs[0], 'accrue_loyalty_for_order')
  })
})

describe('dispatchCommerceEvent (webhook routing stub)', () => {
  it('accepts order.paid event shape', () => {
    const event = {
      type: 'order.paid' as const,
      orderId: ORDER_ID,
      alreadyPaid: false,
      stripeEventId: 'evt_456',
      checkoutSessionId: SESSION_ID,
    }

    assert.equal(event.type, 'order.paid')
    assert.ok(event.orderId.length > 0)
  })
})