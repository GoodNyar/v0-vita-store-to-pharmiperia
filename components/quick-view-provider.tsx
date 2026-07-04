"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { usePathname } from "next/navigation"
import type { Product } from "@/lib/data"

const OPEN_DELAY_MS = 500
const CLOSE_DELAY_MS = 320

type QuickViewContextValue = {
  isOpen: boolean
  activeProductId: number | null
  isPinned: boolean
  openQuickView: (product: Product, options?: { pinned?: boolean }) => void
  closeQuickView: () => void
  scheduleOpen: (product: Product) => void
  cancelOpen: () => void
  scheduleClose: () => void
  cancelClose: () => void
}

const QuickViewContext = createContext<QuickViewContextValue | null>(null)

export function useQuickView() {
  const ctx = useContext(QuickViewContext)
  if (!ctx) {
    throw new Error("useQuickView must be used within QuickViewProvider")
  }
  return ctx
}

export function QuickViewProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [activeProductId, setActiveProductId] = useState<number | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isPinned, setIsPinned] = useState(false)
  const isPinnedRef = useRef(false)
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingProductIdRef = useRef<number | null>(null)

  useEffect(() => {
    isPinnedRef.current = isPinned
  }, [isPinned])

  const clearOpenTimer = useCallback(() => {
    if (openTimer.current) {
      clearTimeout(openTimer.current)
      openTimer.current = null
    }
  }, [])

  const clearCloseTimer = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }, [])

  const closeQuickView = useCallback(() => {
    clearOpenTimer()
    clearCloseTimer()
    setIsOpen(false)
    setIsPinned(false)
    setActiveProductId(null)
    pendingProductIdRef.current = null
  }, [clearCloseTimer, clearOpenTimer])

  const openQuickView = useCallback(
    (next: Product, options?: { pinned?: boolean }) => {
      clearOpenTimer()
      clearCloseTimer()
      setActiveProductId(next.id)
      setIsOpen(true)
      setIsPinned(options?.pinned ?? false)
    },
    [clearCloseTimer, clearOpenTimer]
  )

  const scheduleOpen = useCallback(
    (next: Product) => {
      clearOpenTimer()
      clearCloseTimer()
      pendingProductIdRef.current = next.id
      openTimer.current = setTimeout(() => {
        openQuickView(next)
      }, OPEN_DELAY_MS)
    },
    [clearCloseTimer, clearOpenTimer, openQuickView]
  )

  const cancelOpen = useCallback(() => {
    clearOpenTimer()
    pendingProductIdRef.current = null
  }, [clearOpenTimer])

  const scheduleClose = useCallback(() => {
    if (isPinnedRef.current) return
    clearCloseTimer()
    closeTimer.current = setTimeout(() => {
      closeQuickView()
    }, CLOSE_DELAY_MS)
  }, [clearCloseTimer, closeQuickView])

  const cancelClose = useCallback(() => {
    clearCloseTimer()
  }, [clearCloseTimer])

  useEffect(() => {
    closeQuickView()
  }, [pathname, closeQuickView])

  const value = useMemo(
    () => ({
      isOpen,
      activeProductId,
      isPinned,
      openQuickView,
      closeQuickView,
      scheduleOpen,
      cancelOpen,
      scheduleClose,
      cancelClose,
    }),
    [
      isOpen,
      activeProductId,
      isPinned,
      openQuickView,
      closeQuickView,
      scheduleOpen,
      cancelOpen,
      scheduleClose,
      cancelClose,
    ]
  )

  return (
    <QuickViewContext.Provider value={value}>
      {children}
    </QuickViewContext.Provider>
  )
}