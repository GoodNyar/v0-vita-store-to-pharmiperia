import Link from "next/link"
import { Leaf, Mail, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SignUpSuccessPage() {
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

      {/* Main content */}
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-8 w-8 text-primary" />
            </div>

            <h1 className="text-2xl font-bold text-foreground">Проверьте почту</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Мы отправили вам письмо с ссылкой для подтверждения email. 
              Пожалуйста, проверьте вашу почту и перейдите по ссылке для активации аккаунта.
            </p>

            <div className="mt-6 rounded-lg border border-border bg-muted/30 p-4">
              <p className="text-xs text-muted-foreground">
                Не получили письмо? Проверьте папку «Спам» или{" "}
                <button className="text-primary hover:underline">
                  отправьте повторно
                </button>
              </p>
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
