"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { beginGoogleOAuth, signInWithCaptcha } from "@/app/actions/auth"
import { AuthCaptcha, isAuthCaptchaRequired } from "@/components/auth-captcha"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Leaf, Eye, EyeOff, Loader2 } from "lucide-react"
import { useLang } from "@/lib/i18n"

function mapAuthError(
  error: string,
  t: (key: "invalidEmailPassword" | "captchaFailed" | "captchaRequired") => string
): string {
  if (error === "captcha_failed") return t("captchaFailed")
  if (error === "invalid_credentials") return t("invalidEmailPassword")
  return error
}

export default function LoginPage() {
  const router = useRouter()
  const { refreshAuth } = useAuth()
  const { t, localizedPath } = useLang()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [captchaResetKey, setCaptchaResetKey] = useState(0)

  const captchaRequired = isAuthCaptchaRequired()
  const captchaReady = !captchaRequired || Boolean(captchaToken)

  const resetCaptcha = () => {
    setCaptchaToken(null)
    setCaptchaResetKey((key) => key + 1)
  }

  const handleGoogleLogin = async () => {
    if (!captchaReady) {
      setError(t("captchaRequired"))
      return
    }

    setGoogleLoading(true)
    setError(null)

    const result = await beginGoogleOAuth(captchaToken)
    if (!result.success) {
      setError(mapAuthError(result.error, t))
      if (result.code === "captcha") resetCaptcha()
      setGoogleLoading(false)
      return
    }

    window.location.href = result.url
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!captchaReady) {
      setError(t("captchaRequired"))
      return
    }

    setLoading(true)

    const result = await signInWithCaptcha(email, password, captchaToken)
    if (!result.success) {
      setError(mapAuthError(result.error, t))
      if (result.code === "captcha") resetCaptcha()
      setLoading(false)
      return
    }

    await refreshAuth()
    router.push("/account")
    router.refresh()
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
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

      <main className="flex flex-1 items-center justify-center px-4 py-4 sm:py-8">
        <div className="w-full max-w-sm">
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-8 shadow-sm">
            <div className="mb-5 text-center">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">{t("loginTitle")}</h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {t("loginSubtitle")}{" "}
                <Link href="/auth/sign-up" className="font-semibold text-foreground hover:underline">
                  {t("loginRegister")}
                </Link>
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <AuthCaptcha onToken={setCaptchaToken} resetKey={captchaResetKey} />

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading || !captchaReady}
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
                  {t("loginGoogleButton")}
                </>
              )}
            </button>

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">{t("loginOr")}</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
                  {t("loginEmailLabel")}
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("loginEmailPlaceholder")}
                  required
                  className="h-11 w-full rounded-lg border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground">
                  {t("loginPasswordLabel")}
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("loginPasswordPlaceholder")}
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
                <Link href={localizedPath("/auth/reset-password")} className="text-sm text-primary hover:underline">
                  {t("loginForgotPassword")}
                </Link>
              </div>

              <Button
                type="submit"
                disabled={loading || !captchaReady}
                className="h-11 w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("loginLoggingIn")}
                  </>
                ) : (
                  t("loginButton")
                )}
              </Button>
            </form>

            <p className="mt-5 text-center text-xs text-muted-foreground leading-relaxed">
              {t("loginTermsText")}{" "}
              <Link href="/terms" className="text-foreground underline hover:text-primary">
                {t("loginTermsLink")}
              </Link>{" "}
              {t("loginAnd")}{" "}
              <Link href="/privacy" className="text-foreground underline hover:text-primary">
                {t("loginPrivacyLink")}
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}