"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useLang } from "@/lib/i18n"

const slides = [
  {
    id: 1,
    brand: "Bioderma",
    subtitle: "Чувствительная кожа",
    image: "/images/banner-bioderma.jpg",
    gradient: "from-blue-600/70 via-blue-500/50 to-transparent",
  },
  {
    id: 2,
    brand: "Vichy",
    subtitle: "Вулканическая вода",
    image: "/images/banner-vichy.jpg",
    gradient: "from-teal-600/70 via-teal-500/50 to-transparent",
  },
  {
    id: 3,
    brand: "Biotherm",
    subtitle: "Биотехнология воды",
    image: "/images/banner-biotherm.jpg",
    gradient: "from-cyan-600/70 via-cyan-500/50 to-transparent",
  },
  {
    id: 4,
    brand: "Caudalie",
    subtitle: "Виноградные полифенолы",
    image: "/images/banner-caudalie.jpg",
    gradient: "from-purple-600/70 via-purple-500/50 to-transparent",
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
      <div className="relative h-80 w-full md:h-96 lg:h-[420px]">
        {/* Slide Wrapper */}
        <div
          className="absolute inset-0 flex transition-opacity duration-500"
          key={`slide-${current}`}
        >
          {/* Left Section: Text Content (40%) */}
          <div className="flex w-full flex-col justify-center px-4 py-6 sm:px-6 md:w-2/5 md:px-8 lg:px-12">
            {/* Brand Name */}
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl md:text-4xl lg:text-5xl">
              {slide.brand}
            </h2>

            {/* Subtitle */}
            <p className="mt-2 text-sm text-muted-foreground sm:text-base md:text-base">
              {slide.subtitle}
            </p>

            {/* CTA Button */}
            <button className="mt-6 w-fit rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:scale-105 hover:bg-primary/90 hover:shadow-lg active:scale-95 md:px-8 md:py-3 md:text-base">
              {t("viewCatalog")}
            </button>
          </div>

          {/* Right Section: Product Image (60%) - Desktop Only */}
          <div className="hidden w-3/5 md:block">
            <div className="relative h-full w-full">
              <Image
                src={slide.image}
                alt={slide.brand}
                fill
                className="object-cover object-center transition-transform duration-700 hover:scale-105"
                priority={current === 0}
              />
              {/* Soft Gradient Overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`}
              />
            </div>
          </div>

          {/* Mobile: Image Background */}
          <div className="absolute inset-0 md:hidden">
            <Image
              src={slide.image}
              alt={slide.brand}
              fill
              className="object-cover object-center"
              priority={current === 0}
            />
            {/* Mobile Gradient Overlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-t ${slide.gradient}`}
            />
          </div>
        </div>

        {/* Previous Button */}
        <button
          onClick={goToPrevious}
          className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-all hover:bg-white/40 md:left-4 md:p-3"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
        </button>

        {/* Next Button */}
        <button
          onClick={goToNext}
          className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-all hover:bg-white/40 md:right-4 md:p-3"
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
