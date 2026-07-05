"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CatalogImage } from "@/components/catalog-image"
import { searchCatalogProducts } from "@/app/actions/catalog"
import { useLang, formatMoney } from "@/lib/i18n"
import { discountPercent } from "@/lib/money"
import { useCart } from "@/components/cart-context"
import { normalizeProductId, getProductSlug, type Product } from "@/lib/data"
import {
  EMPTY_SEARCH_FACET_FILTERS,
  applySearchFacetFilters,
  hasActiveSearchFacetFilters,
  type SearchFacetFilters,
  type SearchFacets,
} from "@/lib/commerce/search-facets"
import { SearchFacetsPanel } from "@/components/search-facets"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CartDrawer } from "@/components/cart-drawer"
import { Button } from "@/components/ui/button"
import { Search, Star, Loader2, ChevronRight, X } from "lucide-react"

export function SearchPageContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const { t, localizedPath, lang } = useLang()
  const { addItem } = useCart()

  const [products, setProducts] = useState<Product[]>([])
  const [facets, setFacets] = useState<SearchFacets>({
    brands: [],
    categories: [],
    onSaleCount: 0,
  })
  const [facetFilters, setFacetFilters] = useState<SearchFacetFilters>(
    EMPTY_SEARCH_FACET_FILTERS
  )
  const [loading, setLoading] = useState(true)
  const [searchInput, setSearchInput] = useState(query)
  const filteredProducts = useMemo(
    () => applySearchFacetFilters(products, facetFilters),
    [products, facetFilters]
  )

  useEffect(() => {
    let cancelled = false

    const runSearch = async () => {
      if (!query) {
        setProducts([])
        setFacets({ brands: [], categories: [], onSaleCount: 0 })
        setFacetFilters(EMPTY_SEARCH_FACET_FILTERS)
        setLoading(false)
        return
      }

      setLoading(true)
      setFacetFilters(EMPTY_SEARCH_FACET_FILTERS)
      const { products: results, facets: serverFacets } = await searchCatalogProducts(
        lang,
        query
      )
      if (!cancelled) {
        setProducts(results)
        setFacets(serverFacets)
        setLoading(false)
      }
    }

    void runSearch()
    return () => {
      cancelled = true
    }
  }, [query, lang])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      window.location.href = localizedPath(`/search?q=${encodeURIComponent(searchInput.trim())}`)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <CartDrawer />

      <div className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 text-sm">
          <Link href="/" className="text-muted-foreground hover:text-primary">
            {t("breadcrumbHome")}
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-foreground">{t("searchTitle")}</span>
        </div>
      </div>

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="mb-8">
            <form onSubmit={handleSearch} className="relative mx-auto max-w-2xl">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className="h-14 w-full rounded-full border border-border bg-card pl-12 pr-12 text-lg text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </form>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : !query ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Search className="mb-4 h-16 w-16 text-muted-foreground/50" />
              <h2 className="text-xl font-semibold text-foreground">{t("searchStartSearch")}</h2>
              <p className="mt-2 text-muted-foreground">{t("searchStartSearchDesc")}</p>
            </div>
          ) : filteredProducts.length === 0 && products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Search className="mb-4 h-16 w-16 text-muted-foreground/50" />
              <h2 className="text-xl font-semibold text-foreground">
                {t("searchNotFound1")} «{query}» {t("searchNotFound2")}
              </h2>
              <p className="mt-2 text-muted-foreground">{t("searchNotFoundDesc")}</p>
              <div className="mt-6">
                <Link href="/">
                  <Button>{t("continueShopping")}</Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h1 className="text-xl font-semibold text-foreground">
                  {t("searchResults")} «{query}»
                </h1>
                <p className="text-sm text-muted-foreground">
                  {t("searchFound")} {filteredProducts.length}
                  {hasActiveSearchFacetFilters(facetFilters) && products.length !== filteredProducts.length
                    ? ` / ${products.length}`
                    : ''}{' '}
                  {t("searchFoundProducts")}
                </p>
              </div>

              <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                <SearchFacetsPanel
                  facets={facets}
                  filters={facetFilters}
                  onChange={setFacetFilters}
                />

                {filteredProducts.length === 0 ? (
                  <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
                    <Search className="mb-4 h-16 w-16 text-muted-foreground/50" />
                    <h2 className="text-xl font-semibold text-foreground">
                      {t("searchNotFound1")} «{query}» {t("searchNotFound2")}
                    </h2>
                    <p className="mt-2 text-muted-foreground">{t("filterClearAll")}</p>
                  </div>
                ) : (
                  <div className="grid flex-1 grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className="group rounded-xl border border-border bg-card p-3 transition-shadow hover:shadow-md"
                      >
                    <Link href={localizedPath(`/products/${getProductSlug(product)}`)}>
                      <div className="relative aspect-square overflow-hidden rounded-lg bg-secondary">
                        <CatalogImage
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                        {product.originalPrice && (
                          <span className="absolute left-2 top-2 rounded-full bg-destructive px-2 py-0.5 text-xs font-bold text-destructive-foreground">
                            -{discountPercent(product.price, product.originalPrice)}%
                          </span>
                        )}
                      </div>
                    </Link>

                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground">{product.brand}</p>
                      <Link href={localizedPath(`/products/${getProductSlug(product)}`)}>
                        <h3 className="mt-1 font-medium text-foreground line-clamp-2 hover:text-primary">
                          {product.name}
                        </h3>
                      </Link>

                      <div className="mt-1 flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium text-foreground">{product.rating}</span>
                        <span className="text-xs text-muted-foreground">
                          ({product.reviewCount.toLocaleString()})
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {product.sku} | {product.volume}
                      </p>

                      <div className="mt-3 flex items-center justify-between">
                        <div>
                          <span className="text-lg font-bold text-primary">
                            {formatMoney(product.price)}
                          </span>
                          {product.originalPrice && (
                            <span className="ml-2 text-sm text-muted-foreground line-through">
                              {formatMoney(product.originalPrice)}
                            </span>
                          )}
                        </div>
                        <Button
                          size="sm"
                          className="bg-primary text-primary-foreground hover:bg-primary/90"
                          onClick={() =>
                            addItem({
                              id: normalizeProductId(product.id),
                              name: product.name,
                              price: product.price,
                              image: product.image,
                              brand: product.brand,
                            })
                          }
                        >
                          {t("addToCart")}
                        </Button>
                      </div>
                    </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}