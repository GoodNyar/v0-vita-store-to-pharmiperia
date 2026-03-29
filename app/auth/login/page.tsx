"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Leaf, Eye, EyeOff, Loader2 } from "lucide-react"
import { useLang } from "@/lib/i18n"

export default function LoginPage() {
  const router = useRouter()
  const { lang } = useLang()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    setError(null)
    
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/account`,
      },
    })

    if (error) {
      setError(error.message)
      setGoogleLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      const errorMsg = error.message === "Invalid login credentials" 
        ? (lang === "ru" ? "Неверный email или пароль" : "Nepareizs e-pasts vai parole")
        : error.message
      setError(errorMsg)
      setLoading(false)
      return
    }

    console.log('[v0] Login successful, redirecting to /account')
    router.push("/account")
    router.refresh()
  }

  const texts = {
    ru: {
      title: "Вход в аккаунт",
      subtitle: "Нет аккаунта?",
      register: "Зарегистрироваться",
      googleButton: "Войти через Google",
      or: "или",
      emailLabel: "Email",
      emailPlaceholder: "example@email.com",
      passwordLabel: "Пароль",
      passwordPlaceholder: "Введите пароль",
      forgotPassword: "Забыли пароль?",
      loginButton: "Войти",
      loggingIn: "Вход...",
      termsText: "Входя в аккаунт, вы соглашаетесь с",
      termsLink: "Условиями использования",
      and: "и",
      privacyLink: "Политикой конфиденциальности",
    },
    lv: {
      title: "Ieiet kontā",
      subtitle: "Nav konta?",
      register: "Reģistrēties",
      googleButton: "Ieiet ar Google",
      or: "vai",
      emailLabel: "E-pasts",
      emailPlaceholder: "example@email.com",
      passwordLabel: "Parole",
      passwordPlaceholder: "Ievadiet paroli",
      forgotPassword: "Aizmirsāt paroli?",
      loginButton: "Ieiet",
      loggingIn: "Ieiet...",
      termsText: "Ieejot kontā, jūs piekrītat",
      termsLink: "Lietošanas noteikumiem",
      and: "un",
      privacyLink: "Privātuma politikai",
    },
  }

  const txt = texts[lang]

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-1.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Leaf className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">Pharmiperia</span>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-1 items-center justify-center px-4 py-4 sm:py-8">
        <div className="w-full max-w-sm">
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-8 shadow-sm">
            {/* Title */}
            <div className="mb-5 text-center">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">{txt.title}</h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {txt.subtitle}{" "}
                <Link href="/auth/sign-up" className="font-semibold text-foreground hover:underline">
                  {txt.register}
                </Link>
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Google button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-border bg-muted/50 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-50"
            >
              {googleLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  {txt.googleButton}
                </>
              )}
            </button>

            {/* Divider */}
            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">{txt.or}</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
                  {txt.emailLabel}
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={txt.emailPlaceholder}
                  required
                  className="h-11 w-full rounded-lg border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground">
                  {txt.passwordLabel}
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={txt.passwordPlaceholder}
                    required
                    className="h-11 w-full rounded-lg border border-border bg-background px-4 pr-11 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <Link href="/auth/reset-password" className="text-sm text-primary hover:underline">
                  {txt.forgotPassword}
                </Link>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="h-11 w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {txt.loggingIn}
                  </>
                ) : (
                  txt.loginButton
                )}
              </Button>
            </form>

            {/* Terms text */}
            <p className="mt-5 text-center text-xs text-muted-foreground leading-relaxed">
              {txt.termsText}{" "}
              <Link href="/terms" className="text-foreground underline hover:text-primary">
                {txt.termsLink}
              </Link>{" "}
              {txt.and}{" "}
              <Link href="/privacy" className="text-foreground underline hover:text-primary">
                {txt.privacyLink}
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
