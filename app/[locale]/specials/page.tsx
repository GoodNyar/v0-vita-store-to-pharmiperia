import { notFound } from "next/navigation"
import { SpecialsPageContent } from "@/components/specials-page-content"
import { getCatalogProducts } from "@/lib/commerce/catalog-source"
import { isLocale } from "@/lib/i18n/config"

export default async function SpecialsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const { products } = await getCatalogProducts(locale)
  return <SpecialsPageContent allProducts={products} />
}