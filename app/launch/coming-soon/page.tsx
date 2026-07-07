import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { LaunchComingSoon } from '@/components/launch-coming-soon'
import { launchRobotsNoIndex } from '@/lib/launch/lockdown'

export const metadata: Metadata = {
  title: 'Mēs drīz atvērsimies | Pharmiperia',
  description:
    'Pharmiperia drīz atvērs durvis — autentiska franču dermo-kosmētika Latvijā.',
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
}

export default function LaunchComingSoonPage() {
  if (!launchRobotsNoIndex()) {
    redirect('/lv')
  }

  return <LaunchComingSoon />
}