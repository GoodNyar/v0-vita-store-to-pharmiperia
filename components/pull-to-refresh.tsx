"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { RefreshCw } from "lucide-react"
import { useLang } from "@/lib/i18n"

export function PullToRefresh({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { t } = useLang()
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const startY = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    const handleTouchStart = (e: TouchEvent) => {
      // Only trigger if at the top of page and on mobile
      if (window.scrollY === 0 && window.innerWidth < 768) {
        startY.current = e.touches[0].clientY
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (startY.current === 0 || isRefreshing) return

      const currentY = e.touches[0].clientY
      const distance = currentY - startY.current

      // Only pull down, with resistance
      if (distance > 0) {
        setPullDistance(Math.min(distance * 0.5, 100))
      }
    }

    const handleTouchEnd = () => {
      if (pullDistance > 60 && !isRefreshing) {
        // Trigger refresh
        setIsRefreshing(true)
        
        // Simulate refresh
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: "smooth" })
          router.push("/")
          router.refresh()
          setIsRefreshing(false)
          setPullDistance(0)
        }, 1000)
      } else {
        setPullDistance(0)
      }
      startY.current = 0
    }

    window.addEventListener("touchstart", handleTouchStart)
    window.addEventListener("touchmove", handleTouchMove, { passive: true })
    window.addEventListener("touchend", handleTouchEnd)

    return () => {
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("touchend", handleTouchEnd)
    }
  }, [pullDistance, isRefreshing, router])

  return (
    <div ref={containerRef} style={{ transform: `translateY(${pullDistance}px)` }} className="transition-transform duration-200">
      {/* Pull indicator */}
      {(pullDistance > 0 || isRefreshing) && (
        <div
          className="fixed top-0 left-1/2 -translate-x-1/2 z-40 pointer-events-none md:hidden"
          style={{
            opacity: Math.min(pullDistance / 60, 1),
            transform: `translateX(-50%) translateY(${Math.max(-30 + pullDistance, -30)}px)`,
          }}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted">
              <RefreshCw
                className={`h-6 w-6 text-muted-foreground ${isRefreshing ? "animate-spin" : ""}`}
                style={{
                  transform: `rotate(${Math.min(pullDistance * 3, 360)}deg)`,
                  transition: isRefreshing ? "none" : "transform 0.1s",
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground whitespace-nowrap">{t("refresh") || "Перезагрузить"}</p>
          </div>
        </div>
      )}

      {children}
    </div>
  )
}
