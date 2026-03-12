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
    <div className="flex h-9 items-center bg-primary pl-2 pr-2 text-primary-foreground sm:h-8 sm:pl-4 sm:pr-4">
      {/* Icon + Text — takes all available space between left edge and close button */}
      <div className="flex min-w-0 flex-1 items-center justify-center gap-1.5 sm:gap-2">
        <IconComponent
          className="h-4 w-4 flex-shrink-0 sm:h-4.5 sm:w-4.5"
          strokeWidth={2}
        />
        {/* Font size clamps from 10px (narrow phones) → 13px (standard mobile) → 14px (tablet+) */}
        <span
          className="whitespace-nowrap font-medium"
          style={{ fontSize: "clamp(10px, 3.3vw, 14px)" }}
        >
          {currentItem.text}
        </span>
      </div>

      {/* Close button — fixed width so it never overlaps text */}
      <button
        onClick={() => setVisible(false)}
        className="ml-2 flex-shrink-0 rounded-sm p-0.5 text-primary-foreground/80 transition-colors hover:text-primary-foreground"
        aria-label="Close promotion banner"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
