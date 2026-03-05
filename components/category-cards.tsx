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

// Only show main shopping categories in the tile grid (exclude specials/bestsellers)
const tileCategories = categories.filter((c) =>
  !["specials", "bestsellers"].includes(c.id)
)

export function CategoryCards() {
  const { t } = useLang()

  return (
    <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
      {tileCategories.map((cat) => {
        const Icon = iconMap[cat.icon]
        const color = colorMap[cat.id] ?? "bg-primary/10 text-primary"
        return (
          <a
            key={cat.id}
            href="#"
            className="flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-3 transition-all hover:border-primary/30 hover:shadow-md"
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
  )
}
