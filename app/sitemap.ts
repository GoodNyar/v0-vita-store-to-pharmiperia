import type { MetadataRoute } from 'next'
import { products, categories, BRANDS_ORDERED } from '@/lib/data'

const SITE_URL = 'https://pharmiperia.lv'

function brandSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // Static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL,                        lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${SITE_URL}/popular`,           lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${SITE_URL}/specials`,          lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${SITE_URL}/blog`,              lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${SITE_URL}/about`,             lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/contact`,           lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/delivery`,          lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/returns`,           lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}/payment-methods`,   lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}/privacy`,           lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${SITE_URL}/terms`,             lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${SITE_URL}/data-security`,     lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
  ]

  // Category pages
  const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${SITE_URL}/category/${cat.id}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // Brand pages
  const brandRoutes: MetadataRoute.Sitemap = BRANDS_ORDERED.map((brand) => ({
    url: `${SITE_URL}/brand/${brandSlug(brand)}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // Product pages
  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_URL}/products/${product.id}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...categoryRoutes, ...brandRoutes, ...productRoutes]
}
