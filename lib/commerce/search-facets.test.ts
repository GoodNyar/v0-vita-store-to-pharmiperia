import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { eur } from '@/lib/money'
import type { Product } from '@/lib/data'
import {
  applySearchFacetFilters,
  buildSearchFacets,
  buildSearchFacetsFromProducts,
  commerceToFacetProduct,
  formatCategoryFacetLabel,
  hasActiveSearchFacetFilters,
} from './search-facets'
import type { CommerceProduct } from './types'

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
    category: 'skincare',
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
    category: 'skincare',
    inStock: true,
  },
]

describe('formatCategoryFacetLabel', () => {
  it('capitalizes slug labels', () => {
    assert.equal(formatCategoryFacetLabel('skincare'), 'Skincare')
    assert.equal(formatCategoryFacetLabel('body-care'), 'Body care')
  })
})

describe('buildSearchFacets', () => {
  it('aggregates brand and category counts', () => {
    const facets = buildSearchFacets(sampleProducts)
    assert.equal(facets.brands.length, 2)
    assert.equal(facets.categories[0].value, 'skincare')
    assert.equal(facets.categories[0].label, 'Skincare')
    assert.equal(facets.onSaleCount, 1)
  })
})

describe('buildSearchFacetsFromProducts', () => {
  it('works with commerce facet shape', () => {
    const commerce: CommerceProduct = {
      id: 'uuid',
      legacyId: 1,
      slug: 'a',
      sku: '001',
      name: 'Alpha',
      description: '',
      howToUse: null,
      brandId: null,
      brandName: 'Bioderma',
      categoryId: null,
      categorySlug: 'skincare',
      price: eur(1000),
      originalPrice: eur(1200),
      volume: null,
      inStock: true,
      stockQuantity: 5,
      isFeatured: false,
      isNew: false,
      isBestseller: false,
      rating: 4,
      reviewCount: 1,
      imageUrl: null,
      locale: 'lv',
    }
    const facets = buildSearchFacetsFromProducts([commerceToFacetProduct(commerce)])
    assert.equal(facets.brands[0].value, 'Bioderma')
    assert.equal(facets.categories[0].label, 'Skincare')
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