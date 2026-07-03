import type { Metadata } from 'next'
import { BRANDS_ORDERED, getBrandSlug, getBrandNameFromSlug } from '@/lib/data'

import { getSiteUrl } from '@/lib/site'

const SITE_URL = getSiteUrl()

function slugToName(slug: string): string {
  return getBrandNameFromSlug(slug)
}

interface Props {
  params: Promise<{ slug: string }>
  children: React.ReactNode
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const brandName = slugToName(slug)
  const title = `${brandName} — официальный интернет-магазин в Латвии`
  const description = `Купить оригинальную косметику ${brandName} в Pharmiperia. Доставка по всей Латвии. Аутентичная французская дермо-косметика.`
  const url = `${SITE_URL}/brand/${slug}`

  return {
    title: brandName,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: `${brandName} в Pharmiperia` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export async function generateStaticParams() {
  return BRANDS_ORDERED.map((brand) => ({
    slug: getBrandSlug(brand),
  }))
}

export default async function BrandLayout({ params, children }: Props) {
  const { slug } = await params
  const brandName = slugToName(slug)
  const url = `${SITE_URL}/brand/${slug}`

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Pharmiperia', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Бренды', item: `${SITE_URL}/category/brands` },
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
