"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Star, ThumbsUp, User } from "lucide-react"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"

interface Review {
  id: string
  rating: number
  title: string
  content: string
  verified_purchase: boolean
  helpful_count: number
  created_at: string
  user_id: string
  profiles?: {
    first_name: string
    last_name: string
  }
}

interface ProductReviewsProps {
  productId: string
  initialRating: number
  initialReviewCount: number
}

export function ProductReviews({ productId, initialRating, initialReviewCount }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: "",
    content: ""
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function loadReviews() {
      const supabase = createClient()
      
      // Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      // Load reviews
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles (first_name, last_name)
        `)
        .eq('product_id', productId)
        .order('created_at', { ascending: false })
        .limit(10)

      if (!error && data) {
        setReviews(data as Review[])
      }
      setLoading(false)
    }

    loadReviews()
  }, [productId])

  const handleSubmitReview = async () => {
    if (!user || !newReview.content.trim()) return
    
    setSubmitting(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('reviews')
      .insert({
        product_id: productId,
        user_id: user.id,
        rating: newReview.rating,
        title: newReview.title.trim() || null,
        content: newReview.content.trim(),
        verified_purchase: false
      })

    if (!error) {
      // Reload reviews
      const { data } = await supabase
        .from('reviews')
        .select(`*, profiles (first_name, last_name)`)
        .eq('product_id', productId)
        .order('created_at', { ascending: false })
        .limit(10)

      if (data) {
        setReviews(data as Review[])
      }
      
      setNewReview({ rating: 5, title: "", content: "" })
      setShowForm(false)
    }
    setSubmitting(false)
  }

  const handleHelpful = async (reviewId: string) => {
    const supabase = createClient()
    await supabase.rpc('increment_helpful', { review_id: reviewId })
    
    setReviews(reviews.map(r => 
      r.id === reviewId ? { ...r, helpful_count: r.helpful_count + 1 } : r
    ))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('lv-LV', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const renderStars = (rating: number, interactive = false, onChange?: (r: number) => void) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => onChange?.(star)}
            className={interactive ? "cursor-pointer" : "cursor-default"}
          >
            <Star
              className={`h-4 w-4 ${
                star <= rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-gray-200 text-gray-200"
              }`}
            />
          </button>
        ))}
      </div>
    )
  }

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => {
    const count = reviews.filter(r => r.rating === rating).length
    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0
    return { rating, count, percentage }
  })

  return (
    <div className="mt-12 border-t border-border pt-8">
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Left: Rating Summary */}
        <div className="lg:w-72 flex-shrink-0">
          <h2 className="mb-4 text-xl font-bold text-foreground">Atsauksmes</h2>
          
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl font-bold text-foreground">{initialRating.toFixed(1)}</span>
            <div>
              {renderStars(Math.round(initialRating))}
              <p className="mt-1 text-sm text-muted-foreground">
                {initialReviewCount.toLocaleString()} atsauksmes
              </p>
            </div>
          </div>

          {/* Rating bars */}
          <div className="space-y-2">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-2 text-sm">
                <span className="w-3">{rating}</span>
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-400 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-8 text-right text-muted-foreground">{count}</span>
              </div>
            ))}
          </div>

          {/* Write review button */}
          {user ? (
            <Button
              onClick={() => setShowForm(!showForm)}
              variant="outline"
              className="mt-6 w-full"
            >
              {showForm ? "Atcelt" : "Rakstīt atsauksmi"}
            </Button>
          ) : (
            <p className="mt-6 text-sm text-muted-foreground">
              <Link href="/auth/login" className="text-primary hover:underline">Piesakieties</Link>, lai rakstītu atsauksmi
            </p>
          )}
        </div>

        {/* Right: Reviews List */}
        <div className="flex-1">
          {/* Review Form */}
          {showForm && (
            <div className="mb-8 rounded-xl border border-border bg-card p-6">
              <h3 className="mb-4 font-semibold text-card-foreground">Jūsu atsauksme</h3>
              
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium">Vērtējums</label>
                <div className="flex gap-1">
                  {renderStars(newReview.rating, true, (r) => setNewReview({ ...newReview, rating: r }))}
                </div>
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium">Virsraksts (neobligāti)</label>
                <input
                  type="text"
                  value={newReview.title}
                  onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                  placeholder="Īss kopsavilkums"
                  className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium">Atsauksme *</label>
                <textarea
                  value={newReview.content}
                  onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                  placeholder="Dalieties ar savu pieredzi..."
                  rows={4}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none resize-none"
                />
              </div>

              <Button 
                onClick={handleSubmitReview}
                disabled={submitting || !newReview.content.trim()}
              >
                {submitting ? "Publicē..." : "Publicēt atsauksmi"}
              </Button>
            </div>
          )}

          {/* Reviews List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : reviews.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">Vēl nav atsauksmju. Esiet pirmais!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-border pb-6 last:border-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {review.profiles?.first_name || "Anonīms"} {review.profiles?.last_name?.charAt(0) || ""}.
                        </p>
                        <div className="flex items-center gap-2">
                          {renderStars(review.rating)}
                          {review.verified_purchase && (
                            <span className="text-xs text-green-600 font-medium">Verificēts pirkums</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">{formatDate(review.created_at)}</span>
                  </div>

                  {review.title && (
                    <h4 className="font-semibold text-foreground mb-1">{review.title}</h4>
                  )}
                  <p className="text-muted-foreground">{review.content}</p>

                  <button
                    onClick={() => handleHelpful(review.id)}
                    className="mt-3 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    Noderīgi ({review.helpful_count})
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
