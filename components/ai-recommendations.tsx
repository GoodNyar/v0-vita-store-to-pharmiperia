"use client"

import { useState } from "react"
import { Sparkles, ChevronRight, X, Loader2 } from "lucide-react"
import { useLang, formatEur } from "@/lib/i18n"
import { useCart } from "@/components/cart-context"
import { normalizeProductId } from "@/lib/data"
import Image from "next/image"

interface Recommendation {
  productId: string
  reason: string
  matchScore: number
  product: {
    id: string
    name: string
    description: string
    price: number
    rating: number
    image_url?: string
    brand?: { name: string }
    category?: { name: string }
  }
}

const SKIN_TYPES = [
  { id: "normal", label: "Нормальная" },
  { id: "dry", label: "Сухая" },
  { id: "oily", label: "Жирная" },
  { id: "combination", label: "Комбинированная" },
  { id: "sensitive", label: "Чувствительная" },
]

const CONCERNS = [
  { id: "acne", label: "Акне" },
  { id: "aging", label: "Старение" },
  { id: "pigmentation", label: "Пигментация" },
  { id: "dehydration", label: "Обезвоживание" },
  { id: "redness", label: "Покраснения" },
  { id: "pores", label: "Расширенные поры" },
  { id: "dark-circles", label: "Темные круги" },
  { id: "wrinkles", label: "Морщины" },
]

export function AIRecommendations() {
  const { t } = useLang()
  const { addItem } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState<"quiz" | "loading" | "results">("quiz")
  const [skinType, setSkinType] = useState<string | null>(null)
  const [concerns, setConcerns] = useState<string[]>([])
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])

  const toggleConcern = (id: string) => {
    setConcerns(prev => 
      prev.includes(id) 
        ? prev.filter(c => c !== id)
        : [...prev, id]
    )
  }

  const handleGetRecommendations = async () => {
    setStep("loading")
    
    try {
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skinType,
          concerns,
          budget: null,
          currentProducts: []
        })
      })

      const data = await response.json()
      
      if (data.recommendations) {
        setRecommendations(data.recommendations)
        setStep("results")
      } else {
        setStep("quiz")
      }
    } catch (error) {
      console.error("Failed to get recommendations:", error)
      setStep("quiz")
    }
  }

  const handleAddToCart = (product: Recommendation["product"]) => {
    addItem({
      id: normalizeProductId(product.id),
      name: product.name,
      price: product.price,
      image: product.image_url || "/placeholder.jpg",
      quantity: 1,
    })
  }

  const resetQuiz = () => {
    setStep("quiz")
    setSkinType(null)
    setConcerns([])
    setRecommendations([])
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 z-40 flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105"
      >
        <Sparkles className="h-5 w-5" />
        <span className="hidden sm:inline">AI-подбор</span>
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-gradient-to-r from-primary to-accent p-4">
          <div className="flex items-center gap-2 text-white">
            <Sparkles className="h-5 w-5" />
            <h2 className="text-lg font-bold">AI-подбор косметики</h2>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="rounded-full p-1 text-white/80 hover:bg-white/20 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-4">
          {step === "quiz" && (
            <div className="space-y-6">
              {/* Skin Type */}
              <div>
                <h3 className="mb-3 font-semibold text-foreground">Ваш тип кожи</h3>
                <div className="flex flex-wrap gap-2">
                  {SKIN_TYPES.map(type => (
                    <button
                      key={type.id}
                      onClick={() => setSkinType(type.id)}
                      className={`rounded-full px-4 py-2 text-sm transition-all ${
                        skinType === type.id
                          ? "bg-primary text-white"
                          : "bg-secondary text-foreground hover:bg-secondary/80"
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Concerns */}
              <div>
                <h3 className="mb-3 font-semibold text-foreground">Что вас беспокоит? (можно несколько)</h3>
                <div className="flex flex-wrap gap-2">
                  {CONCERNS.map(concern => (
                    <button
                      key={concern.id}
                      onClick={() => toggleConcern(concern.id)}
                      className={`rounded-full px-4 py-2 text-sm transition-all ${
                        concerns.includes(concern.id)
                          ? "bg-accent text-white"
                          : "bg-secondary text-foreground hover:bg-secondary/80"
                      }`}
                    >
                      {concern.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                onClick={handleGetRecommendations}
                disabled={!skinType}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 font-semibold text-white transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Получить рекомендации
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {step === "loading" && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="mt-4 text-center text-muted-foreground">
                AI анализирует ваш профиль кожи...
              </p>
            </div>
          )}

          {step === "results" && (
            <div className="space-y-4">
              <div className="rounded-lg bg-green-50 p-3 text-sm text-green-800">
                Найдено {recommendations.length} идеальных продуктов для вас
              </div>

              {recommendations.map((rec, idx) => (
                <div key={rec.productId} className="rounded-xl border border-border p-4">
                  <div className="flex gap-3">
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-secondary">
                      {rec.product.image_url && (
                        <Image
                          src={rec.product.image_url}
                          alt={rec.product.name}
                          fill
                          className="object-cover"
                        />
                      )}
                      <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                        {idx + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">{rec.product.brand?.name}</p>
                      <h4 className="font-semibold text-foreground">{rec.product.name}</h4>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-sm font-bold text-primary">{formatEur(rec.product.price)}</span>
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                          {rec.matchScore}% совпадение
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{rec.reason}</p>
                  <button
                    onClick={() => handleAddToCart(rec.product)}
                    className="mt-3 w-full rounded-lg bg-primary py-2 text-sm font-semibold text-white hover:bg-primary/90"
                  >
                    Добавить в корзину
                  </button>
                </div>
              ))}

              <button
                onClick={resetQuiz}
                className="w-full rounded-lg border border-border py-2 text-sm font-medium text-foreground hover:bg-secondary"
              >
                Пройти заново
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
