import { createClient } from '@/lib/supabase/client'
import { isCatalogProductId, normalizeProductId } from '@/lib/data'
import {
  commerceDatabase,
  commerceFail,
  commerceOk,
  commerceValidation,
  type CommerceResult,
} from './errors'
import {
  normalizeLegacyProductId,
  toStorageProductId,
  uuidToLegacyProductId,
} from './ids'

function parseLegacyFavoriteIds(rows: { product_id: string }[]): number[] {
  return rows
    .map((row) => uuidToLegacyProductId(row.product_id))
    .filter((id): id is number => id != null && isCatalogProductId(id))
}

export async function listUserFavoriteLegacyIds(
  userId: string
): Promise<CommerceResult<number[]>> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('favorites')
    .select('product_id')
    .eq('user_id', userId)

  if (error) {
    return commerceFail(commerceDatabase('Failed to load favorites', error))
  }

  return commerceOk(parseLegacyFavoriteIds(data ?? []))
}

export async function addUserFavorite(
  userId: string,
  legacyProductId: number
): Promise<CommerceResult<void>> {
  if (!isCatalogProductId(legacyProductId)) {
    return commerceFail(commerceValidation('Invalid product id'))
  }

  const supabase = createClient()
  const { error } = await supabase.from('favorites').insert({
    user_id: userId,
    product_id: toStorageProductId(legacyProductId),
  })

  if (error) {
    return commerceFail(commerceDatabase('Failed to add favorite', error))
  }
  return commerceOk(undefined)
}

export async function removeUserFavorite(
  userId: string,
  legacyProductId: number
): Promise<CommerceResult<void>> {
  const supabase = createClient()
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', toStorageProductId(legacyProductId))

  if (error) {
    return commerceFail(commerceDatabase('Failed to remove favorite', error))
  }
  return commerceOk(undefined)
}

export async function syncLocalFavoritesToUser(
  userId: string,
  localLegacyIds: number[]
): Promise<CommerceResult<number[]>> {
  const existing = await listUserFavoriteLegacyIds(userId)
  if (!existing.ok) return existing

  const toSync = localLegacyIds.filter(
    (id) => isCatalogProductId(id) && !existing.data.includes(id)
  )

  for (const legacyId of toSync) {
    const result = await addUserFavorite(userId, legacyId)
    if (!result.ok) return commerceFail(result.error)
  }

  return commerceOk([...new Set([...existing.data, ...localLegacyIds.filter(isCatalogProductId)])])
}

/** Parse localStorage favorite ids (legacy numeric). */
export function parseStoredFavoriteIds(raw: unknown): number[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map((id) => normalizeProductId(id as string | number))
    .filter(isCatalogProductId)
}

export function normalizeFavoriteRowId(value: string | number): number | null {
  const legacy = normalizeLegacyProductId(value)
  if (legacy != null) return legacy
  if (typeof value === 'string') return uuidToLegacyProductId(value)
  return null
}