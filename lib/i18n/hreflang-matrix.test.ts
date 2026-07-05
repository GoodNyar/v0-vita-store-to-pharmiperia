import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { buildMarketHreflangLanguages } from '@/lib/i18n/hreflang-matrix'

describe('buildMarketHreflangLanguages', () => {
  it('includes lv, ru and expansion locales', () => {
    const languages = buildMarketHreflangLanguages('/delivery', (path) => `https://pharm.lv${path}`)
    assert.ok(languages['lv-LV']?.includes('/lv/delivery'))
    assert.ok(languages['ru-LV']?.includes('/ru/delivery'))
    assert.ok(languages['lt-LT'])
    assert.ok(languages['et-EE'])
    assert.ok(languages['x-default'])
  })
})