import { notFound } from "next/navigation"

export const revalidate = 3600
import { PopularPageContent } from "@/components/popular-page-content"
import { getCatalogProducts } from "@/lib/commerce/catalog-source"
import { isLocale } from "@/lib/i18n/config"

export default async function PopularPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const { products } = await getCatalogProducts(locale)
  return <PopularPageContent allProducts={products} />
}