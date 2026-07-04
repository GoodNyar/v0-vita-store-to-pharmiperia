import type { Product } from '@/lib/data'

export interface SearchFacetOption {
  value: string
  label: string
  count: number
}

export interface SearchFacets {
  brands: SearchFacetOption[]
  categories: SearchFacetOption[]
  onSaleCount: number
}

export interface SearchFacetFilters {
  brands: string[]
  categories: string[]
  onSaleOnly: boolean
}

export const EMPTY_SEARCH_FACET_FILTERS: SearchFacetFilters = {
  brands: [],
  categories: [],
  onSaleOnly: false,
}

function countByField(products: Product[], field: 'brand' | 'category'): SearchFacetOption[] {
  const counts = new Map<string, number>()

  for (const product of products) {
    const value = product[field]?.trim()
    if (!value) continue
    counts.set(value, (counts.get(value) ?? 0) + 1)
  }

  return [...counts.entries()]
    .map(([value, count]) => ({ value, label: value, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
}

export function buildSearchFacets(products: Product[]): SearchFacets {
  const onSaleCount = products.filter(
    (product) => product.originalPrice != null && product.originalPrice.amount > product.price.amount
  ).length

  return {
    brands: countByField(products, 'brand'),
    categories: countByField(products, 'category'),
    onSaleCount,
  }
}

export function applySearchFacetFilters(
  products: Product[],
  filters: SearchFacetFilters
): Product[] {
  return products.filter((product) => {
    if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
      return false
    }

    if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
      return false
    }

    if (filters.onSaleOnly) {
      const onSale =
        product.originalPrice != null && product.originalPrice.amount > product.price.amount
      if (!onSale) return false
    }

    return true
  })
}

export function hasActiveSearchFacetFilters(filters: SearchFacetFilters): boolean {
  return filters.brands.length > 0 || filters.categories.length > 0 || filters.onSaleOnly
}