import type { MetadataRoute } from 'next'

import { launchRobotsNoIndex } from '@/lib/launch/lockdown'
import { getSiteUrl } from '@/lib/site'

const SITE_URL = getSiteUrl()

export default function robots(): MetadataRoute.Robots {
  if (launchRobotsNoIndex()) {
    return {
      rules: [
        {
          userAgent: '*',
          disallow: '/',
        },
      ],
    }
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/*/account/',
          '/*/checkout/',
          '/*/auth/',
          '/api/',
          '/*/search?*',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}