import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { validateFeedRow } from '@/lib/commerce/feed-import-validation'

describe('validateFeedRow', () => {
  it('accepts minimal valid row', () => {
    const errors = validateFeedRow({
      sku: 'SKU-1',
      slug: 'product-1',
      name_ru: 'Тест',
      price_cents: 1999,
    })
    assert.deepEqual(errors, [])
  })

  it('rejects missing sku and invalid price', () => {
    const errors = validateFeedRow({
      slug: 'x',
      name_lv: 'Test',
      price_cents: -1,
    })
    assert.ok(errors.includes('missing_sku'))
    assert.ok(errors.includes('invalid_price_cents'))
  })
})