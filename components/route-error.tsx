'use client'

import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { isLocale, type Locale } from '@/lib/i18n/config'

const COPY: Record<
  Locale,
  { title: string; description: string; retry: string; home: string }
> = {
  lv: {
    title: 'Kaut kas nogāja greizi',
    description: 'Mēs esam reģistrējuši kļūdu un strādājam pie labojuma. Mēģiniet vēlreiz.',
    retry: 'Mēģināt vēlreiz',
    home: 'Uz sākumu',
  },
  ru: {
    title: 'Что-то пошло не так',
    description: 'Мы зафиксировали ошибку и уже работаем над исправлением. Попробуйте ещё раз.',
    retry: 'Повторить',
    home: 'На главную',
  },
}

function localeFromPathname(): Locale {
  if (typeof window === 'undefined') return 'lv'
  const segment = window.location.pathname.split('/')[1]
  return isLocale(segment) ? segment : 'lv'
}

interface RouteErrorProps {
  error: Error & { digest?: string }
  reset: () => void
  checkout?: boolean
}

export function RouteError({ error, reset, checkout = false }: RouteErrorProps) {
  const locale = localeFromPathname()
  const copy = COPY[locale]

  useEffect(() => {
    Sentry.captureException(error, {
      tags: checkout ? { 'commerce.checkout': 'true', 'commerce.stage': 'route_error' } : undefined,
    })
  }, [error, checkout])

  const title = checkout
    ? locale === 'ru'
      ? 'Ошибка при оплате'
      : 'Kļūda apmaksā'
    : copy.title

  const description = checkout
    ? locale === 'ru'
      ? 'Не удалось загрузить оплату. Попробуйте снова или свяжитесь с поддержкой.'
      : 'Neizdevās ielādēt apmaksu. Mēģiniet vēlreiz vai sazinieties ar atbalstu.'
    : copy.description

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircle className="h-7 w-7 text-destructive" />
      </div>
      <h1 className="mb-2 text-xl font-semibold text-foreground">{title}</h1>
      <p className="mb-8 max-w-md text-sm text-muted-foreground">{description}</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button onClick={reset}>{copy.retry}</Button>
        <Button variant="outline" asChild>
          <a href={`/${locale}`}>{copy.home}</a>
        </Button>
      </div>
    </div>
  )
}