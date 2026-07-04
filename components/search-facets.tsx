"use client"

import { useLang } from "@/lib/i18n"
import type { SearchFacetFilters, SearchFacets } from "@/lib/commerce/search-facets"
import { X } from "lucide-react"

interface SearchFacetsProps {
  facets: SearchFacets
  filters: SearchFacetFilters
  onChange: (next: SearchFacetFilters) => void
}

function toggleValue(values: string[], value: string): string[] {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value]
}

export function SearchFacetsPanel({ facets, filters, onChange }: SearchFacetsProps) {
  const { t } = useLang()

  const hasFilters =
    filters.brands.length > 0 || filters.categories.length > 0 || filters.onSaleOnly

  const clearAll = () => {
    onChange({ brands: [], categories: [], onSaleOnly: false })
  }

  if (facets.brands.length === 0 && facets.categories.length === 0 && facets.onSaleCount === 0) {
    return null
  }

  return (
    <aside className="mb-6 rounded-xl border border-border bg-card p-4 lg:mb-0 lg:w-64 lg:shrink-0">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">{t("filtersLabel")}</h2>
        {hasFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="flex items-center gap-1 text-xs font-medium text-destructive hover:opacity-80"
          >
            <X className="h-3.5 w-3.5" />
            {t("filterClearAll")}
          </button>
        )}
      </div>

      {facets.brands.length > 0 && (
        <div className="mb-5">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t("filterBrand")}
          </h3>
          <ul className="space-y-2">
            {facets.brands.map((option) => (
              <li key={option.value}>
                <label className="flex cursor-pointer items-center justify-between gap-2 text-sm">
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="rounded border-border"
                      checked={filters.brands.includes(option.value)}
                      onChange={() =>
                        onChange({
                          ...filters,
                          brands: toggleValue(filters.brands, option.value),
                        })
                      }
                    />
                    <span className="text-foreground">{option.label}</span>
                  </span>
                  <span className="text-xs text-muted-foreground">{option.count}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}

      {facets.categories.length > 0 && (
        <div className="mb-5">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t("filterCategory")}
          </h3>
          <ul className="space-y-2">
            {facets.categories.map((option) => (
              <li key={option.value}>
                <label className="flex cursor-pointer items-center justify-between gap-2 text-sm">
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="rounded border-border"
                      checked={filters.categories.includes(option.value)}
                      onChange={() =>
                        onChange({
                          ...filters,
                          categories: toggleValue(filters.categories, option.value),
                        })
                      }
                    />
                    <span className="text-foreground">{option.label}</span>
                  </span>
                  <span className="text-xs text-muted-foreground">{option.count}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}

      {facets.onSaleCount > 0 && (
        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t("filterDiscounts")}
          </h3>
          <label className="flex cursor-pointer items-center justify-between gap-2 text-sm">
            <span className="flex items-center gap-2">
              <input
                type="checkbox"
                className="rounded border-border"
                checked={filters.onSaleOnly}
                onChange={() =>
                  onChange({
                    ...filters,
                    onSaleOnly: !filters.onSaleOnly,
                  })
                }
              />
              <span className="text-foreground">{t("filterDiscounts")}</span>
            </span>
            <span className="text-xs text-muted-foreground">{facets.onSaleCount}</span>
          </label>
        </div>
      )}
    </aside>
  )
}