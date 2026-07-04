import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { eur } from '@/lib/money'
import type { Product } from '@/lib/data'
import {
  applySearchFacetFilters,
  buildSearchFacets,
  hasActiveSearchFacetFilters,
} from './search-facets'

const sampleProducts: Product[] = [
  {
    id: 1,
    sku: '001',
    name: 'Alpha',
    brand: 'Bioderma',
    volume: '100 ml',
    description: '',
    price: eur(1000),
    originalPrice: eur(1200),
    rating: 4.5,
    reviewCount: 10,
    image: '/a.jpg',
    category: 'Skincare',
    inStock: true,
  },
  {
    id: 2,
    sku: '002',
    name: 'Beta',
    brand: 'Vichy',
    volume: '50 ml',
    description: '',
    price: eur(2000),
    rating: 4.0,
    reviewCount: 5,
    image: '/b.jpg',
    category: 'Skincare',
    inStock: true,
  },
]

describe('buildSearchFacets', () => {
  it('aggregates brand and category counts', () => {
    const facets = buildSearchFacets(sampleProducts)
    assert.equal(facets.brands.length, 2)
    assert.equal(facets.categories[0].value, 'Skincare')
    assert.equal(facets.categories[0].count, 2)
    assert.equal(facets.onSaleCount, 1)
  })
})

describe('applySearchFacetFilters', () => {
  it('filters by brand and on-sale flag', () => {
    const filtered = applySearchFacetFilters(sampleProducts, {
      brands: ['Bioderma'],
      categories: [],
      onSaleOnly: true,
    })
    assert.equal(filtered.length, 1)
    assert.equal(filtered[0].brand, 'Bioderma')
  })
})

describe('hasActiveSearchFacetFilters', () => {
  it('detects active filters', () => {
    assert.equal(hasActiveSearchFacetFilters({ brands: [], categories: [], onSaleOnly: false }), false)
    assert.equal(hasActiveSearchFacetFilters({ brands: ['Vichy'], categories: [], onSaleOnly: false }), true)
  })
})