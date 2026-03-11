"use client"

import { useLang } from "@/lib/i18n"
import { ChevronDown } from "lucide-react"

export function ProductFilters() {
  const { t } = useLang()

  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Filter buttons — left side */}
      <div className="flex flex-wrap items-center gap-2">
        <button className="rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted">
          {t("filterBrand")}
          <ChevronDown className="ml-1.5 inline h-3.5 w-3.5" />
        </button>
        <button className="rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted">
          {t("filterPrice")}
          <ChevronDown className="ml-1.5 inline h-3.5 w-3.5" />
        </button>
        <button className="rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted">
          {t("filterSkinType")}
          <ChevronDown className="ml-1.5 inline h-3.5 w-3.5" />
        </button>
        <button className="rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted">
          {t("filterCategory")}
          <ChevronDown className="ml-1.5 inline h-3.5 w-3.5" />
        </button>
        <button className="rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted">
          {t("filterDiscounts")}
          <ChevronDown className="ml-1.5 inline h-3.5 w-3.5" />
        </button>
      </div>

      {/* Sort dropdown — right side */}
      <select
        className="h-9 rounded-lg border border-border bg-white px-3 text-xs font-medium text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        aria-label={t("filterSort")}
      >
        <option>{t("filterSort")} • {t("sortBestSelling")}</option>
        <option>{t("sortLowHigh")}</option>
        <option>{t("sortHighLow")}</option>
        <option>{t("sortTopRated")}</option>
        <option>{t("sortNewest")}</option>
      </select>
    </div>
  )
}
