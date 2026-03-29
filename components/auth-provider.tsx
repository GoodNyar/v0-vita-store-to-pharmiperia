"use client"

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User, Session } from "@supabase/supabase-js"

interface AuthContextType {
  user: User | null
  session: Session | null
  isLoading: boolean
  signOut: () => Promise<void>
  refreshAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  signOut: async () => {},
  refreshAuth: async () => {},
})

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
  initialSession?: Session | null
}

export function AuthProvider({ children, initialSession = null }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(initialSession?.user ?? null)
  const [session, setSession] = useState<Session | null>(initialSession)
  const [isLoading, setIsLoading] = useState(!initialSession)

  const refreshAuth = useCallback(async () => {
    const supabase = createClient()
    const { data: { session: currentSession } } = await supabase.auth.getSession()
    setSession(currentSession)
    setUser(currentSession?.user ?? null)
  }, [])

  const signOut = useCallback(async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
  }, [])

  useEffect(() => {
    const supabase = createClient()

    // Get initial session and user
    const initAuth = async () => {
      try {
        // Use getUser() for reliable auth check (validates with server)
        const { data: { user: currentUser } } = await supabase.auth.getUser()
        const { data: { session: currentSession } } = await supabase.auth.getSession()
        setUser(currentUser)
        setSession(currentSession)
      } catch (error) {
        setUser(null)
        setSession(null)
      } finally {
        setIsLoading(false)
      }
    }

    if (!initialSession) {
      initAuth()
    } else {
      setIsLoading(false)
    }

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession)
        setUser(currentSession?.user ?? null)
        setIsLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [initialSession])

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signOut, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  )
}
