import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { resolveMarket } from '@/lib/commerce/resolve-market'

describe('resolveMarket', () => {
  it('prefers header over cookie and geo', () => {
    const result = resolveMarket({
      headerMarket: 'ee',
      cookieMarket: 'lt',
      geoCountryIso: 'LT',
    })
    assert.equal(result.code, 'ee')
    assert.equal(result.source, 'header')
    assert.equal(result.vatRateBps, 2200)
  })

  it('uses cookie when header absent', () => {
    const result = resolveMarket({
      cookieMarket: 'lt',
      geoCountryIso: 'LV',
    })
    assert.equal(result.code, 'lt')
    assert.equal(result.source, 'cookie')
  })

  it('uses geo country when no explicit market', () => {
    const result = resolveMarket({ geoCountryIso: 'lt' })
    assert.equal(result.code, 'lt')
    assert.equal(result.source, 'geo')
  })

  it('defaults to lv', () => {
    const result = resolveMarket({})
    assert.equal(result.code, 'lv')
    assert.equal(result.source, 'default')
    assert.equal(result.vatRateBps, 2100)
  })
})