import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { eur } from '@/lib/money'
import {
  computeCatalogMaxPriceMajor,
  isPriceFilterActive,
} from './catalog-filters'

describe('catalog-filters', () => {
  it('computes max price from catalog products', () => {
    assert.equal(
      computeCatalogMaxPriceMajor([eur(1899), eur(4599), eur(12000)]),
      120
    )
  })

  it('falls back when catalog is empty', () => {
    assert.equal(computeCatalogMaxPriceMajor([]), 100)
  })

  it('detects active price filter against catalog max', () => {
    assert.equal(isPriceFilterActive([0, 120], 120), false)
    assert.equal(isPriceFilterActive([10, 120], 120), true)
    assert.equal(isPriceFilterActive([0, 99], 120), true)
  })
})