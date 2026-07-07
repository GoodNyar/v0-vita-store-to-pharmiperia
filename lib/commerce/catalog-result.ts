import type { Product } from '@/lib/data'

export type CatalogSource = 'db' | 'legacy'

export type CatalogLoadError = 'database_unavailable'

export interface CatalogListResult {
  products: Product[]
  source: CatalogSource
  loadError: CatalogLoadError | null
}

export function hasCatalogLoadError(result: CatalogListResult): boolean {
  return result.loadError != null
}