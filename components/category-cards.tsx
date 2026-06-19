"use client"

import { categories } from "@/lib/data"
import { useLang, type TranslationKey } from "@/lib/i18n"
import {
  Sparkles,
  Droplets,
  Heart,
  Sun,
  Paintbrush,
  User,
  UserRound,
  Tag,
} from "lucide-react"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  sparkles: Sparkles,
  droplets: Droplets,
  heart: Heart,
  sun: Sun,
  paintbrush: Paintbrush,
  user: User,
  userRound: UserRound,
  tag: Tag,
}

const colorMap: Record<string, string> = {
  skincare: "bg-primary/10 text-primary",
  haircare: "bg-accent/10 text-accent",
  bodycare: "bg-destructive/10 text-destructive",
  sunprotection: "bg-accent/10 text-accent",
  makeup: "bg-primary/10 text-primary",
  mencare: "bg-accent/10 text-accent",
  womencare: "bg-primary/10 text-primary",
  brands: "bg-destructive/10 text-destructive",
}

// All main shopping categories (exclude specials/bestsellers)
const tileCategories = categories.filter((c) =>
  !["specials", "bestsellers"].includes(c.id)
)

// Priority 6 categories shown on mobile in 2×3 grid
const mobilePriority = ["skincare", "haircare", "bodycare", "womencare", "mencare", "brands"]
const mobileTileCategories = mobilePriority
  .map((id) => tileCategories.find((c) => c.id === id))
  .filter(Boolean) as typeof tileCategories

export function CategoryCards() {
  const { t } = useLang()

  return (
    <>
      {/* Mobile: 2 rows × 3 columns (6 priority categories) */}
      <div className="grid grid-cols-3 gap-2.5 sm:hidden">
        {mobileTileCategories.map((cat) => {
          const Icon = iconMap[cat.icon]
          const color = colorMap[cat.id] ?? "bg-primary/10 text-primary"
          return (
            <a
              key={cat.id}
              href="#"
              className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-card px-2 py-3 shadow-[0_2px_12px_rgba(0,0,0,0.05)] transition-all duration-500 ease-out hover:-translate-y-0.5 hover:scale-[1.01] hover:border-primary/30 hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)]"
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full ${color}`}
              >
                {Icon && <Icon className="h-4.5 w-4.5" />}
              </div>
              <span className="line-clamp-2 text-center text-[11px] font-medium leading-tight text-card-foreground">
                {t(cat.id as TranslationKey)}
              </span>
            </a>
          )
        })}
      </div>

      {/* Desktop: all categories in a single row */}
      <div className="hidden sm:grid sm:grid-cols-8 sm:gap-3">
        {tileCategories.map((cat) => {
          const Icon = iconMap[cat.icon]
          const color = colorMap[cat.id] ?? "bg-primary/10 text-primary"
          return (
            <a
              key={cat.id}
              href="#"
              className="flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-3 shadow-[0_2px_12px_rgba(0,0,0,0.05)] transition-all duration-500 ease-out hover:-translate-y-0.5 hover:scale-[1.01] hover:border-primary/30 hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)]"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${color}`}
              >
                {Icon && <Icon className="h-5 w-5" />}
              </div>
              <span className="text-center text-xs font-medium text-card-foreground">
                {t(cat.id as TranslationKey)}
              </span>
            </a>
          )
        })}
      </div>
    </>
  )
}
