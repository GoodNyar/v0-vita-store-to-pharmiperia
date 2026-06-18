import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ToastProvider } from '@/components/toast-provider'
import { AuthProvider } from '@/components/auth-provider'
import { CartProvider } from '@/components/cart-context'
import { FavoritesProvider } from '@/components/favorites-provider'
import { LangProvider } from '@/lib/i18n'
import { OrgJsonLd } from '@/components/org-json-ld'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

const SITE_URL = 'https://pharmiperia.lv'
const SITE_NAME = 'Pharmiperia'
const DEFAULT_DESCRIPTION =
  'Pharmiperia — аутентичная французская дермо-косметика в Латвии. Bioderma, Vichy, La Roche-Posay, Avène и другие бренды с доставкой по всей Латвии.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — французская дермо-косметика`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    'французская косметика', 'дермо-косметика', 'аптечная косметика', 'Латвия',
    'Bioderma', 'Vichy', 'La Roche-Posay', 'Avène', 'Nuxe', 'Caudalie',
    'косметика онлайн', 'pharmiperia',
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    locale: 'lv_LV',
    alternateLocale: ['ru_RU'],
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — французская дермо-косметика`,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: '/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'Pharmiperia — французская дермо-косметика в Латвии',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — французская дермо-косметика`,
    description: DEFAULT_DESCRIPTION,
    images: ['/og-default.jpg'],
  },
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
  alternates: {
    canonical: SITE_URL,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="lv">
      <body className="font-sans antialiased">
        <OrgJsonLd />
        <LangProvider>
          <AuthProvider>
            <FavoritesProvider>
              <CartProvider>
                <ToastProvider>
                  {children}
                </ToastProvider>
              </CartProvider>
            </FavoritesProvider>
          </AuthProvider>
        </LangProvider>
        <Analytics />
      </body>
    </html>
  )
}
