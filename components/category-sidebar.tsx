"use client"

import { useState } from "react"
import { categories } from "@/lib/data"
import {
  Pill,
  Dumbbell,
  Sparkles,
  Apple,
  Droplets,
  Baby,
  PawPrint,
  Home,
  ChevronRight,
} from "lucide-react"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  pill: Pill,
  dumbbell: Dumbbell,
  sparkles: Sparkles,
  apple: Apple,
  droplets: Droplets,
  baby: Baby,
  pawprint: PawPrint,
  home: Home,
}

export function CategorySidebar() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(
    "supplements"
  )

  return (
    <aside className="hidden w-56 flex-shrink-0 lg:block">
      <div className="rounded-lg border border-border bg-card">
        <div className="border-b border-border px-4 py-3">
          <h3 className="text-sm font-semibold text-card-foreground">
            Categories
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
                  <span className="flex-1 text-left">{category.name}</span>
                  <ChevronRight
                    className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${
                      isExpanded ? "rotate-90" : ""
                    }`}
                  />
                </button>
                {isExpanded && (
                  <div className="bg-secondary/50 py-1">
                    {category.subcategories.map((sub) => (
                      <a
                        key={sub}
                        href="#"
                        className="block py-1.5 pl-11 pr-4 text-[13px] text-muted-foreground transition-colors hover:text-primary"
                      >
                        {sub}
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
