import assert from 'node:assert/strict'
import { after, before, describe, it, mock } from 'node:test'
import { mockServerOnlyModule } from '@/lib/test/node-mocks'

describe('payment-methods', () => {
  const original = process.env.STRIPE_BALTIC_METHODS_ENABLED

  before(() => {
    mockServerOnlyModule()
  })

  after(() => {
    mock.restoreAll()
    if (original === undefined) {
      delete process.env.STRIPE_BALTIC_METHODS_ENABLED
    } else {
      process.env.STRIPE_BALTIC_METHODS_ENABLED = original
    }
  })

  it('defaults to card-only when Baltic methods are not explicitly enabled', async () => {
    delete process.env.STRIPE_BALTIC_METHODS_ENABLED
    const { getCheckoutPaymentMethodTypes, isBalticPaymentMethodsEnabled } = await import(
      '@/lib/stripe/payment-methods'
    )
    assert.equal(isBalticPaymentMethodsEnabled(), false)
    assert.deepEqual(getCheckoutPaymentMethodTypes(), ['card'])
  })

  it('enables Baltic methods only when STRIPE_BALTIC_METHODS_ENABLED=true', async () => {
    process.env.STRIPE_BALTIC_METHODS_ENABLED = 'true'
    const { getCheckoutPaymentMethodTypes, isBalticPaymentMethodsEnabled } = await import(
      '@/lib/stripe/payment-methods'
    )
    assert.equal(isBalticPaymentMethodsEnabled(), true)
    assert.deepEqual(getCheckoutPaymentMethodTypes(), ['card', 'link', 'paypal', 'klarna'])
  })
})