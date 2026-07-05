"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { updatePasswordWithCaptcha } from "@/app/actions/auth"
import { AuthCaptcha, isAuthCaptchaRequired } from "@/components/auth-captcha"
import { Button } from "@/components/ui/button"
import { Leaf, Eye, EyeOff, Loader2 } from "lucide-react"
import { useLang } from "@/lib/i18n"

function mapAuthError(
  error: string,
  t: (
    key: "captchaFailed" | "captchaRequired" | "signUpPasswordMin" | "updatePasswordAuthRequired"
  ) => string
): string {
  if (error === "captcha_failed") return t("captchaFailed")
  if (error === "password_too_short") return t("signUpPasswordMin")
  if (error === "auth_required") return t("updatePasswordAuthRequired")
  return error
}

export default function UpdatePasswordPage() {
  const router = useRouter()
  const { t, localizedPath } = useLang()
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [captchaResetKey, setCaptchaResetKey] = useState(0)

  const captchaRequired = isAuthCaptchaRequired()
  const captchaReady = !captchaRequired || Boolean(captchaToken)

  const resetCaptcha = () => {
    setCaptchaToken(null)
    setCaptchaResetKey((key) => key + 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!captchaReady) {
      setError(t("captchaRequired"))
      return
    }

    setLoading(true)
    const result = await updatePasswordWithCaptcha(password, captchaToken)
    if (!result.success) {
      setError(mapAuthError(result.error, t))
      if (result.code === "captcha") resetCaptcha()
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
    router.push(localizedPath("/auth/login"))
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link href={localizedPath("/")} className="flex items-center gap-1.5">
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
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                {t("updatePasswordTitle")}
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">{t("updatePasswordSubtitle")}</p>
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {success ? (
              <p className="text-center text-sm text-muted-foreground">{t("updatePasswordSuccess")}</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <AuthCaptcha onToken={setCaptchaToken} resetKey={captchaResetKey} />

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    {t("updatePasswordLabel")}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t("updatePasswordPlaceholder")}
                      required
                      minLength={6}
                      className="h-11 w-full rounded-lg border border-border bg-background px-3 pr-10 text-sm text-foreground outline-none focus:border-primary"
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

                <Button
                  type="submit"
                  disabled={loading || !captchaReady}
                  className="h-11 w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("updatePasswordSubmitting")}
                    </>
                  ) : (
                    t("updatePasswordSubmit")
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}