import { notFound } from "next/navigation"

export const revalidate = 3600
import { HomePageContent } from "@/components/home-page-content"
import { getCatalogProducts } from "@/lib/commerce/catalog-source"
import { isLocale } from "@/lib/i18n/config"

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const { products } = await getCatalogProducts(locale)
  const trending = [...products]
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, 8)

  return <HomePageContent products={trending} />
}