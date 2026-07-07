import { notFound } from "next/navigation"

export const revalidate = 3600
import { CategoryPageContent } from "@/components/category-page-content"
import { BrandsShowcase } from "@/components/brands-showcase"
import { categories } from "@/lib/data"
import { getCatalogProductsByCategorySlug } from "@/lib/commerce/catalog-source"
import { isLocale } from "@/lib/i18n/config"

function isValidCategorySlug(slug: string): boolean {
  return slug === "brands" || categories.some((category) => category.id === slug)
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()
  if (!isValidCategorySlug(slug)) notFound()

  if (slug === "brands") {
    return <BrandsShowcase />
  }

  const { products: catalogProducts, loadError } =
    await getCatalogProductsByCategorySlug(slug, locale)

  return (
    <CategoryPageContent
      slug={slug}
      catalogProducts={catalogProducts}
      catalogLoadError={loadError != null}
    />
  )
}