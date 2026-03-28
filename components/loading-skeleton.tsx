"use client"

import { cn } from "@/lib/utils"

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted",
        className
      )}
    />
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-lg">
      <Skeleton className="aspect-square w-full rounded-xl" />
      <div className="mt-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-6 w-1/3 mt-4" />
      </div>
      <Skeleton className="mt-4 h-10 w-full rounded-lg" />
    </div>
  )
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function CategoryPageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Skeleton className="h-8 w-48 mb-8" />
      <div className="flex gap-8">
        <div className="hidden lg:block w-64 space-y-4">
          <Skeleton className="h-6 w-24" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
          <Skeleton className="h-6 w-24 mt-6" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="flex-1">
          <ProductGridSkeleton />
        </div>
      </div>
    </div>
  )
}

export function AccountPageSkeleton() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    </div>
  )
}

export function CheckoutSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Skeleton className="h-8 w-48 mb-8" />
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
        <div>
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </div>
    </div>
  )
}
