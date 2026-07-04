import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { eur } from '@/lib/money'
import {
  mapCommerceToLegacyProduct,
  mapDbProductToCommerce,
  pricesMatchLegacy,
} from './product-mapper'
import type { DbProduct } from './types'

const sampleRow: DbProduct & {
  brands: { name: string; slug: string }
  categories: { slug: string }
  product_images: { image_url: string; is_primary: boolean; sort_order: number }[]
} = {
  id: 'd1000001-0000-4000-8000-000000000001',
  sku: '02314',
  slug: 'sensibio-h2o-micellar-water-02314',
  name_ru: 'Sensibio H2O',
  name_lv: 'Sensibio H2O LV',
  description_ru: 'Описание',
  description_lv: 'Apraksts',
  how_to_use_ru: null,
  how_to_use_lv: null,
  brand_id: 'b1000001-0000-4000-8000-000000000001',
  category_id: 'c1000001-0000-4000-8000-000000000001',
  price_cents: 1899,
  original_price_cents: 2199,
  currency: 'EUR',
  volume: '500 ml',
  stock_quantity: 12,
  is_active: true,
  is_featured: true,
  is_new: false,
  is_bestseller: true,
  rating: 4.8,
  review_count: 42,
  search_vector: null,
  ingredients: null,
  created_at: null,
  updated_at: null,
  brands: { name: 'Bioderma', slug: 'bioderma' },
  categories: { slug: 'skincare' },
  product_images: [
    { image_url: '/images/products/sensibio.jpg', is_primary: true, sort_order: 0 },
  ],
}

describe('mapDbProductToCommerce', () => {
  it('maps UUID row to commerce product with legacy id', () => {
    const product = mapDbProductToCommerce(sampleRow, 'ru')
    assert.equal(product.legacyId, 1)
    assert.equal(product.name, 'Sensibio H2O')
    assert.deepEqual(product.price, eur(1899))
    assert.equal(product.inStock, true)
    assert.equal(product.brandName, 'Bioderma')
  })

  it('uses locale-specific name', () => {
    const lv = mapDbProductToCommerce(sampleRow, 'lv')
    assert.equal(lv.name, 'Sensibio H2O LV')
  })
})

describe('mapCommerceToLegacyProduct', () => {
  it('round-trips to legacy Product shape', () => {
    const commerce = mapDbProductToCommerce(sampleRow, 'ru')
    const legacy = mapCommerceToLegacyProduct(commerce)
    assert.equal(legacy.id, 1)
    assert.equal(legacy.sku, '02314')
    assert.equal(legacy.price.amount, 1899)
    assert.ok(legacy.image.includes('sensibio'))
  })
})

describe('pricesMatchLegacy', () => {
  it('detects matching cents', () => {
    assert.equal(pricesMatchLegacy(1899, 1899), true)
    assert.equal(pricesMatchLegacy(1899, 1900), false)
  })
})