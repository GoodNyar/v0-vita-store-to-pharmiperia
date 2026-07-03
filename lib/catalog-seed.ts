/**
 * Deterministic UUIDs for catalog seed rows (supabase/seed.sql).
 * Maps legacy numeric product ids from lib/data.ts to Postgres UUIDs until B6 migration completes.
 */

function seedUuid(prefix: string, n: number): string {
  const hex = n.toString(16).padStart(12, "0")
  return `${prefix}-0000-4000-8000-${hex}`
}

export function catalogSeedBrandUuid(index: number): string {
  return seedUuid("b1000001", index)
}

export function catalogSeedCategoryUuid(index: number): string {
  return seedUuid("c1000001", index)
}

/** Legacy catalog product id (1–16) → seeded products.id UUID. */
export function catalogSeedProductUuid(legacyProductId: number): string {
  return seedUuid("d1000001", legacyProductId)
}

/** Reverse map when UUID was issued by catalog seed generator. */
export function legacyProductIdFromSeedUuid(id: string): number | null {
  const match = /^d1000001-0000-4000-8000-([0-9a-f]{12})$/i.exec(id)
  if (!match) return null
  const legacyId = parseInt(match[1], 16)
  return Number.isInteger(legacyId) && legacyId > 0 ? legacyId : null
}