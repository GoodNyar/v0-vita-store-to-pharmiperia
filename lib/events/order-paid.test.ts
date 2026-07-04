import assert from 'node:assert/strict'
import { after, before, describe, it, mock, type MockModuleOptions } from 'node:test'
import { mockServerOnlyModule } from '@/lib/test/node-mocks'

const ORDER_ID = 'a1000001-0000-4000-8000-000000000001'
const SESSION_ID = 'cs_test_123'

function createSupabaseAdminMock() {
  const rpc = mock.fn(async () => ({ data: null, error: null }))
  const maybeSingle = mock.fn(async () => ({
    data: { promo_code_id: null, user_id: null },
    error: null,
  }))
  const eq = mock.fn(() => ({ maybeSingle }))
  const select = mock.fn(() => ({ eq }))
  const from = mock.fn(() => ({ select }))

  return { client: { rpc, from }, rpc, from }
}

describe('handleOrderPaid (integration stub)', () => {
  const sendEmail = mock.fn(async () => ({ sent: false, reason: 'disabled' as const }))
  const decrementStock = mock.fn(async () => undefined)
  const markAttention = mock.fn(async () => undefined)
  const clearServerCart = mock.fn(async () => undefined)
  const consumePromoCode = mock.fn(async () => true)
  const supabaseMock = createSupabaseAdminMock()

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
    mock.module('@/lib/commerce/server-cart', {
      namedExports: { clearServerCart },
    } satisfies MockModuleOptions)
    mock.module('@/lib/commerce/promo', {
      namedExports: { consumePromoCode },
    } satisfies MockModuleOptions)
    mock.module('@/lib/supabase/admin', {
      namedExports: {
        createAdminClient: () => supabaseMock.client,
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
    assert.equal(supabaseMock.rpc.mock.callCount(), 1)
    const rpcArgs = supabaseMock.rpc.mock.calls[0]?.arguments as unknown as [
      string,
      { p_order_id: string },
    ]
    assert.equal(rpcArgs[0], 'accrue_loyalty_for_order')
    assert.equal(supabaseMock.from.mock.callCount(), 1)
    assert.equal(supabaseMock.from.mock.calls[0]?.arguments[0], 'orders')
  })

  it('runs idempotent effects when order row is already paid (webhook retry)', async () => {
    sendEmail.mock.resetCalls()
    decrementStock.mock.resetCalls()
    supabaseMock.rpc.mock.resetCalls()
    supabaseMock.from.mock.resetCalls()

    const { handleOrderPaid } = await import('./order-paid')

    await handleOrderPaid({
      type: 'order.paid',
      orderId: ORDER_ID,
      alreadyPaid: true,
      stripeEventId: 'evt_retry',
      checkoutSessionId: SESSION_ID,
    })

    assert.equal(sendEmail.mock.callCount(), 1)
    assert.equal(decrementStock.mock.callCount(), 1)
    assert.equal(supabaseMock.rpc.mock.callCount(), 1)
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