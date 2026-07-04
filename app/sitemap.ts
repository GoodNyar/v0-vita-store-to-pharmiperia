import type { MetadataRoute } from 'next'
import { categories, BRANDS_ORDERED, getBrandSlug } from '@/lib/data'
import { getCatalogProducts } from '@/lib/commerce/catalog-source'
import { productSlug } from '@/lib/commerce/slugs'
import { LOCALES } from '@/lib/i18n/config'
import { localizedPath } from '@/lib/i18n/routes'
import { SITEMAP_SHARD_SIZE, shardCount, sliceShard } from '@/lib/seo/sitemap-shards'
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
        const { products } = await getCatalogProducts(locale)
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

export async function generateSitemaps() {
  const products = await allProductRoutes(new Date())
  const shards = shardCount(products.length)
  return Array.from({ length: shards }, (_, id) => ({ id }))
}

export default async function sitemap(props: {
  id: number
}): Promise<MetadataRoute.Sitemap> {
  const id = props.id
  const now = new Date()
  const products = await allProductRoutes(now)
  const productShard = sliceShard(products, id)

  if (id === 0) {
    return [...staticAndTaxonomyRoutes(now), ...productShard]
  }

  return productShard
}

export { SITEMAP_SHARD_SIZE }