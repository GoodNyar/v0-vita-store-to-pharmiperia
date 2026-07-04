"use client"

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import Link from "next/link"
import {
  X,
  Star,
  Heart,
  ArrowUpRight,
  Check,
  ShoppingBag,
  Leaf,
  UserRound,
  FlaskConical,
  Droplets,
  Clock,
  type LucideIcon,
} from "lucide-react"
import { useCart } from "@/components/cart-context"
import { useFavorites } from "@/components/favorites-provider"
import { useLang, formatEur, productDescriptions, type TranslationKey } from "@/lib/i18n"
import type { Product } from "@/lib/data"
import {
  formatActivesSummary,
  getApplicationKey,
  getBenefitTags,
  getFreeFromKey,
  getProductImages,
  getSkinTypeTag,
  getTextureKey,
  getWhyChooseKeys,
} from "@/lib/product-quick-view"
import { cn } from "@/lib/utils"

const GREEN_PILL =
  "rounded-full border border-green-200 bg-green-50 font-medium text-green-700"

const VIEWPORT_MARGIN = 12
const ANCHOR_GAP = 12

interface PanelPosition {
  top: number
  left: number
  width: number
  height: number
  placement: "right" | "left"
}

function getGridGap(cardEl: HTMLElement): number {
  const parent = cardEl.parentElement
  if (!parent) return 16
  const style = getComputedStyle(parent)
  const columnGap = parseFloat(style.columnGap)
  if (!Number.isNaN(columnGap) && columnGap > 0) return columnGap
  const gap = parseFloat(style.gap)
  return !Number.isNaN(gap) && gap > 0 ? gap : 16
}

function computePanelPosition(
  cardRect: DOMRect,
  anchorRect: DOMRect,
  gridGap: number
): PanelPosition {
  const vw = window.innerWidth
  const panelWidth = cardRect.width * 2 + gridGap
  const panelHeight = Math.max(anchorRect.bottom - cardRect.top, 280)

  const openToRight =
    anchorRect.right + ANCHOR_GAP + panelWidth <= vw - VIEWPORT_MARGIN

  const placement: PanelPosition["placement"] = openToRight ? "right" : "left"
  const left =
    placement === "right"
      ? anchorRect.right + ANCHOR_GAP
      : anchorRect.left - panelWidth - ANCHOR_GAP

  return {
    top: cardRect.top,
    left: Math.max(
      VIEWPORT_MARGIN,
      Math.min(left, vw - panelWidth - VIEWPORT_MARGIN)
    ),
    width: panelWidth,
    height: panelHeight,
    placement,
  }
}

function positionsEqual(a: PanelPosition | null, b: PanelPosition | null) {
  if (!a || !b) return false
  return (
    a.top === b.top &&
    a.left === b.left &&
    a.width === b.width &&
    a.height === b.height &&
    a.placement === b.placement
  )
}

function InfoMiniCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-border/45 bg-[#fafafa] px-2.5 py-2">
      <Icon className="mb-1 h-3.5 w-3.5 text-muted-foreground/80" strokeWidth={1.5} />
      <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 line-clamp-2 text-[11px] font-medium leading-snug text-foreground">
        {value}
      </p>
    </div>
  )
}

interface QuickViewPanelProps {
  product: Product
  anchorRef: RefObject<HTMLElement | null>
  cardRef: RefObject<HTMLElement | null>
  isPinned: boolean
  onClose: () => void
  onMouseEnterPanel?: () => void
  onMouseLeavePanel?: () => void
}

