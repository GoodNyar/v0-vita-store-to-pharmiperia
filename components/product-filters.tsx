"use client"

import { useLang } from "@/lib/i18n"
import { ChevronDown, X } from "lucide-react"

export function ProductFilters() {
  const { t } = useLang()

  return (
    <div className="mb-5">
      {/* Row 1: Filters pill + Sort by pill */}
      <div className="flex items-center gap-3">
        {/* Filters pill button */}
        <button className="flex flex-1 items-center justify-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted sm:flex-none sm:min-w-[140px]">
          {t("filterFilters")}
        </button>

        {/* Sort by pill button */}
        <button className="flex flex-1 items-center justify-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted sm:flex-none sm:min-w-[160px]">
          {t("filterSort")}
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Row 2: Clear all — right-aligned, red, with X icon */}
      <div className="mt-2 flex justify-end">
        <button className="flex items-center gap-1 text-sm font-medium text-destructive transition-opacity hover:opacity-70">
          <X className="h-3.5 w-3.5" />
          {t("filterClearAll")}
        </button>
      </div>
    </div>
  )
}
