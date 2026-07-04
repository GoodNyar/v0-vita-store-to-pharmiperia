import type { Metadata } from 'next'
import { BRANDS_ORDERED, getBrandSlug, getBrandNameFromSlug } from '@/lib/data'
import { isLocale, type Locale } from '@/lib/i18n/config'
import { localizedPath } from '@/lib/i18n/routes'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { getSiteUrl } from '@/lib/site'

const SITE_URL = getSiteUrl()

function slugToName(slug: string): string {
  return getBrandNameFromSlug(slug)
}

interface Props {
  params: Promise<{ locale: string; slug: string }>
  children: React.ReactNode
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const resolvedLocale: Locale = isLocale(locale) ? locale : 'lv'
  const brandName = slugToName(slug)
  const title = `${brandName} — официальный интернет-магазин в Латвии`
  const description = `Купить оригинальную косметику ${brandName} в Pharmiperia. Доставка по всей Латвии. Аутентичная французская дермо-косметика.`

  return buildPageMetadata({
    locale: resolvedLocale,
    path: `/brand/${slug}`,
    title,
    description,
  })
}

export async function generateStaticParams() {
  return BRANDS_ORDERED.map((brand) => ({
    slug: getBrandSlug(brand),
  }))
}

export default async function BrandLayout({ params, children }: Props) {
  const { locale, slug } = await params
  const resolvedLocale: Locale = isLocale(locale) ? locale : 'lv'
  const brandName = slugToName(slug)
  const url = `${SITE_URL}${localizedPath(resolvedLocale, `/brand/${slug}`)}`

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Pharmiperia', item: SITE_URL },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Бренды',
        item: `${SITE_URL}${localizedPath(resolvedLocale, '/category/brands')}`,
      },
      { '@type': 'ListItem', position: 3, name: brandName, item: url },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {children}
    </>
  )
}