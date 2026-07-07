import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { hasCatalogLoadError, type CatalogListResult } from './catalog-result'

describe('catalog-source', () => {
  it('detects catalog load errors', () => {
    const failed: CatalogListResult = {
      products: [],
      source: 'db',
      loadError: 'database_unavailable',
    }
    const ok: CatalogListResult = {
      products: [],
      source: 'db',
      loadError: null,
    }

    assert.equal(hasCatalogLoadError(failed), true)
    assert.equal(hasCatalogLoadError(ok), false)
  })
})