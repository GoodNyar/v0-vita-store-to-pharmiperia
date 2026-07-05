import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { eur } from '@/lib/money'
import { findShippingMethodByCost } from '@/lib/commerce/market-shipping-core'

describe('findShippingMethodByCost', () => {
  const methods = [
    {
      code: 'omniva_locker',
      carrier: 'omniva',
      name: 'Omniva',
      cost: eur(295),
      supportsParcelLocker: true,
    },
    {
      code: 'dpd_locker',
      carrier: 'dpd',
      name: 'DPD',
      cost: eur(299),
      supportsParcelLocker: true,
    },
  ]

  it('finds matching method', () => {
    const match = findShippingMethodByCost(methods, eur(295))
    assert.equal(match?.code, 'omniva_locker')
  })

  it('returns null when cost not allowed', () => {
    assert.equal(findShippingMethodByCost(methods, eur(999)), null)
  })
})