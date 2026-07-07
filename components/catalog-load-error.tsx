"use client"

import Link from "next/link"
import { AlertCircle } from "lucide-react"
import { useLang } from "@/lib/i18n"
import { Button } from "@/components/ui/button"

export function CatalogLoadError({ compact = false }: { compact?: boolean }) {
  const { t, localizedPath } = useLang()

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 text-center ${
        compact ? "px-4 py-8" : "px-6 py-16"
      }`}
    >
      <AlertCircle className="mb-3 h-10 w-10 text-destructive" />
      <h2 className="text-lg font-semibold text-foreground">{t("catalogLoadErrorTitle")}</h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{t("catalogLoadErrorDesc")}</p>
      <Button asChild className="mt-6" variant="outline">
        <Link href={localizedPath("/")}>{t("backHome")}</Link>
      </Button>
    </div>
  )
}