export function QuickViewPanel({
  product,
  anchorRef,
  cardRef,
  isPinned,
  onClose,
  onMouseEnterPanel,
  onMouseLeavePanel,
}: QuickViewPanelProps) {
  const { t, lang } = useLang()
  const { addToCart } = useCart()
  const { isFavorited, toggleFavorite } = useFavorites()
  const panelRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<PanelPosition | null>(null)
  const [mounted, setMounted] = useState(false)
  const [imageIndex, setImageIndex] = useState(0)

  useEffect(() => setMounted(true), [])
  useEffect(() => setImageIndex(0), [product.id])

  const updatePosition = useCallback(() => {
    const anchorEl = anchorRef.current
    const cardEl = cardRef.current
    if (!anchorEl || !cardEl) return

    const anchor = anchorEl.getBoundingClientRect()
    const card = cardEl.getBoundingClientRect()
    const gap = getGridGap(cardEl)
    const next = computePanelPosition(card, anchor, gap)
    setPosition((prev) => (positionsEqual(prev, next) ? prev : next))
  }, [anchorRef, cardRef])

  useLayoutEffect(() => {
    updatePosition()
  }, [updatePosition, product.id])

  useEffect(() => {
    const handleResize = () => updatePosition()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [updatePosition])

  useEffect(() => {
    const handleScroll = () => {
      if (!isPinned) onClose()
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isPinned, onClose])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [onClose])

  useEffect(() => {
    if (!isPinned) return
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node
      if (panelRef.current?.contains(target)) return
      if (anchorRef.current?.contains(target)) return
      onClose()
    }
    document.addEventListener("mousedown", handlePointerDown)
    document.addEventListener("touchstart", handlePointerDown, { passive: true })
    return () => {
      document.removeEventListener("mousedown", handlePointerDown)
      document.removeEventListener("touchstart", handlePointerDown)
    }
  }, [isPinned, onClose, anchorRef])

  const images = getProductImages(product)
  const benefitTags = getBenefitTags(product)
  const whyChoose = getWhyChooseKeys(product).slice(0, 4)
  const skinTypeKey = getSkinTypeTag(product)
  const textureKey = getTextureKey(product)
  const applicationKey = getApplicationKey(product)
  const freeFromKey = getFreeFromKey(product)
  const activesSummary = formatActivesSummary(product, t, lang as "ru" | "lv")
  const isFav = isFavorited(product.id)

  const productDesc =
    productDescriptions[String(product.id) as keyof typeof productDescriptions]?.[
      lang as "lv" | "ru"
    ] || product.description

  const hasDiscount =
    !!product.originalPrice && product.originalPrice > product.price
  const savings = hasDiscount
    ? (product.originalPrice as number) - product.price
    : 0
  const discountPercent = hasDiscount
    ? Math.round((1 - product.price / (product.originalPrice as number)) * 100)
    : 0

  if (!mounted || !position) return null

  const panel = (
    <div
      ref={panelRef}
      role="dialog"
      aria-label={product.name}
      className={cn(
        "fixed z-[70] flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-border/70 shadow-[0_16px_48px_rgba(0,0,0,0.14)]",
        "duration-200 animate-in fade-in",
        position.placement === "left"
          ? "slide-in-from-right-2"
          : "slide-in-from-left-2"
      )}
      style={{
        top: position.top,
        left: position.left,
        width: position.width,
        height: position.height,
        pointerEvents: "auto",
      }}
      onMouseEnter={onMouseEnterPanel}
      onMouseLeave={onMouseLeavePanel}
    >
      <div className="flex shrink-0 items-center justify-between border-b border-border/50 px-4 py-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {t("quickView")}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label={t("close")}
        >
          <X className="h-3.5 w-3.5" strokeWidth={1.75} />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Gallery — top-left aligned packshot + thumbnails */}
        <div className="flex w-[38%] shrink-0 flex-col border-r border-border/40 bg-white">
          <div className="relative min-h-0 flex-1">
            <Image
              src={images[imageIndex] || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-contain object-left-top"
              sizes="(max-width: 1024px) 40vw, 320px"
              priority
            />
          </div>
          {images.length > 1 && (
            <div className="flex shrink-0 gap-1.5 px-2 pb-2 pt-1">
              {images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setImageIndex(i)}
                  className={cn(
                    "relative h-9 w-9 shrink-0 overflow-hidden rounded-md bg-white ring-1 transition-all",
                    i === imageIndex
                      ? "ring-primary/50"
                      : "ring-border/60 opacity-70 hover:opacity-100"
                  )}
                  aria-label={`${i + 1} / ${images.length}`}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-contain object-left-top p-0.5"
                    sizes="36px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {product.brand}
            </p>
            <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug tracking-tight text-foreground">
              {product.name}
            </h3>

            {benefitTags.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {benefitTags.map((tag) => (
                  <span
                    key={tag}
                    className={cn(
                      "inline-flex items-center px-2.5 py-1 text-[11px]",
                      GREEN_PILL
                    )}
                  >
                    {t(tag)}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
              <span className="inline-flex items-center gap-1">
                <Star
                  className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                  strokeWidth={0}
                />
                <span className="font-semibold text-foreground">{product.rating}</span>
              </span>
              <span className="text-muted-foreground">
                · {product.reviewCount.toLocaleString(lang === "lv" ? "lv" : "ru")}{" "}
                {t("reviewsShort")}
              </span>
              {product.volume && (
                <>
                  <span className="text-border">·</span>
                  <span className="text-muted-foreground">{product.volume}</span>
                </>
              )}
            </div>

            {productDesc && (
              <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                {productDesc}
              </p>
            )}

            {whyChoose.length > 0 && (
              <div className="mt-3">
                <h4 className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {t("qvWhyChoose")}
                </h4>
                <ul className="mt-2 space-y-1.5">
                  {whyChoose.map((key) => (
                    <li
                      key={key}
                      className="flex items-start gap-2 text-xs leading-snug text-foreground/90"
                    >
                      <Check
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-600"
                        strokeWidth={2.5}
                      />
                      {t(key)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="shrink-0 border-t border-border/50 px-4 py-3">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-lg font-bold tracking-tight text-foreground">
                {formatEur(product.price)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-xs text-muted-foreground line-through">
                    {formatEur(product.originalPrice as number)}
                  </span>
                  <span
                    className={cn(
                      "px-1.5 py-0.5 text-[10px] font-semibold",
                      GREEN_PILL
                    )}
                  >
                    −{discountPercent}%
                  </span>
                </>
              )}
            </div>
            {hasDiscount && (
              <p className="mt-0.5 text-xs text-green-700">
                {t("savings")} {formatEur(savings)}
              </p>
            )}

            <div className="mt-2.5 flex items-center gap-2">
              <button
                type="button"
                onClick={() => addToCart(product)}
                disabled={!product.inStock}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingBag className="h-4 w-4" />
                {t("addToCart")}
              </button>
              <button
                type="button"
                onClick={() => toggleFavorite(product.id)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                aria-label={isFav ? t("qvInFavorites") : t("qvAddToFavorites")}
              >
                <Heart
                  className={cn("h-4 w-4", isFav && "fill-red-500 text-red-500")}
                  strokeWidth={1.75}
                />
              </button>
              <Link
                href={`/products/${product.id}`}
                onClick={onClose}
                className="flex h-9 shrink-0 items-center gap-1 rounded-xl border border-border px-3 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} />
                {t("qvViewDetails")}
              </Link>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-1.5">
              <InfoMiniCard
                icon={UserRound}
                label={t("qvSkinType")}
                value={t(skinTypeKey)}
              />
              <InfoMiniCard
                icon={FlaskConical}
                label={t("qvActiveIngredients")}
                value={activesSummary}
              />
              <InfoMiniCard
                icon={Droplets}
                label={t("qvTexture")}
                value={t(textureKey)}
              />
              <InfoMiniCard
                icon={Clock}
                label={t("qvApplication")}
                value={t(applicationKey)}
              />
            </div>

            <div className="mt-2.5 flex items-start gap-2 rounded-xl bg-green-50/70 px-2.5 py-2 ring-1 ring-green-100/80">
              <Leaf
                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-600"
                strokeWidth={1.75}
              />
              <p className="text-[11px] leading-relaxed text-green-800/85">
                {t(freeFromKey)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(panel, document.body)
}