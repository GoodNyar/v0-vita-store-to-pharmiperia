"use client"

import { useEffect, useState } from "react"
import { CatalogImage } from "@/components/catalog-image"
import Link from "next/link"
import { Star, Minus, Plus, Truck, Shield, RotateCcw, ChevronLeft, Check, Heart } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { CartDrawer } from "@/components/cart-drawer"
import { SiteFooter } from "@/components/site-footer"
import { ProductCard } from "@/components/product-card"
import { ProductReviews } from "@/components/product-reviews"
import { useCart } from "@/components/cart-context"
import { useLang, formatMoney } from "@/lib/i18n"
import { discountPercent, multiplyMoney } from "@/lib/money"
import { getBrandSlug, type Product } from "@/lib/data"
import { useFavorites } from "@/components/favorites-provider"
import { trackViewItem } from "@/lib/analytics/client"

export function ProductPageContent({
  product,
  similarProducts,
}: {
  product: Product
  similarProducts: Product[]
}) {
  const { t, localizedPath } = useLang()
  const { addToCart } = useCart()
  const { isFavorited, toggleFavorite } = useFavorites()
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<"about" | "benefits" | "howToUse" | "ingredients">("about")
  const isFav = isFavorited(product.id)

  useEffect(() => {
    trackViewItem({
      itemId: String(product.id),
      itemName: product.name,
      price: product.price.amount / 100,
      currency: product.price.currency,
    })
  }, [product.id, product.name, product.price.amount, product.price.currency])

  const discount =
    product.originalPrice != null
      ? discountPercent(product.price, product.originalPrice)
      : null

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
  }

  // Product-specific content (would come from CMS in real app)
  const productContent = {
    ingredients: "Aqua, PEG-6 Caprylic/Capric Glycerides, Fructooligosaccharides, Mannitol, Xylitol, Rhamnose, Cucumis Sativus (Cucumber) Fruit Extract, Propylene Glycol, Cetrimonium Bromide, Disodium EDTA.",
    howToUse: t("productHowToUseDefault"),
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <CartDrawer />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:py-6">
          {/* Back link */}
          <Link
            href={localizedPath("/")}
            className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            {t("backToProducts")}
          </Link>

          {/* Product main section */}
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            {/* Image section */}
            <div className="relative">
              {/* Badge */}
              {product.badge && (
                <span className="absolute left-4 top-4 z-10 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                  {product.badge === "discount" && discount
                    ? `−${discount}%`
                    : t(product.badge as Parameters<typeof t>[0])}
                </span>
              )}

              {/* Main image */}
              <div className="overflow-hidden rounded-2xl bg-[#f2f3f5]">
                <div className="relative aspect-square">
                  <CatalogImage
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-8"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>

              {/* Thumbnail strip (placeholder for future) */}
              <div className="mt-4 hidden gap-3 sm:flex">
                {[1, 2, 3].map((i) => (
                  <button
                    key={i}
                    className={`relative h-20 w-20 overflow-hidden rounded-lg border-2 bg-[#f2f3f5] ${
                      i === 1 ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <CatalogImage
                      src={product.image}
                      alt={`${product.name} view ${i}`}
                      fill
                      className="object-contain p-2"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product info */}
            <div className="flex flex-col">
              {/* Brand */}
              <Link
                href={localizedPath(`/brand/${getBrandSlug(product.brand)}`)}
                className="text-sm font-semibold text-primary hover:underline"
              >
                {product.brand}
              </Link>

              {/* Name */}
              <h1 className="mt-1 text-2xl font-bold text-foreground sm:text-3xl">
                {product.name}
              </h1>

              {/* Volume */}
              <p className="mt-1 text-sm text-muted-foreground">{product.volume}</p>

              {/* Rating */}
              <div className="mt-3 flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating)
                          ? "fill-amber-400 text-amber-400"
                          : "fill-gray-300 text-gray-300"
                      }`}
                      strokeWidth={0}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-foreground">{product.rating}</span>
                <span className="text-sm text-muted-foreground">
                  ({product.reviewCount.toLocaleString()} {t("productReviews")})
                </span>
              </div>

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-3xl font-bold text-foreground">
                  {formatMoney(product.price)}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">
                      {formatMoney(product.originalPrice)}
                    </span>
                    <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-sm font-semibold text-destructive">
                      −{discount}%
                    </span>
                  </>
                )}
              </div>

              {/* Stock status */}
              <div className="mt-3 flex items-center gap-2">
                {product.inStock ? (
                  <>
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-sm font-medium text-green-600">{t("productInStock")}</span>
                  </>
                ) : (
                  <>
                    <div className="h-2 w-2 rounded-full bg-red-500" />
                    <span className="text-sm font-medium text-red-600">{t("productOutOfStock")}</span>
                  </>
                )}
              </div>

              {/* Divider */}
              <div className="my-5 border-t border-border" />

              {/* Short description */}
              <p className="text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </p>

              {/* Quantity + Add to Cart + Wishlist */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                {/* Quantity selector */}
                <div className="flex items-center rounded-lg border border-border">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="flex h-11 w-11 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center text-sm font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="flex h-11 w-11 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {/* Add to cart button */}
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:bg-primary/80 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {t("addToCart")} — {formatMoney(multiplyMoney(product.price, quantity))}
                </button>

                {/* Wishlist button */}
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className="flex h-11 items-center justify-center rounded-lg border border-border bg-background px-4 transition-colors hover:bg-secondary"
                  aria-label="Add to wishlist"
                >
                  <Heart
                    className={`h-5 w-5 transition-colors ${
                      isFav ? "fill-red-500 text-red-500" : "text-gray-400"
                    }`}
                  />
                </button>
              </div>

              {/* Trust badges — clickable */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                <Link
                  href={localizedPath("/delivery")}
                  className="flex flex-col items-center gap-1.5 rounded-lg border border-border bg-card p-3 text-center transition-colors hover:border-primary/50 hover:bg-primary/5"
                >
                  <Truck className="h-5 w-5 text-primary" />
                  <span className="text-xs font-medium text-foreground">{t("productDelivery")}</span>
                </Link>
                <Link
                  href={localizedPath("/delivery#guarantee")}
                  className="flex flex-col items-center gap-1.5 rounded-lg border border-border bg-card p-3 text-center transition-colors hover:border-primary/50 hover:bg-primary/5"
                >
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="text-xs font-medium text-foreground">{t("productGuarantee")}</span>
                </Link>
                <Link
                  href={localizedPath("/delivery#returns")}
                  className="flex flex-col items-center gap-1.5 rounded-lg border border-border bg-card p-3 text-center transition-colors hover:border-primary/50 hover:bg-primary/5"
                >
                  <RotateCcw className="h-5 w-5 text-primary" />
                  <span className="text-xs font-medium text-foreground">{t("productReturn")}</span>
                </Link>
              </div>

              {/* Product details */}
              <div className="mt-6 space-y-2 text-sm">
                <div className="flex justify-between border-b border-border py-2">
                  <span className="text-muted-foreground">{t("productSku")}</span>
                  <span className="font-medium text-foreground">#{product.sku}</span>
                </div>
                <div className="flex justify-between border-b border-border py-2">
                  <span className="text-muted-foreground">{t("productBrand")}</span>
                  <span className="font-medium text-foreground">{product.brand}</span>
                </div>
                <div className="flex justify-between border-b border-border py-2">
                  <span className="text-muted-foreground">{t("productVolume")}</span>
                  <span className="font-medium text-foreground">{product.volume}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs section */}
          <div className="mt-10">
            {/* Tab headers */}
            <div className="flex border-b border-border">
              {(["about", "benefits", "howToUse", "ingredients"] as const).map((tab) => {
                const labels: Record<typeof tab, string> = {
                  about: t("productAboutTab"),
                  benefits: t("productBenefitsTab"),
                  howToUse: t("productHowToUse"),
                  ingredients: t("productIngredients"),
                }
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === tab
                        ? "border-b-2 border-primary text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {labels[tab]}
                  </button>
                )
              })}
            </div>

            {/* Tab content */}
            <div className="py-6">
              {activeTab === "about" && (
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  <p>{product.description}</p>
                  <p className="mt-4">
                    {t("productAboutBrandText").replace("{brand}", product.brand)}
                  </p>
                </div>
              )}
              {activeTab === "benefits" && (
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    {t("productBenefit1")}
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    {t("productBenefit2")}
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    {t("productBenefit3")}
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    {t("productBenefit4")}
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    {t("productBenefit5")}
                  </li>
                </ul>
              )}
              {activeTab === "howToUse" && (
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  <p>{productContent.howToUse}</p>
                </div>
              )}
              {activeTab === "ingredients" && (
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  <p className="font-mono text-xs leading-relaxed">{productContent.ingredients}</p>
                </div>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          <ProductReviews 
            productId={product.id.toString()} 
            initialRating={product.rating} 
            initialReviewCount={product.reviewCount}
          />

          {/* Similar products */}
          {similarProducts.length > 0 && (
            <section className="mt-12">
              <h2 className="mb-6 text-xl font-bold text-foreground">{t("productSimilar")}</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {similarProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
