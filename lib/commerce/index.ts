/**
 * Commerce data-access layer (ADR-0004).
 * Components and pages import from here — never from @/lib/supabase/* directly.
 */

export {
  CommerceError,
  commerceDatabase,
  commerceFail,
  commerceNotFound,
  commerceOk,
  commerceValidation,
  isCommerceError,
  type CommerceErrorCode,
  type CommerceResult,
} from './errors'

export {
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  type CommerceDatabase,
  type CommerceFavorite,
  type CommerceOrder,
  type CommerceOrderLine,
  type CommerceProduct,
  type DbBrand,
  type DbCategory,
  type DbFavorite,
  type DbOrder,
  type DbOrderItem,
  type DbProduct,
  type DbProductImage,
  type DbReview,
  type OrderId,
  type OrderStatus,
  type PaymentStatus,
  type ProductId,
  type UserId,
} from './types'

export {
  addUserFavorite,
  listUserFavoriteLegacyIds,
  normalizeFavoriteRowId,
  parseStoredFavoriteIds,
  removeUserFavorite,
  syncLocalFavoritesToUser,
} from './favorites'
export {
  getOrderDetailLines,
  getOrderWithLines,
  listOrdersForUser,
  type OrderDetailLine,
  type OrderListItem,
} from './orders'
export {
  legacyProductIdToUuid,
  normalizeLegacyProductId,
  toStorageProductId,
  uuidToLegacyProductId,
} from './ids'
export {
  getCatalogProductBySlug,
  getCatalogProducts,
  getCatalogProductsByBrandSlug,
  getCatalogProductsByCategorySlug,
  mergeLegacyExtras,
  type CatalogSource,
} from './catalog-source'
export {
  getProductByLegacyId,
  getProductBySlug,
  getProductByUuid,
  listActiveProducts,
  listProductSlugs,
  listProductsByBrandSlug,
  listProductsByCategorySlug,
  mapCommerceToLegacyProduct,
  mapDbProductToCommerce,
  pricesMatchLegacy,
} from './products'
export { buildProductBreadcrumbJsonLd, buildProductJsonLd } from './json-ld'
export { searchProducts } from './search'
export { brandSlug, productSlug, slugify } from './slugs'
export { LEGACY_PRODUCT_ID_REDIRECTS } from './redirects'