import type { Metadata } from 'next'
import { getProductBySlug, getProductSlug, products } from '@/lib/data'
import { localizedPath } from '@/lib/i18n/routes'
import { isLocale, type Locale } from '@/lib/i18n/config'
import { moneyToMajor } from '@/lib/money'

import { getSiteUrl } from '@/lib/site'

const SITE_URL = getSiteUrl()

interface ProductRouteParams {
  locale: string
  slug: string
}

interface Props {
  params: Promise<ProductRouteParams>
  children: React.ReactNode
}

export async function generateMetadata({
  params,
}: {
  params: Promise<ProductRouteParams>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const product = getProductBySlug(slug)

  if (!product || !isLocale(locale)) {
    return {
      title: 'Товар не найден',
      description: 'Запрошенный товар не найден в каталоге Pharmiperia.',
    }
  }

  const title = `${product.name} — ${product.brand}`
  const description = `${product.description}. ${product.volume}. Купить ${product.name} от ${product.brand} в Pharmiperia — французская дермо-косметика в Латвии.`
  const url = `${SITE_URL}${localizedPath(locale as Locale, `/products/${slug}`)}`
  const imageUrl = product.image.startsWith('http') ? product.image : `${SITE_URL}${product.image}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      images: [{ url: imageUrl, width: 800, height: 800, alt: product.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  }
}

export async function generateStaticParams() {
  return products.map((product) => ({ slug: getProductSlug(product) }))
}

export default async function ProductLayout({ params, children }: Props) {
  const { locale, slug } = await params
  const product = getProductBySlug(slug)

  if (!product || !isLocale(locale)) return <>{children}</>

  const imageUrl = product.image.startsWith('http') ? product.image : `${SITE_URL}${product.image}`
  const url = `${SITE_URL}${localizedPath(locale as Locale, `/products/${slug}`)}`

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: imageUrl,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'EUR',
      price: moneyToMajor(product.price),
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Pharmiperia',
      },
    },
    aggregateRating: product.reviewCount > 0
      ? {
          '@type': 'AggregateRating',
          ratingValue: product.rating,
          reviewCount: product.reviewCount,
          bestRating: 5,
          worstRating: 1,
        }
      : undefined,
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Pharmiperia', item: `${SITE_URL}/${locale}` },
      {
        '@type': 'ListItem',
        position: 2,
        name: product.category,
        item: `${SITE_URL}${localizedPath(locale as Locale, `/category/${product.category}`)}`,
      },
      { '@type': 'ListItem', position: 3, name: product.name, item: url },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {children}
    </>
  )
}