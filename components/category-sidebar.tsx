"use client"

import { useState } from "react"
import { categories } from "@/lib/data"
import { useLang, type TranslationKey } from "@/lib/i18n"
import {
  Sparkles,
  Droplets,
  Heart,
  Sun,
  Paintbrush,
  User,
  Tag,
  Percent,
  Flame,
  ChevronRight,
} from "lucide-react"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  sparkles: Sparkles,
  droplets: Droplets,
  heart: Heart,
  sun: Sun,
  paintbrush: Paintbrush,
  user: User,
  tag: Tag,
  percent: Percent,
  flame: Flame,
}

// Brand names are not translated — render as-is
const isBrandName = (sub: string) =>
  ["Bioderma", "Vichy", "Avène", "Nuxe", "Biotherm", "Clinique", "Evian"].includes(sub)

export function CategorySidebar() {
  const { t } = useLang()
  const [expandedCategory, setExpandedCategory] = useState<string | null>("skincare")

  const getSubcategoryLabel = (sub: string): string => {
    if (isBrandName(sub)) return sub
    try {
      return t(sub as TranslationKey)
    } catch {
      return sub
    }
  }

  return (
    <aside className="hidden w-56 flex-shrink-0 lg:block">
      <div className="rounded-lg border border-border bg-card">
        <div className="border-b border-border px-4 py-3">
          <h3 className="text-sm font-semibold text-card-foreground">
            {t("categories")}
          </h3>
        </div>
        <nav className="py-1">
          {categories.map((category) => {
            const IconComponent = iconMap[category.icon]
            const isExpanded = expandedCategory === category.id

            return (
              <div key={category.id}>
                <button
                  onClick={() =>
                    setExpandedCategory(isExpanded ? null : category.id)
                  }
                  className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:bg-secondary ${
                    isExpanded
                      ? "bg-secondary font-medium text-primary"
                      : "text-card-foreground"
                  }`}
                >
                  {IconComponent && (
                    <IconComponent
                      className={`h-4 w-4 flex-shrink-0 ${
                        isExpanded ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                  )}
                  <span className="flex-1 text-left">
                    {t(category.id as TranslationKey)}
                  </span>
                  {category.subcategories.length > 0 && (
                    <ChevronRight
                      className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${
                        isExpanded ? "rotate-90" : ""
                      }`}
                    />
                  )}
                </button>
                {isExpanded && category.subcategories.length > 0 && (
                  <div className="bg-secondary/50 py-1">
                    {category.subcategories.map((sub) => (
                      <a
                        key={sub}
                        href="#"
                        className="block py-1.5 pl-11 pr-4 text-[13px] text-muted-foreground transition-colors hover:text-primary"
                      >
                        {getSubcategoryLabel(sub)}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
