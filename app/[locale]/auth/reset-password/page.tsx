"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { requestPasswordResetWithCaptcha } from "@/app/actions/auth"
import { AuthCaptcha, isAuthCaptchaRequired } from "@/components/auth-captcha"
import { Button } from "@/components/ui/button"
import { Leaf, Loader2 } from "lucide-react"
import { useLang } from "@/lib/i18n"

function mapAuthError(
  error: string,
  t: (key: "captchaFailed" | "captchaRequired") => string
): string {
  if (error === "captcha_failed") return t("captchaFailed")
  return error
}

export default function ResetPasswordPage() {
  const { t, localizedPath } = useLang()
  const params = useParams()
  const locale = typeof params.locale === "string" ? params.locale : "lv"
  const [email, setEmail] = useState("")
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
    const result = await requestPasswordResetWithCaptcha(email, captchaToken, locale)
    if (!result.success) {
      setError(mapAuthError(result.error, t))
      if (result.code === "captcha") resetCaptcha()
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
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
                {t("resetPasswordTitle")}
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">{t("resetPasswordSubtitle")}</p>
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {success ? (
              <div className="space-y-4 text-center">
                <p className="text-sm text-muted-foreground">{t("resetPasswordSuccess")}</p>
                <Link href={localizedPath("/auth/login")}>
                  <Button className="w-full">{t("resetPasswordBackToLogin")}</Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <AuthCaptcha onToken={setCaptchaToken} resetKey={captchaResetKey} />

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    {t("resetPasswordEmailLabel")}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("loginEmailPlaceholder")}
                    required
                    className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading || !captchaReady}
                  className="h-11 w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("resetPasswordSubmitting")}
                    </>
                  ) : (
                    t("resetPasswordSubmit")
                  )}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  <Link
                    href={localizedPath("/auth/login")}
                    className="font-semibold text-foreground hover:underline"
                  >
                    {t("resetPasswordBackToLogin")}
                  </Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}