"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useLang } from "@/lib/i18n"

const slides = [
  {
    id: 1,
    brand: "Bioderma",
    subtitle: "Аптечная косметика для чувствительной кожи",
    image: "/images/banner-bioderma.jpg",
  },
  {
    id: 2,
    brand: "Vichy",
    subtitle: "Уход на основе вулканической воды",
    image: "/images/banner-vichy.jpg",
  },
  {
    id: 3,
    brand: "Biotherm",
    subtitle: "Уход с технологиями чистой воды",
    image: "/images/banner-biotherm.jpg",
  },
  {
    id: 4,
    brand: "Caudalie",
    subtitle: "Натуральная косметика с полифенолами",
    image: "/images/banner-caudalie.jpg",
  },
]

export function HeroBanner() {
  const { t } = useLang()
  const [current, setCurrent] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)

  useEffect(() => {
    if (!isAutoPlay) return

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlay])

  const goToSlide = (index: number) => {
    setCurrent(index)
    setIsAutoPlay(false)
    setTimeout(() => setIsAutoPlay(true), 7000)
  }

  const goToPrevious = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
    setIsAutoPlay(false)
    setTimeout(() => setIsAutoPlay(true), 7000)
  }

  const goToNext = () => {
    setCurrent((prev) => (prev + 1) % slides.length)
    setIsAutoPlay(false)
    setTimeout(() => setIsAutoPlay(true), 7000)
  }

  const slide = slides[current]

  return (
    <div className="relative w-full overflow-hidden rounded-lg">
      {/* Main Slider Container */}
      <div className="relative h-80 w-full md:h-[380px]" style={{ aspectRatio: "auto 300px" }}>
        {/* Background Image — 100% width */}
        <Image
          src={slide.image}
          alt={slide.brand}
          fill
          className="object-cover object-center transition-opacity duration-500"
          priority={current === 0}
          key={`slide-image-${current}`}
        />

        {/* Dark Gradient Overlay (left side for text readability) */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent" />

        {/* Text Content — Overlay on Image */}
        <div className="relative z-10 flex h-full w-full flex-col justify-center px-4 py-6 sm:px-6 md:px-8 lg:px-12">
          {/* Brand Name */}
          <h2 className="text-3xl font-bold text-white sm:text-4xl md:text-4xl lg:text-5xl">
            {slide.brand}
          </h2>

          {/* Subtitle */}
          <p className="mt-2 max-w-xs text-sm text-white/90 sm:text-base md:text-lg">
            {slide.subtitle}
          </p>

          {/* CTA Button */}
          <button className="mt-5 w-fit rounded-lg bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground transition-all duration-200 hover:scale-105 hover:bg-primary/90 hover:shadow-lg active:scale-95 sm:text-sm md:mt-6 md:px-7 md:py-2.5 md:text-sm">
            {t("viewCatalog")}
          </button>
        </div>

        {/* Previous Button */}
        <button
          onClick={goToPrevious}
          className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full p-2 text-white/30 transition-all hover:text-white/70 md:left-4"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6 md:h-8 md:w-8" />
        </button>

        {/* Next Button */}
        <button
          onClick={goToNext}
          className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full p-2 text-white/30 transition-all hover:text-white/70 md:right-4"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6 md:h-8 md:w-8" />
        </button>

        {/* Dot Navigation */}
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-1.5 md:bottom-5 md:gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 ${
                index === current
                  ? "h-2 w-7 rounded-full bg-white md:h-2.5 md:w-8"
                  : "h-2 w-2 rounded-full bg-white/50 hover:bg-white/70 md:h-2.5 md:w-2.5"
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === current}
            />
          ))}
        </div>

        {/* Slide Counter */}
        <div className="absolute top-4 right-4 z-20 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm md:top-5 md:right-5 md:px-3.5 md:py-1.5 md:text-sm">
          {current + 1}/{slides.length}
        </div>
      </div>
    </div>
  )
}
