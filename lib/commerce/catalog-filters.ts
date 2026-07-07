import { moneyToMajor, type Money } from '@/lib/money'

const DEFAULT_MAX_PRICE_MAJOR = 100

/** Upper bound for category price slider (major EUR units, rounded up). */
export function computeCatalogMaxPriceMajor(
  prices: readonly Money[],
  fallback = DEFAULT_MAX_PRICE_MAJOR
): number {
  if (prices.length === 0) return fallback
  const maxMajor = Math.max(...prices.map((price) => moneyToMajor(price)))
  return Math.max(1, Math.ceil(maxMajor))
}

export function isPriceFilterActive(
  range: readonly [number, number],
  catalogMax: number
): boolean {
  return range[0] > 0 || range[1] < catalogMax
}