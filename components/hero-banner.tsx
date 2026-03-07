"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

const slides = [
  {
    image: "/images/banner-skincare.jpg",
    title: "Французская аптечная косметика",
    subtitle: "Проверенные дерматологические бренды для здоровья кожи",
    cta: "Смотреть каталог",
    color: "from-primary/80 to-primary/40",
  },
  {
    image: "/images/banner-derma.jpg",
    title: "Лучшие дерматологические средства",
    subtitle: "Уход за кожей, рекомендованный европейскими аптеками",
    cta: "Все бренды",
    color: "from-foreground/70 to-foreground/30",
  },
]

export function HeroBanner() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  const slide = slides[current]

  return (
    <div className="relative overflow-hidden rounded-xl">
      <div className="relative h-48 sm:h-64 md:h-80 lg:h-96">
        <Image
          src={slide.image}
          alt={slide.title}
          fill
          className="object-cover transition-all duration-700"
          priority
        />
        <div
          className={`absolute inset-0 bg-gradient-to-r ${slide.color}`}
        />
        <div className="absolute inset-0 flex flex-col items-start justify-center px-6 sm:px-10 md:px-16">
          <h2 className="text-balance text-2xl font-bold text-card sm:text-3xl md:text-4xl lg:text-5xl">
            {slide.title}
          </h2>
          <p className="mt-2 max-w-md text-pretty text-sm text-card/90 sm:text-base md:text-lg">
            {slide.subtitle}
          </p>
          <button className="mt-4 rounded-full bg-card px-6 py-2.5 text-sm font-semibold text-foreground shadow-md transition-all hover:bg-card/90 hover:shadow-lg md:text-base">
            {slide.cta}
          </button>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={() =>
          setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
        }
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-card/80 p-2 shadow-md transition-colors hover:bg-card"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5 text-foreground" />
      </button>
      <button
        onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-card/80 p-2 shadow-md transition-colors hover:bg-card"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5 text-foreground" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all ${
              i === current ? "w-6 bg-card" : "w-2 bg-card/50"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
