import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  parseStorefrontMarket,
  requireStorefrontMarket,
} from '@/lib/commerce/storefront-parse'

describe('storefront market parsing', () => {
  it('parses valid market codes', () => {
    assert.equal(parseStorefrontMarket('lt'), 'lt')
    assert.equal(parseStorefrontMarket('bad'), null)
  })

  it('requireStorefrontMarket fails on invalid input', () => {
    const result = requireStorefrontMarket(null)
    assert.equal(result.ok, false)
    if (!result.ok) {
      assert.equal(result.error.code, 'validation')
    }
  })

  it('requireStorefrontMarket accepts valid market', () => {
    const result = requireStorefrontMarket('ee')
    assert.equal(result.ok, true)
    if (result.ok) {
      assert.equal(result.data, 'ee')
    }
  })
})