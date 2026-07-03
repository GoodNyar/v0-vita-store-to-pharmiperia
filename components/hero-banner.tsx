"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useLang } from "@/lib/i18n"
import { useRouter } from "next/navigation"

const slides = [
  {
    id: 1,
    brand: "Bioderma",
    subtitle: "Аптечная косметика для чувствительной кожи",
    image: "/images/banner-bioderma.jpg",
    slug: "bioderma",
    bg: "#d6eaf5",
  },
  {
    id: 2,
    brand: "Vichy",
    subtitle: "Уход на основе вулканической воды",
    image: "/images/banner-vichy.jpg",
    slug: "vichy",
    bg: "#cce3f0",
  },
  {
    id: 3,
    brand: "Biotherm",
    subtitle: "Уход с технологиями чистой воды",
    image: "/images/banner-biotherm.jpg",
    slug: "biotherm",
    bg: "#1a5080",
  },
  {
    id: 4,
    brand: "Caudalie",
    subtitle: "Натуральная косметика с полифенолами",
    image: "/images/banner-caudalie.jpg",
    slug: "caudalie",
    bg: "#c8ddf0",
  },
]

export function HeroBanner() {
  const { t, localizedPath } = useLang()
  const router = useRouter()
  const [current, setCurrent] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)
  const touchStartX = useRef<number | null>(null)
  const isDragging = useRef(false)

  useEffect(() => {
    if (!isAutoPlay) return
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlay])

  const pauseAndResume = () => {
    setIsAutoPlay(false)
    setTimeout(() => setIsAutoPlay(true), 8000)
  }

  const goToSlide = (index: number) => {
    setCurrent(index)
    pauseAndResume()
  }

  const goToPrevious = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
    pauseAndResume()
  }

  const goToNext = () => {
    setCurrent((prev) => (prev + 1) % slides.length)
    pauseAndResume()
  }

  // Touch handlers — use clientX for reliable cross-browser support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    isDragging.current = false
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const diff = Math.abs(e.touches[0].clientX - touchStartX.current)
    if (diff > 10) {
      isDragging.current = true
      e.preventDefault() // Prevent page scroll when swiping horizontally
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const endX = e.changedTouches[0].clientX
    const diff = touchStartX.current - endX

    if (Math.abs(diff) > 50) {
      if (diff > 0) goToNext()
      else goToPrevious()
      e.preventDefault() // Prevent any default browser behavior
    }

    touchStartX.current = null
  }

  const handleBannerClick = () => {
    if (!isDragging.current) {
      router.push(localizedPath(`/brand/${slides[current].slug}`))
    }
  }

  const slide = slides[current]

  return (
    <div
      className="relative w-full overflow-hidden rounded-lg cursor-pointer select-none"
      style={{ backgroundColor: slide.bg, touchAction: "pan-y" }}
      onClick={handleBannerClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Fixed-height container — all slide images pre-rendered, shown via opacity */}
      <div className="relative h-[220px] w-full sm:h-[280px] md:h-[360px] lg:h-[440px]">
        {slides.map((s, i) => (
          <Image
            key={s.id}
            src={s.image}
            alt={s.brand}
            fill
            className={`object-cover object-center transition-opacity duration-500 ${
              i === current ? "opacity-100" : "opacity-0"
            }`}
            priority={i === 0}
            loading={i === 0 ? "eager" : "lazy"}
            sizes="(max-width: 768px) 100vw, 1200px"
          />
        ))}

        {/* Left gradient so text is always readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent" />

        {/* Text overlay — bottom-left aligned */}
        <div className="absolute inset-0 z-10 flex flex-col justify-end p-4 sm:p-6 md:p-8 lg:p-12">
          <h2 className="text-2xl font-bold text-white drop-shadow-md sm:text-3xl md:text-4xl lg:text-5xl">
            {slide.brand}
          </h2>
          <p className="mt-1 max-w-[28ch] text-xs text-white/90 drop-shadow sm:mt-2 sm:text-sm md:text-base">
            {slide.subtitle}
          </p>
          <button
            className="mt-3 w-fit rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary/90 hover:shadow-md active:scale-95 sm:mt-4 sm:px-5 sm:py-2 sm:text-sm md:px-6 md:py-2.5"
            onClick={(e) => {
              e.stopPropagation()
              router.push(localizedPath(`/brand/${slide.slug}`))
            }}
          >
            {t("viewCatalog")}
          </button>
        </div>

        {/* Slide counter — top right */}
        <div className="absolute right-3 top-3 z-20 rounded-full bg-black/25 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm md:right-4 md:top-4 md:px-3 md:py-1 md:text-sm">
          {current + 1}/{slides.length}
        </div>

        {/* Arrows — desktop only, very subtle */}
        <button
          className="absolute left-2 top-1/2 z-20 hidden -translate-y-1/2 p-2 text-white/25 transition-colors hover:text-white/60 md:block md:left-3"
          onClick={(e) => { e.stopPropagation(); goToPrevious() }}
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-7 w-7" />
        </button>
        <button
          className="absolute right-2 top-1/2 z-20 hidden -translate-y-1/2 p-2 text-white/25 transition-colors hover:text-white/60 md:block md:right-3"
          onClick={(e) => { e.stopPropagation(); goToNext() }}
          aria-label="Next slide"
        >
          <ChevronRight className="h-7 w-7" />
        </button>

        {/* Dots — all devices */}
        <div
          className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1.5"
          onClick={(e) => e.stopPropagation()}
        >
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); goToSlide(i) }}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? "h-1.5 w-5 bg-white"
                  : "h-1.5 w-1.5 bg-white/45 hover:bg-white/70"
              }`}
              aria-label={`Слайд ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
