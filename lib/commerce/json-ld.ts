import 'server-only'

import type { Product } from '@/lib/data'
import type { Locale } from '@/lib/i18n/config'
import { localizedPath } from '@/lib/i18n/routes'
import { moneyToMajor } from '@/lib/money'
import { getSiteUrl } from '@/lib/site'

const SITE_URL = getSiteUrl()

export function buildProductJsonLd(product: Product, locale: Locale, slug: string) {
  const imageUrl = product.image.startsWith('http')
    ? product.image
    : `${SITE_URL}${product.image}`
  const url = `${SITE_URL}${localizedPath(locale, `/products/${slug}`)}`

  return {
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
    aggregateRating:
      product.reviewCount > 0
        ? {
            '@type': 'AggregateRating',
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
            bestRating: 5,
            worstRating: 1,
          }
        : undefined,
  }
}

export function buildProductBreadcrumbJsonLd(
  product: Product,
  locale: Locale,
  slug: string
) {
  const url = `${SITE_URL}${localizedPath(locale, `/products/${slug}`)}`

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Pharmiperia',
        item: `${SITE_URL}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: product.category,
        item: `${SITE_URL}${localizedPath(locale, `/category/${product.category}`)}`,
      },
      { '@type': 'ListItem', position: 3, name: product.name, item: url },
    ],
  }
}