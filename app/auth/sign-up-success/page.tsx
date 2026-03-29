"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Leaf, Mail, ArrowRight, Loader2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SignUpSuccessPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)
  const [error, setError] = useState("")

  const handleResend = async () => {
    if (!email) return
    setResending(true)
    setError("")
    const supabase = createClient()
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/account`,
      },
    })
    setResending(false)
    if (error) {
      setError("Не удалось отправить письмо. Попробуйте позже.")
    } else {
      setResent(true)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
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

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-8 w-8 text-primary" />
            </div>

            <h1 className="text-2xl font-bold text-foreground">Проверьте почту</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Мы отправили письмо с ссылкой подтверждения на{" "}
              {email && <span className="font-semibold text-foreground">{email}</span>}.
              {" "}Перейдите по ссылке чтобы активировать аккаунт.
            </p>

            <div className="mt-6 rounded-lg border border-border bg-muted/30 p-4 text-left space-y-2">
              <p className="text-xs font-medium text-foreground">Не получили письмо?</p>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                <li>Проверьте папку «Спам» или «Нежелательная почта»</li>
                <li>Подождите 1–2 минуты</li>
                <li>Убедитесь что email введён верно</li>
              </ul>

              {resent ? (
                <div className="mt-2 flex items-center gap-2 text-xs text-primary font-medium">
                  <CheckCircle className="h-4 w-4" />
                  Письмо отправлено повторно!
                </div>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={resending || !email}
                  className="mt-2 flex items-center gap-1.5 text-xs font-medium text-primary hover:underline disabled:opacity-50"
                >
                  {resending && <Loader2 className="h-3 w-3 animate-spin" />}
                  Отправить письмо повторно
                </button>
              )}
              {error && <p className="text-xs text-destructive">{error}</p>}
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <Link href="/auth/login">
                <Button className="h-11 w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Перейти ко входу
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="h-11 w-full">
                  Вернуться на главную
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
