import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ToastProvider } from '@/components/toast-provider'
import { AuthProvider } from '@/components/auth-provider'
import { CartProvider } from '@/components/cart-context'
import { FavoritesProvider } from '@/components/favorites-provider'
import { LangProvider } from '@/lib/i18n'
import { PullToRefresh } from '@/components/pull-to-refresh'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Pharmiperia',
  description: 'Аутентичная французская аптечная косметика и аптечный уход за кожей от европейских брендов.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <LangProvider>
          <AuthProvider>
            <FavoritesProvider>
              <CartProvider>
                <ToastProvider>
                  <PullToRefresh>
                    {children}
                  </PullToRefresh>
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
