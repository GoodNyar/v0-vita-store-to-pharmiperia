import type { MetadataRoute } from 'next'
import { products, categories, BRANDS_ORDERED, getBrandSlug, getProductSlug } from '@/lib/data'
import { LOCALES } from '@/lib/i18n/config'
import { localizedPath } from '@/lib/i18n/routes'

import { getSiteUrl } from '@/lib/site'

const SITE_URL = getSiteUrl()

const STATIC_PATHS = [
  '/',
  '/popular',
  '/specials',
  '/blog',
  '/about',
  '/contact',
  '/delivery',
  '/returns',
  '/payment-methods',
  '/privacy',
  '/cookies',
  '/terms',
  '/data-security',
] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    STATIC_PATHS.map((path) => ({
      url: `${SITE_URL}${localizedPath(locale, path)}`,
      lastModified: now,
      changeFrequency: path === '/' ? 'daily' : path === '/popular' || path === '/specials' ? 'daily' : 'monthly',
      priority: path === '/' ? 1.0 : path === '/popular' || path === '/specials' ? 0.9 : 0.5,
    }))
  )

  const categoryRoutes: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    categories.map((cat) => ({
      url: `${SITE_URL}${localizedPath(locale, `/category/${cat.id}`)}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  )

  const brandRoutes: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    BRANDS_ORDERED.map((brand) => getBrandSlug(brand)).map((slug) => ({
        url: `${SITE_URL}${localizedPath(locale, `/brand/${slug}`)}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))
  )

  const productRoutes: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    products.map((product) => ({
      url: `${SITE_URL}${localizedPath(locale, `/products/${getProductSlug(product)}`)}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  )

  return [...staticRoutes, ...categoryRoutes, ...brandRoutes, ...productRoutes]
}