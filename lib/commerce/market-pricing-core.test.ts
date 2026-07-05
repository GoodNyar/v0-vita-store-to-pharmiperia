import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { resolveMarketPrice } from '@/lib/commerce/market-pricing-core'

describe('resolveMarketPrice', () => {
  it('uses catalog default when no override', () => {
    const result = resolveMarketPrice(1999, 2499, 'EUR', null)
    assert.equal(result.price.amount, 1999)
    assert.equal(result.originalPrice?.amount, 2499)
    assert.equal(result.source, 'catalog_default')
  })

  it('uses market override when present', () => {
    const result = resolveMarketPrice(1999, 2499, 'EUR', {
      priceCents: 1799,
      originalPriceCents: 2199,
      currency: 'EUR',
    })
    assert.equal(result.price.amount, 1799)
    assert.equal(result.originalPrice?.amount, 2199)
    assert.equal(result.source, 'market_override')
  })
})