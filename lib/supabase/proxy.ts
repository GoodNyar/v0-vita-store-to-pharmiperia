import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { DEFAULT_LOCALE, isLocale } from '@/lib/i18n/config'
import { localizedPath, stripLocalePrefix } from '@/lib/i18n/routes'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { locale, path } = stripLocalePrefix(request.nextUrl.pathname)
  const activeLocale = locale ?? DEFAULT_LOCALE

  const isProtectedRoute =
    (path.startsWith('/account') && !path.startsWith('/account/favorites')) ||
    path.startsWith('/protected')

  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = localizedPath(activeLocale, '/auth/login')
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}