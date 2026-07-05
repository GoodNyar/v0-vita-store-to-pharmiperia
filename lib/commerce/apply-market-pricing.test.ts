import assert from 'node:assert/strict'
import { after, before, describe, it, mock, type MockModuleOptions } from 'node:test'
import { eur } from '@/lib/money'
import { commerceOk } from '@/lib/commerce/errors'
import type { CommerceProduct } from '@/lib/commerce/types'
import { mockServerOnlyModule } from '@/lib/test/node-mocks'

const baseProduct: CommerceProduct = {
  id: 'd1000001-0000-4000-8000-000000000001',
  legacyId: 1,
  slug: 'test-product',
  sku: 'SKU-1',
  name: 'Test',
  description: null,
  howToUse: null,
  brandId: null,
  brandName: null,
  categoryId: null,
  categorySlug: null,
  price: eur(1999),
  originalPrice: eur(2499),
  volume: null,
  inStock: true,
  stockQuantity: 10,
  isFeatured: false,
  isNew: false,
  isBestseller: false,
  rating: 0,
  reviewCount: 0,
  imageUrl: null,
  locale: 'lv',
}

const pricingMock: MockModuleOptions = {
  namedExports: {
    getMarketPriceForProduct: async (
      _productId: string,
      marketCode: string,
      catalog: { priceCents: number; originalPriceCents: number | null }
    ) =>
      commerceOk({
        price: eur(marketCode === 'ee' ? catalog.priceCents + 100 : catalog.priceCents),
        originalPrice:
          catalog.originalPriceCents != null ? eur(catalog.originalPriceCents) : null,
        source: marketCode === 'ee' ? ('market_override' as const) : ('catalog_default' as const),
      }),
  },
}

describe('applyMarketPricingToCommerceProduct', () => {
  before(() => {
    mockServerOnlyModule()
    mock.module('@/lib/commerce/market-pricing', pricingMock)
  })

  after(() => {
    mock.restoreAll()
  })

  it('applies market-specific price via shared resolver', async () => {
    const { applyMarketPricingToCommerceProduct } = await import('@/lib/commerce/apply-market-pricing')
    const { product: priced, source } = await applyMarketPricingToCommerceProduct(baseProduct, 'ee')
    assert.equal(priced.price.amount, 2099)
    assert.equal(source, 'market_override')
  })
})