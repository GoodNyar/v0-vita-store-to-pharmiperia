import assert from 'node:assert/strict'
import { after, before, describe, it, mock, type MockModuleOptions } from 'node:test'
import { eur } from '@/lib/money'
import { commerceFail, commerceNotFound, commerceOk } from '@/lib/commerce/errors'
import type { CommerceProduct } from '@/lib/commerce/types'
import { mockServerOnlyModule } from '@/lib/test/node-mocks'

const mockProduct: CommerceProduct = {
  id: 'd1000001-0000-4000-8000-000000000001',
  legacyId: 1,
  slug: 'sensibio-h2o-micellar-water-02314',
  sku: '02314',
  name: 'Sensibio H2O',
  description: 'Micellar water',
  howToUse: null,
  brandId: 'b1000001-0000-4000-8000-000000000001',
  brandName: 'Bioderma',
  categoryId: 'c1000001-0000-4000-8000-000000000001',
  categorySlug: 'skincare',
  price: eur(1899),
  originalPrice: eur(2199),
  volume: '500 ml',
  inStock: true,
  stockQuantity: 100,
  isFeatured: false,
  isNew: false,
  isBestseller: true,
  rating: 4.8,
  reviewCount: 42,
  imageUrl: '/images/products/sensibio.jpg',
  locale: 'ru',
}

const productsMock: MockModuleOptions = {
  namedExports: {
    getProductByLegacyId: async (legacyId: number) => {
      if (legacyId === 1) {
        return commerceOk(mockProduct)
      }
      return commerceFail(commerceNotFound('product', String(legacyId)))
    },
  },
}

const marketPricingMock: MockModuleOptions = {
  namedExports: {
    applyMarketPricingToCommerceProduct: async (
      product: CommerceProduct,
      _marketCode: string
    ) => ({
      product,
      source: 'catalog_default' as const,
    }),
  },
}

describe('resolveOrderLines', () => {
  before(() => {
    mockServerOnlyModule()
    mock.module('@/lib/commerce/products', productsMock)
    mock.module('@/lib/commerce/apply-market-pricing', marketPricingMock)
  })

  after(() => {
    mock.restoreAll()
  })

  it('throws when cart is empty', async () => {
    const { resolveOrderLines } = await import('@/lib/orders')
    await assert.rejects(() => resolveOrderLines([], 'ru'), /Cart is empty/)
  })

  it('resolves line totals from catalog prices', async () => {
    const { resolveOrderLines } = await import('@/lib/orders')
    const lines = await resolveOrderLines([{ id: 1, quantity: 2 }], 'ru')

    assert.equal(lines.length, 1)
    assert.equal(lines[0].catalogProductId, 1)
    assert.equal(lines[0].sku, '02314')
    assert.equal(lines[0].quantity, 2)
    assert.equal(lines[0].unitPrice.amount, 1899)
    assert.equal(lines[0].lineTotal.amount, 3798)
  })

  it('clamps quantity to 1..99', async () => {
    const { resolveOrderLines } = await import('@/lib/orders')
    const lines = await resolveOrderLines([{ id: 1, quantity: 500 }], 'ru')
    assert.equal(lines[0].quantity, 99)
  })

  it('throws when product is missing', async () => {
    const { resolveOrderLines } = await import('@/lib/orders')
    await assert.rejects(
      () => resolveOrderLines([{ id: 999, quantity: 1 }], 'ru'),
      /Product not found/
    )
  })
})