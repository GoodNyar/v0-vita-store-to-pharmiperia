import type { Metadata } from 'next'

import { getSiteUrl } from '@/lib/site'

const SITE_URL = getSiteUrl()

export const metadata: Metadata = {
  title: 'Акции и скидки',
  description: 'Специальные предложения и скидки на французскую дермо-косметику в Pharmiperia. Bioderma, Vichy, La Roche-Posay, Avène по выгодным ценам в Латвии.',
  alternates: { canonical: `${SITE_URL}/specials` },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/specials`,
    title: 'Акции и скидки | Pharmiperia',
    description: 'Специальные предложения и скидки на французскую дермо-косметику в Pharmiperia.',
    images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Акции и скидки Pharmiperia' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Акции и скидки | Pharmiperia',
    description: 'Специальные предложения и скидки на французскую дермо-косметику в Pharmiperia.',
  },
}

export default function SpecialsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
