"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const slides = [
  {
    id: 1,
    brand: "Bioderma",
    subtitle: "Французский аптечный уход для чувствительной кожи",
    cta: "Смотреть каталог",
    image: "/images/banner-bioderma.jpg",
    color: "from-blue-600/80 to-blue-400/40",
  },
  {
    id: 2,
    brand: "Vichy",
    subtitle: "Уход за кожей на основе вулканической воды Vichy",
    cta: "Смотреть каталог",
    image: "/images/banner-vichy.jpg",
    color: "from-teal-600/80 to-teal-400/40",
  },
  {
    id: 3,
    brand: "Biotherm",
    subtitle: "Эффективный уход за кожей с биотехнологиями",
    cta: "Смотреть каталог",
    image: "/images/banner-biotherm.jpg",
    color: "from-cyan-600/80 to-cyan-400/40",
  },
  {
    id: 4,
    brand: "Caudalie",
    subtitle: "Французский уход за кожей на основе виноградных полифенолов",
    cta: "Смотреть каталог",
    image: "/images/banner-caudalie.jpg",
    color: "from-purple-600/80 to-purple-400/40",
  },
]

export function HeroBanner() {
  const [current, setCurrent] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)

  useEffect(() => {
    if (!isAutoPlay) return

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [isAutoPlay])

  const goToSlide = (index: number) => {
    setCurrent(index)
    setIsAutoPlay(false)
    setTimeout(() => setIsAutoPlay(true), 8000)
  }

  const goToPrevious = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
    setIsAutoPlay(false)
    setTimeout(() => setIsAutoPlay(true), 8000)
  }

  const goToNext = () => {
    setCurrent((prev) => (prev + 1) % slides.length)
    setIsAutoPlay(false)
    setTimeout(() => setIsAutoPlay(true), 8000)
  }

  const slide = slides[current]

  return (
    <div className="relative w-full overflow-hidden rounded-xl">
      {/* Slides Container */}
      <div className="relative h-80 w-full sm:h-96 md:h-[450px] lg:h-screen">
        {/* Slide Content - Two Column Layout */}
        <div className="absolute inset-0 flex items-stretch overflow-hidden">
          {/* Left: Text Content */}
          <div className="flex w-full flex-col justify-center px-6 py-8 sm:w-1/2 sm:px-10 md:px-16 lg:px-20">
            <h1 className="text-balance text-3xl font-bold text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
              {slide.brand}
            </h1>
            <p className="mt-3 max-w-md text-balance text-sm text-muted-foreground sm:mt-4 sm:text-base md:text-lg">
              {slide.subtitle}
            </p>
            <button className="mt-6 w-fit rounded-full bg-primary px-8 py-3 font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg sm:mt-8">
              {slide.cta}
            </button>
          </div>

          {/* Right: Image */}
          <div className="hidden w-1/2 sm:block">
            <Image
              src={slide.image}
              alt={slide.brand}
              fill
              className="object-cover object-center transition-all duration-700"
              priority={current === 0}
            />
            {/* Overlay gradient */}
            <div
              className={`absolute inset-0 bg-gradient-to-l ${slide.color}`}
            />
          </div>

          {/* Mobile: Image Below Text */}
          <div className="absolute bottom-0 left-0 right-0 h-1/3 sm:hidden">
            <Image
              src={slide.image}
              alt={slide.brand}
              fill
              className="object-cover object-center"
              priority={current === 0}
            />
            <div
              className={`absolute inset-0 bg-gradient-to-t ${slide.color}`}
            />
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-card/80 p-3 shadow-md transition-all hover:bg-card hover:shadow-lg sm:left-6"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5 text-foreground sm:h-6 sm:w-6" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-card/80 p-3 shadow-md transition-all hover:bg-card hover:shadow-lg sm:right-6"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5 text-foreground sm:h-6 sm:w-6" />
      </button>

      {/* Dot Navigation */}
      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2 sm:bottom-6">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 sm:h-2.5 ${
              index === current
                ? "w-8 bg-card sm:w-10"
                : "w-2 bg-card/50 hover:bg-card/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === current}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute top-4 right-4 z-10 rounded-full bg-card/80 px-3 py-1.5 text-xs font-semibold text-foreground sm:text-sm">
        {current + 1} / {slides.length}
      </div>
    </div>
  )
}
