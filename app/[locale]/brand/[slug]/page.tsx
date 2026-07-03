import { notFound } from "next/navigation"
import { BrandPageContent } from "@/components/brand-page-content"
import { getCatalogProductsByBrandSlug } from "@/lib/commerce/catalog-source"
import { isLocale } from "@/lib/i18n/config"

export default async function BrandPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()

  const brandProducts = await getCatalogProductsByBrandSlug(slug, locale)
  return <BrandPageContent slug={slug} brandProducts={brandProducts} />
}