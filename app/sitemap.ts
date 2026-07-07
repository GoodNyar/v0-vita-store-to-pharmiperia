import type { MetadataRoute } from 'next'
import { launchRobotsNoIndex } from '@/lib/launch/lockdown'
import { categories, BRANDS_ORDERED, getBrandSlug } from '@/lib/data'
import { getCatalogProducts } from '@/lib/commerce/catalog-source'
import { productSlug } from '@/lib/commerce/slugs'
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

function staticAndTaxonomyRoutes(now: Date): MetadataRoute.Sitemap {
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

  return [...staticRoutes, ...categoryRoutes, ...brandRoutes]
}

async function allProductRoutes(now: Date): Promise<MetadataRoute.Sitemap> {
  return (
    await Promise.all(
      LOCALES.map(async (locale) => {
        const { products, loadError } = await getCatalogProducts(locale)
        if (loadError) {
          console.error('[sitemap] skipping product routes — catalog unavailable', { locale })
          return []
        }
        return products.map((product) => ({
          url: `${SITE_URL}${localizedPath(locale, `/products/${productSlug(product)}`)}`,
          lastModified: now,
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        }))
      })
    )
  ).flat()
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (launchRobotsNoIndex()) {
    return []
  }

  const now = new Date()
  const products = await allProductRoutes(now)
  return [...staticAndTaxonomyRoutes(now), ...products]
}
