"use client"

import { useState, useEffect } from "react"
import { promoBarItems } from "@/lib/data"
import { X } from "lucide-react"

export function PromoBar() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promoBarItems.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  if (!visible) return null

  return (
    <div className="relative flex items-center justify-center bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
      <span className="text-center">{promoBarItems[currentIndex]}</span>
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
