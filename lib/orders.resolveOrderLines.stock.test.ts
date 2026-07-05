import assert from 'node:assert/strict'
import { after, before, describe, it, mock, type MockModuleOptions } from 'node:test'
import { eur } from '@/lib/money'
import { commerceOk } from '@/lib/commerce/errors'
import type { CommerceProduct } from '@/lib/commerce/types'
import { mockServerOnlyModule } from '@/lib/test/node-mocks'

const outOfStockProduct: CommerceProduct = {
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
  inStock: false,
  stockQuantity: 0,
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
    getProductByLegacyId: async () => commerceOk(outOfStockProduct),
  },
}

const marketPricingMock: MockModuleOptions = {
  namedExports: {
    applyMarketPricingToCommerceProduct: async (product: CommerceProduct) => ({
      product,
      source: 'catalog_default' as const,
    }),
  },
}

describe('resolveOrderLines out of stock', () => {
  before(() => {
    mockServerOnlyModule()
    mock.module('@/lib/commerce/products', productsMock)
    mock.module('@/lib/commerce/apply-market-pricing', marketPricingMock)
  })

  after(() => {
    mock.restoreAll()
  })

  it('throws when product is out of stock', async () => {
    const { resolveOrderLines } = await import('@/lib/orders')
    await assert.rejects(
      () => resolveOrderLines([{ id: 1, quantity: 1 }], 'ru'),
      /out of stock/
    )
  })
})