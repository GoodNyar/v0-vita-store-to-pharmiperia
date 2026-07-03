import type { MetadataRoute } from 'next'

const SITE_URL = 'https://pharmiperia.lv'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/account/',
          '/checkout/',
          '/auth/',
          '/api/',
          '/search?*',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
