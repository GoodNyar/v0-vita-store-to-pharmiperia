import { Leaf, Mail, Sparkles } from 'lucide-react'
import { getInfoEmail, getSiteHost } from '@/lib/site'

export function LaunchComingSoon() {
  const contactEmail = getInfoEmail()
  const siteHost = getSiteHost()

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.95_0.04_145),transparent_55%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-16 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 bottom-10 h-64 w-64 rounded-full bg-accent/15 blur-3xl"
      />

      <main className="relative z-10 mx-auto flex w-full max-w-xl flex-col items-center text-center">
        <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm ring-1 ring-primary/15">
          <Leaf className="h-8 w-8" strokeWidth={1.75} />
        </div>

        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground backdrop-blur-sm">
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          {siteHost}
        </p>

        <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Mēs drīz atvērsimies.
        </h1>

        <p className="mt-4 max-w-md text-pretty text-lg text-muted-foreground">
          Franču dermo-kosmētikas tiešsaistes veikals Latvijā tiek gatavots jūsu ikdienas rutīnai.
        </p>

        <p className="mt-3 max-w-md text-pretty text-base text-muted-foreground/90">
          Скоро откроемся — интернет-магазин аутентичной французской дермокосметики в Латвии.
        </p>

        <div className="mt-10 w-full max-w-sm rounded-2xl border border-border/80 bg-card/90 p-6 shadow-sm backdrop-blur-sm">
          <p className="text-sm font-medium text-foreground">Jautājumi pirms atvēršanas?</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Rakstiet mums — atbildēsim pēc iespējas ātrāk.
          </p>
          <a
            href={`mailto:${contactEmail}`}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Mail className="h-4 w-4" />
            {contactEmail}
          </a>
        </div>

        <p className="mt-10 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Pharmiperia · Bioderma · Vichy · La Roche-Posay · Avène
        </p>
      </main>
    </div>
  )
}