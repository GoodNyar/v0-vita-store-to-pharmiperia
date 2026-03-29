import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          if (typeof document === 'undefined') {
            return []
          }
          const cookieString = document.cookie
          return cookieString
            .split('; ')
            .filter(Boolean)
            .map(cookie => {
              const [name, value] = cookie.split('=')
              return { name, value }
            })
        },
        setAll(cookiesToSet) {
          if (typeof document === 'undefined') return
          cookiesToSet.forEach(({ name, value, options }) => {
            const cookieOptions = options
              ? `;path=${options.path || '/'}${options.maxAge ? `;max-age=${options.maxAge}` : ''}${options.domain ? `;domain=${options.domain}` : ''}`
              : `;path=/`
            document.cookie = `${name}=${value}${cookieOptions}`
          })
        },
      },
    },
  )
}
