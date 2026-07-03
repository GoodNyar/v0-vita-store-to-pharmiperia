import { withSentryConfig } from '@sentry/nextjs'
import { BASELINE_SECURITY_HEADERS } from './lib/security/headers.mjs'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: false,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  headers: async () => [
    {
      source: '/:path*',
      headers: Object.entries(BASELINE_SECURITY_HEADERS).map(([key, value]) => ({
        key,
        value,
      })),
    },
    {
      source: '/images/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ],
}

const sentryEnabled =
  Boolean(process.env.SENTRY_DSN) || Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN)

export default sentryEnabled
  ? withSentryConfig(nextConfig, {
      org: process.env.SENTRY_ORG ?? 'pharmiperia',
      project: process.env.SENTRY_PROJECT ?? 'storefront',
      authToken: process.env.SENTRY_AUTH_TOKEN,
      silent: !process.env.CI,
      tunnelRoute: '/monitoring',
      widenClientFileUpload: true,
    })
  : nextConfig