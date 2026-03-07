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
    bg: "bg-[#ddeef7]",
    accent: "text-[#1a6ea8]",
  },
  {
    id: 2,
    brand: "Vichy",
    subtitle: "Уход на основе вулканической воды",
    image: "/images/banner-vichy.jpg",
    bg: "bg-[#d6eaf7]",
    accent: "text-[#0b5c9e]",
  },
  {
    id: 3,
    brand: "Biotherm",
    subtitle: "Уход с технологиями чистой воды",
    image: "/images/banner-biotherm.jpg",
    bg: "bg-[#cce8f5]",
    accent: "text-[#0a4f8c]",
  },
  {
    id: 4,
    brand: "Caudalie",
    subtitle: "Натуральная косметика с полифенолами",
    image: "/images/banner-caudalie.jpg",
    bg: "bg-[#dde8f4]",
    accent: "text-[#2a4a8c]",
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
      <div className="relative h-64 w-full sm:h-72 md:h-96 lg:h-[420px]">
        {/* Slide Wrapper */}
        <div
          className={`absolute inset-0 flex transition-opacity duration-500 ${slide.bg}`}
          key={`slide-${current}`}
        >
          {/* Left Section: Text Content — solid bg, always readable */}
          <div className="relative z-10 flex w-[55%] flex-col justify-center px-5 py-6 sm:px-7 md:w-2/5 md:px-10 lg:px-14">
            {/* Brand Name */}
            <h2 className={`text-2xl font-bold sm:text-3xl md:text-4xl lg:text-5xl ${slide.accent}`}>
              {slide.brand}
            </h2>

            {/* Subtitle */}
            <p className="mt-2 max-w-[22ch] text-xs leading-relaxed text-foreground/70 sm:text-sm md:mt-3 md:text-base">
              {slide.subtitle}
            </p>

            {/* CTA Button */}
            <button className="mt-5 w-fit rounded-lg bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground transition-all duration-200 hover:scale-105 hover:bg-primary/90 hover:shadow-lg active:scale-95 sm:text-sm md:mt-6 md:px-7 md:py-2.5 md:text-sm">
              {t("viewCatalog")}
            </button>
          </div>

          {/* Right Section: Product Image (60%) */}
          <div className="relative w-[45%] md:w-3/5">
            <Image
              src={slide.image}
              alt={slide.brand}
              fill
              className="object-cover object-center transition-transform duration-700 hover:scale-105"
              priority={current === 0}
            />
            {/* Left-edge soft fade */}
            <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white/30 to-transparent" />
          </div>
        </div>

        {/* Previous Button */}
        <button
          onClick={goToPrevious}
          className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full p-2 text-foreground/20 transition-all hover:text-foreground/50 md:left-3"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
        </button>

        {/* Next Button */}
        <button
          onClick={goToNext}
          className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full p-2 text-foreground/20 transition-all hover:text-foreground/50 md:right-3"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
        </button>

        {/* Dot Navigation */}
        <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1.5 md:bottom-4 md:gap-2">
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
        <div className="absolute top-3 right-3 z-20 rounded-full bg-black/40 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm md:top-4 md:right-4 md:px-3.5 md:py-1.5 md:text-sm">
          {current + 1}/{slides.length}
        </div>
      </div>
    </div>
  )
}
