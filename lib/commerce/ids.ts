import {
  catalogSeedProductUuid,
  legacyProductIdFromSeedUuid,
} from '@/lib/catalog-seed'
import { isCatalogProductId, normalizeProductId } from '@/lib/data'
import { commerceValidation } from './errors'
import type { ProductId } from './types'

/** Legacy storefront id (1–16) → seeded products.id UUID. */
export function legacyProductIdToUuid(legacyId: number): ProductId {
  if (!isCatalogProductId(legacyId)) {
    throw commerceValidation(`Invalid legacy product id: ${legacyId}`)
  }
  return catalogSeedProductUuid(legacyId)
}

/** Seeded UUID → legacy id when applicable. */
export function uuidToLegacyProductId(id: ProductId): number | null {
  return legacyProductIdFromSeedUuid(id)
}

/** Normalize cart/favorite input to legacy id for storefront UI. */
export function normalizeLegacyProductId(value: string | number): number | null {
  const id = normalizeProductId(value)
  return isCatalogProductId(id) ? id : null
}

/** Persist favorites/order_items with UUID while UI may still use legacy ids. */
export function toStorageProductId(legacyId: number): ProductId {
  return legacyProductIdToUuid(legacyId)
}