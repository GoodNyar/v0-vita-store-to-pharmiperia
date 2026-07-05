import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  getMarketDefinition,
  isMarketCode,
  marketCodeFromCountryIso,
} from '@/lib/commerce/markets-config'

describe('markets-config', () => {
  it('validates market codes', () => {
    assert.equal(isMarketCode('lv'), true)
    assert.equal(isMarketCode('xx'), false)
  })

  it('maps country ISO to market', () => {
    assert.equal(marketCodeFromCountryIso('EE'), 'ee')
    assert.equal(marketCodeFromCountryIso('de'), null)
  })

  it('exposes OSS flag for LT/EE', () => {
    assert.equal(getMarketDefinition('lv').ossEnabled, false)
    assert.equal(getMarketDefinition('lt').ossEnabled, true)
    assert.equal(getMarketDefinition('ee').ossEnabled, true)
  })
})