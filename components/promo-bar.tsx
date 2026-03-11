"use client"

import { useState, useEffect } from "react"
import { promoBarItems } from "@/lib/data"
import { useLang } from "@/lib/i18n"
import { X, Truck, BadgeCheck, Sparkles } from "lucide-react"

const iconMap = {
  Truck: Truck,
  BadgeCheck: BadgeCheck,
  Sparkles: Sparkles,
}

export function PromoBar() {
  const { lang } = useLang()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  const items = promoBarItems[lang]

  useEffect(() => {
    setCurrentIndex(0)
  }, [lang])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [items])

  if (!visible) return null

  const currentItem = items[currentIndex]
  const IconComponent = iconMap[currentItem.icon]

  return (
    <div className="relative flex h-9 items-center justify-center bg-primary px-4 text-sm font-medium text-primary-foreground sm:h-8">
      {/* Icon + Text Container with fixed height and single-line truncation on mobile */}
      <div className="flex items-center gap-2 truncate">
        <IconComponent className="h-4.5 w-4.5 flex-shrink-0" strokeWidth={2} />
        <span className="truncate text-center sm:text-left">
          {currentItem.text}
        </span>
      </div>
      {/* Close button */}
      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-sm p-0.5 text-primary-foreground/80 transition-colors hover:text-primary-foreground"
        aria-label="Close promotion banner"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
