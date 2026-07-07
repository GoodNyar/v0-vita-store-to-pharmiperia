import { notFound } from "next/navigation"

export const revalidate = 3600
import { ProductPageContent } from "@/components/product-page-content"
import { getCatalogProductBySlug, getCatalogProducts } from "@/lib/commerce/catalog-source"
import { isLocale } from "@/lib/i18n/config"

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()

  const product = await getCatalogProductBySlug(slug, locale)
  if (!product) notFound()

  const { products, loadError } = await getCatalogProducts(locale)
  const similarProducts = loadError
    ? []
    : products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  return <ProductPageContent product={product} similarProducts={similarProducts} />
}