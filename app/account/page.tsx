import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Button } from '@/components/ui/button'
import { 
  Leaf, User, Package, Heart, MapPin, Settings, LogOut, 
  ChevronRight, Gift, Bell, CreditCard
} from 'lucide-react'
import AccountContent from './account-client'

export const metadata = {
  title: 'Мой аккаунт - Pharmiperia',
}

async function getUser() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          } catch {
            // catch() here is required for the cookie to work properly in Next.js Edge Runtime.
          }
        },
      },
    },
  )

  const { data: { user }, error } = await supabase.auth.getUser()
  
  console.log('[v0] Server: getUser() called', { hasUser: !!user, error: error?.message })
  
  if (!user) {
    redirect('/auth/login')
  }

  return user
}

async function getProfile(userId: string) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options),
              )
            } catch {}
          },
        },
      },
    )

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    if (error) {
      console.log('[v0] Server: Profile error:', error.message)
      return null
    }

    console.log('[v0] Server: Profile loaded:', !!data)
    return data
  } catch (err) {
    console.log('[v0] Server: Profile fetch exception:', err)
    return null
  }
}

export default async function AccountPage() {
  // Server-side: Get user immediately - redirect if not authenticated
  const user = await getUser()
  
  // Server-side: Get profile (won't block - client handles loading)
  const profile = await getProfile(user.id)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-1.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Leaf className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Pharmiperia</span>
          </Link>
        </div>
      </header>

      {/* Content with client-side interactivity */}
      <AccountContent 
        initialUser={user} 
        initialProfile={profile}
      />
    </div>
  )
}
