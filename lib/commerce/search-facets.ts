import type { Product } from '@/lib/data'
import type { CommerceProduct } from '@/lib/commerce/types'

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

export interface SearchFacetProduct {
  brand: string
  category: string
  price: { amount: number }
  originalPrice?: { amount: number } | null
}

/** Human-readable label from category slug (skincare → Skincare). */
export function formatCategoryFacetLabel(slug: string): string {
  const trimmed = slug.trim()
  if (!trimmed) return trimmed
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).replace(/-/g, ' ')
}

function countByField(
  products: SearchFacetProduct[],
  field: 'brand' | 'category',
  formatLabel?: (value: string) => string
): SearchFacetOption[] {
  const counts = new Map<string, number>()

  for (const product of products) {
    const value = product[field]?.trim()
    if (!value) continue
    counts.set(value, (counts.get(value) ?? 0) + 1)
  }

  return [...counts.entries()]
    .map(([value, count]) => ({
      value,
      label: formatLabel ? formatLabel(value) : value,
      count,
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
}

function isOnSale(product: SearchFacetProduct): boolean {
  return (
    product.originalPrice != null && product.originalPrice.amount > product.price.amount
  )
}

export function buildSearchFacetsFromProducts(
  products: SearchFacetProduct[]
): SearchFacets {
  return {
    brands: countByField(products, 'brand'),
    categories: countByField(products, 'category', formatCategoryFacetLabel),
    onSaleCount: products.filter(isOnSale).length,
  }
}

export function buildSearchFacets(products: Product[]): SearchFacets {
  return buildSearchFacetsFromProducts(
    products.map((product) => ({
      brand: product.brand,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice ?? null,
    }))
  )
}

export function commerceToFacetProduct(product: CommerceProduct): SearchFacetProduct {
  return {
    brand: product.brandName ?? '',
    category: product.categorySlug ?? '',
    price: product.price,
    originalPrice: product.originalPrice,
  }
}

export function applySearchFacetFilters<T extends SearchFacetProduct>(
  products: T[],
  filters: SearchFacetFilters
): T[] {
  return products.filter((product) => {
    if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
      return false
    }

    if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
      return false
    }

    if (filters.onSaleOnly && !isOnSale(product)) {
      return false
    }

    return true
  })
}

export function hasActiveSearchFacetFilters(filters: SearchFacetFilters): boolean {
  return filters.brands.length > 0 || filters.categories.length > 0 || filters.onSaleOnly
}