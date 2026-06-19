"use client"

import { useEffect, useState, use } from "react"
import Link from "next/link"
import Image from "next/image"
import { products as allProducts, categories, BRANDS_ORDERED } from "@/lib/data"
import { LangProvider, useLang, formatEur } from "@/lib/i18n"
import { CartProvider, useCart } from "@/components/cart-context"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CartDrawer } from "@/components/cart-drawer"
import { BrandsShowcase } from "@/components/brands-showcase"
import { Button } from "@/components/ui/button"
import { 
  ChevronDown, ChevronRight, Filter, X, Star, 
  Grid3X3, LayoutList, Loader2, SlidersHorizontal
} from "lucide-react"

interface Product {
  id: string
  sku: string
  name: string
  description: string
  volume: string
  price: number
  original_price: number | null
  rating: number
  review_count: number
  image_url: string
  brand: { name: string; slug: string }
  category: { name: string; slug: string }
}

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
}

interface Brand {
  id: string
  name: string
  slug: string
}

const getBrandSlug = (brand: string): string =>
  brand
    .toLowerCase()
    .replace(/[èéêë]/g, "e")
    .replace(/[âäà]/g, "a")
    .replace(/[ôöò]/g, "o")
    .replace(/[ûüù]/g, "u")
    .replace(/[ïî]/g, "i")
    .replace(/[ç]/g, "c")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")

function CategoryPageContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const { t } = useLang()
  const { addItem } = useCart()
  
  const [products, setProducts] = useState<Product[]>([])
  const [category, setCategory] = useState<Category | null>(null)
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  
  // Filters
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100])
  const [minRating, setMinRating] = useState(0)
  const [sortBy, setSortBy] = useState("popular")
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  useEffect(() => {
    const cat = categories.find(c => c.id === slug)

    if (cat) {
      const catName = t(cat.id as any)
      setCategory({
        id: cat.id,
        name: catName,
        slug: cat.id,
        description: null,
      })

      // Filter products belonging to this category
      const mappedProducts: Product[] = allProducts
        .filter(p => p.category === slug)
        .map(p => ({
          id: String(p.id),
          sku: p.sku ?? "",
          name: p.name,
          description: p.description,
          volume: p.volume ?? "",
          price: p.price,
          original_price: p.originalPrice ?? null,
          rating: p.rating,
          review_count: p.reviewCount,
          image_url: p.image,
          brand: { name: p.brand, slug: getBrandSlug(p.brand) },
          category: { name: catName, slug: cat.id },
        }))

      setProducts(mappedProducts)

      // Build unique brands list from the filtered products
      const uniqueBrands = Array.from(
        new Map(mappedProducts.map(p => [p.brand.slug, p.brand])).values()
      ).map(b => ({ id: b.slug, name: b.name, slug: b.slug }))
      setBrands(uniqueBrands)
    }

    setLoading(false)
  }, [slug, t])

  // Filter and sort products
  const filteredProducts = products
    .filter(p => selectedBrands.length === 0 || selectedBrands.includes(p.brand.slug))
    .filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])
    .filter(p => p.rating >= minRating)
    .sort((a, b) => {
      switch (sortBy) {
        case "price-asc": return a.price - b.price
        case "price-desc": return b.price - a.price
        case "rating": return b.rating - a.rating
        case "newest": return 0 // Would need created_at
        default: return b.review_count - a.review_count // popular
      }
    })

  const toggleBrand = (brandSlug: string) => {
    setSelectedBrands(prev => 
      prev.includes(brandSlug) 
        ? prev.filter(b => b !== brandSlug)
        : [...prev, brandSlug]
    )
  }

  const clearFilters = () => {
    setSelectedBrands([])
    setPriceRange([0, 100])
    setMinRating(0)
  }

  const hasActiveFilters = selectedBrands.length > 0 || minRating > 0 || priceRange[0] > 0 || priceRange[1] < 100

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <SiteHeader />
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <SiteHeader />
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <p className="text-lg text-muted-foreground">{t("categoryNotFound")}</p>
          <Link href="/">
            <Button>{t("backHome")}</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <CartDrawer />

      {/* Breadcrumbs */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 text-sm">
          <Link href="/" className="text-muted-foreground hover:text-primary">
            {t("breadcrumbHome")}
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-foreground">{category.name}</span>
        </div>
      </div>

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">{category.name}</h1>
            {category.description && (
              <p className="mt-2 text-muted-foreground">{category.description}</p>
            )}
            <p className="mt-1 text-sm text-muted-foreground">
              {filteredProducts.length} {t("productsLabel")}
            </p>
          </div>

          <div className="flex gap-6">
            {/* Sidebar Filters — Desktop */}
            <aside className="hidden w-64 flex-shrink-0 lg:block">
              <div className="sticky top-24 space-y-6">
                {/* Brands */}
                <div className="rounded-xl border border-border bg-card p-4">
                  <h3 className="mb-3 font-semibold text-foreground">{t("brandLabel")}</h3>
                  <div className="space-y-2">
                    {brands.map(brand => (
                      <label key={brand.slug} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand.slug)}
                          onChange={() => toggleBrand(brand.slug)}
                          className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                        />
                        <span className="text-foreground">{brand.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div className="rounded-xl border border-border bg-card p-4">
                  <h3 className="mb-3 font-semibold text-foreground">{t("priceLabel")}</h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm"
                      placeholder={t("fromLabel")}
                    />
                    <span className="text-muted-foreground">—</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm"
                      placeholder={t("toLabel")}
                    />
                  </div>
                </div>

                {/* Rating */}
                <div className="rounded-xl border border-border bg-card p-4">
                  <h3 className="mb-3 font-semibold text-foreground">{t("ratingLabel")}</h3>
                  <div className="space-y-2">
                    {[4, 3, 2, 1].map(rating => (
                      <label key={rating} className="flex items-center gap-2 text-sm">
                        <input
                          type="radio"
                          name="rating"
                          checked={minRating === rating}
                          onChange={() => setMinRating(rating)}
                          className="h-4 w-4 border-border text-primary focus:ring-primary"
                        />
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted"}`}
                            />
                          ))}
                          <span className="ml-1 text-muted-foreground">{t("andAbove")}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {hasActiveFilters && (
                  <Button variant="outline" className="w-full" onClick={clearFilters}>
                    {t("clearFilters")}
                  </Button>
                )}
              </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="mb-4 flex items-center justify-between gap-4">
                <Button
                  variant="outline"
                  className="lg:hidden"
                  onClick={() => setShowFilters(true)}
                >
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  {t("filtersLabel")}
                  {hasActiveFilters && (
                    <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      {selectedBrands.length + (minRating > 0 ? 1 : 0)}
                    </span>
                  )}
                </Button>

                <div className="flex items-center gap-2 ml-auto">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground"
                  >
                    <option value="popular">{t("sortByPopular")}</option>
                    <option value="price-asc">{t("sortByPriceAsc")}</option>
                    <option value="price-desc">{t("sortByPriceDesc")}</option>
                    <option value="rating">{t("sortByRating")}</option>
                    <option value="newest">{t("newest")}</option>
                  </select>

                  <div className="hidden items-center gap-1 rounded-lg border border-border p-1 md:flex">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`rounded p-1.5 ${viewMode === "grid" ? "bg-muted" : ""}`}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`rounded p-1.5 ${viewMode === "list" ? "bg-muted" : ""}`}
                    >
                      <LayoutList className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Products */}
              {filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16">
                  <p className="text-lg font-medium text-foreground">{t("productsNotFound")}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{t("tryChangeFilters")}</p>
                  {hasActiveFilters && (
                    <Button variant="outline" className="mt-4" onClick={clearFilters}>
                      {t("clearFilters")}
                    </Button>
                  )}
                </div>
              ) : (
                <div className={`grid gap-4 ${
                  viewMode === "grid" 
                    ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-3" 
                    : "grid-cols-1"
                }`}>
                  {filteredProducts.map(product => (
                    <div
                      key={product.id}
                      className={`group rounded-xl border border-border bg-card transition-shadow hover:shadow-md ${
                        viewMode === "list" ? "flex gap-4 p-4" : "p-3"
                      }`}
                    >
                      <Link 
                        href={`/products/${product.id}`}
                        className={viewMode === "list" ? "w-32 flex-shrink-0" : ""}
                      >
                        <div className={`relative overflow-hidden rounded-lg bg-secondary ${
                          viewMode === "list" ? "aspect-square" : "aspect-square"
                        }`}>
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                          {product.original_price && (
                            <span className="absolute left-2 top-2 rounded-full bg-destructive px-2 py-0.5 text-xs font-bold text-destructive-foreground">
                              -{Math.round((1 - product.price / product.original_price) * 100)}%
                            </span>
                          )}
                        </div>
                      </Link>

                      <div className={viewMode === "list" ? "flex flex-1 flex-col" : "mt-3"}>
                        <p className="text-xs text-muted-foreground">{product.brand.name}</p>
                        <Link href={`/products/${product.id}`}>
                          <h3 className="mt-1 font-medium text-foreground line-clamp-2 hover:text-primary">
                            {product.name}
                          </h3>
                        </Link>
                        
                        <div className="mt-1 flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-medium text-foreground">{product.rating}</span>
                          <span className="text-xs text-muted-foreground">
                            ({product.review_count.toLocaleString()})
                          </span>
                        </div>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {product.sku} | {product.volume}
                        </p>

                        <div className={`mt-auto flex items-center justify-between pt-3 ${
                          viewMode === "list" ? "" : ""
                        }`}>
                          <div>
                            <span className="text-lg font-bold text-primary">
                              {formatEur(product.price)}
                            </span>
                            {product.original_price && (
                              <span className="ml-2 text-sm text-muted-foreground line-through">
                                {formatEur(product.original_price)}
                              </span>
                            )}
                          </div>
                          <Button
                            size="sm"
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                            onClick={() => addItem({
                              id: product.id,
                              name: product.name,
                              price: product.price,
                              image: product.image_url,
                              brand: product.brand.name
                            })}
                          >
                            В корзину
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />

      {/* Mobile Filters Modal */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-card">
            <div className="sticky top-0 flex items-center justify-between border-b border-border bg-card p-4">
              <h2 className="text-lg font-semibold">Фильтры</h2>
              <button onClick={() => setShowFilters(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-6 p-4">
              {/* Brands */}
              <div>
                <h3 className="mb-3 font-semibold text-foreground">Бренд</h3>
                <div className="space-y-2">
                  {brands.map(brand => (
                    <label key={brand.slug} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand.slug)}
                        onChange={() => toggleBrand(brand.slug)}
                        className="h-4 w-4 rounded border-border text-primary"
                      />
                      <span className="text-foreground">{brand.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div>
                <h3 className="mb-3 font-semibold text-foreground">Рейтинг</h3>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map(rating => (
                    <label key={rating} className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="rating-mobile"
                        checked={minRating === rating}
                        onChange={() => setMinRating(rating)}
                        className="h-4 w-4 border-border text-primary"
                      />
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted"}`}
                          />
                        ))}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 flex gap-3 border-t border-border bg-card p-4">
              <Button variant="outline" className="flex-1" onClick={clearFilters}>
                Сбросить
              </Button>
              <Button className="flex-1" onClick={() => setShowFilters(false)}>
                Показать ({filteredProducts.length})
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function CategoryRouter({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)

  // The "brands" category is a dedicated, curated brands landing page rather
  // than a plain product catalog.
  if (slug === "brands") {
    return <BrandsShowcase />
  }

  return <CategoryPageContent params={params} />
}

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <LangProvider>
      <CartProvider>
        <CategoryRouter params={params} />
      </CartProvider>
    </LangProvider>
  )
}
