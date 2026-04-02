"use client"

import { useState, useEffect, useRef, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { RefreshCw } from "lucide-react"

interface PullToRefreshProps {
  children: ReactNode
}

export function PullToRefresh({ children }: PullToRefreshProps) {
  const router = useRouter()
  const [pulling, setPulling] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [refreshing, setRefreshing] = useState(false)
  const startY = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const THRESHOLD = 80 // Pull distance needed to trigger refresh

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Only enable on mobile
    const isMobile = window.matchMedia("(max-width: 768px)").matches
    if (!isMobile) return

    let currentPullDistance = 0

    const handleTouchStart = (e: TouchEvent) => {
      // Only start if at top of page
      if (window.scrollY <= 0) {
        startY.current = e.touches[0].clientY
        setPulling(true)
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!pulling || window.scrollY > 0) {
        setPulling(false)
        setPullDistance(0)
        return
      }

      const currentY = e.touches[0].clientY
      const diff = currentY - startY.current

      if (diff > 0) {
        // Pulling down - apply resistance
        currentPullDistance = Math.min(diff * 0.5, THRESHOLD * 1.5)
        setPullDistance(currentPullDistance)
        
        if (diff > 10) {
          e.preventDefault() // Prevent native scroll
        }
      }
    }

    const handleTouchEnd = () => {
      if (currentPullDistance >= THRESHOLD && !refreshing) {
        // Trigger refresh
        setRefreshing(true)
        setPullDistance(THRESHOLD)
        
        // Navigate to home and refresh
        setTimeout(() => {
          router.push("/")
          router.refresh()
          setRefreshing(false)
          setPullDistance(0)
        }, 600)
      } else {
        setPullDistance(0)
      }
      setPulling(false)
      currentPullDistance = 0
    }

    container.addEventListener("touchstart", handleTouchStart, { passive: true })
    container.addEventListener("touchmove", handleTouchMove, { passive: false })
    container.addEventListener("touchend", handleTouchEnd, { passive: true })

    return () => {
      container.removeEventListener("touchstart", handleTouchStart)
      container.removeEventListener("touchmove", handleTouchMove)
      container.removeEventListener("touchend", handleTouchEnd)
    }
  }, [pulling, refreshing, router])

  const progress = Math.min(pullDistance / THRESHOLD, 1)
  const rotation = progress * 360

  return (
    <div ref={containerRef} className="relative min-h-screen">
      {/* Pull indicator */}
      <div 
        className="fixed left-0 right-0 flex justify-center pointer-events-none z-50 transition-transform duration-200"
        style={{ 
          top: 0,
          transform: `translateY(${Math.max(pullDistance - 60, -60)}px)`,
          opacity: progress
        }}
      >
        <div className="bg-card rounded-full p-3 shadow-lg border border-border">
          <RefreshCw 
            className={`h-6 w-6 text-primary transition-transform ${refreshing ? "animate-spin" : ""}`}
            style={{ transform: refreshing ? undefined : `rotate(${rotation}deg)` }}
          />
        </div>
      </div>

      {/* Content with pull offset */}
      <div 
        style={{ 
          transform: pullDistance > 0 ? `translateY(${pullDistance * 0.3}px)` : undefined,
          transition: pulling ? "none" : "transform 0.2s ease-out"
        }}
      >
        {children}
      </div>
    </div>
  )
}
