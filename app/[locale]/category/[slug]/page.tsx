import { notFound } from "next/navigation"
import { CategoryPageContent } from "@/components/category-page-content"
import { BrandsShowcase } from "@/components/brands-showcase"
import { CartProvider } from "@/components/cart-context"
import { LangProvider } from "@/lib/i18n"
import { getCatalogProductsByCategorySlug } from "@/lib/commerce/catalog-source"
import { isLocale } from "@/lib/i18n/config"

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()

  if (slug === "brands") {
    return (
      <LangProvider>
        <CartProvider>
          <BrandsShowcase />
        </CartProvider>
      </LangProvider>
    )
  }

  const catalogProducts = await getCatalogProductsByCategorySlug(slug, locale)

  return (
    <LangProvider>
      <CartProvider>
        <CategoryPageContent slug={slug} catalogProducts={catalogProducts} />
      </CartProvider>
    </LangProvider>
  )
}