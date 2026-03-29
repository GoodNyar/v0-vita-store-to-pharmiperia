"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Leaf, Eye, EyeOff, Loader2, Check } from "lucide-react"

export default function SignUpPage() {
  const router = useRouter()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const passwordStrength = () => {
    if (password.length === 0) return { level: 0, text: "", color: "" }
    if (password.length < 6) return { level: 1, text: "Слабый", color: "bg-destructive" }
    if (password.length < 10) return { level: 2, text: "Средний", color: "bg-yellow-500" }
    return { level: 3, text: "Сильный", color: "bg-primary" }
  }

  const strength = passwordStrength()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!acceptTerms) {
      setError("Необходимо принять условия использования")
      return
    }

    if (password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов")
      return
    }

    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/account`,
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push(`/auth/sign-up-success?email=${encodeURIComponent(email)}`)
  }

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
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-8 shadow-sm">
            <div className="mb-5 sm:mb-8 text-center">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">Создать аккаунт</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Получите доступ к эксклюзивным предложениям
              </p>
            </div>

            <form onSubmit={handleSignUp} className="space-y-5">
              {error && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="mb-1.5 block text-sm font-medium text-foreground">
                    Имя
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Иван"
                    required
                    className="h-11 w-full rounded-lg border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="mb-1.5 block text-sm font-medium text-foreground">
                    Фамилия
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Иванов"
                    required
                    className="h-11 w-full rounded-lg border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  required
                  className="h-11 w-full rounded-lg border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground">
                  Пароль
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Минимум 6 символов"
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
                {password.length > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex h-1.5 flex-1 gap-1">
                      <div className={`h-full flex-1 rounded-full ${strength.level >= 1 ? strength.color : "bg-muted"}`} />
                      <div className={`h-full flex-1 rounded-full ${strength.level >= 2 ? strength.color : "bg-muted"}`} />
                      <div className={`h-full flex-1 rounded-full ${strength.level >= 3 ? strength.color : "bg-muted"}`} />
                    </div>
                    <span className="text-xs text-muted-foreground">{strength.text}</span>
                  </div>
                )}
              </div>

              <label className="flex items-start gap-3 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-border"
                />
                <span>
                  Я принимаю{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    условия использования
                  </Link>{" "}
                  и{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    политику конфиденциальности
                  </Link>
                </span>
              </label>

              <Button
                type="submit"
                disabled={loading}
                className="h-11 w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Регистрация...
                  </>
                ) : (
                  "Создать аккаунт"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Уже есть аккаунт?{" "}
              <Link href="/auth/login" className="font-medium text-primary hover:underline">
                Войти
              </Link>
            </div>
          </div>

          {/* Benefits - hidden on mobile to fit screen */}
          <div className="mt-4 rounded-xl border border-border bg-card p-4 hidden sm:block">
            <h3 className="mb-3 text-sm font-medium text-foreground">Преимущества регистрации:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                Скидка 10% на первый заказ
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                Накопительные бонусы
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                История заказов и избранное
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                Персональные рекомендации
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
