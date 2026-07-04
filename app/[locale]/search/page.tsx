import { Suspense } from "react"

export const revalidate = 3600
import { Loader2 } from "lucide-react"
import { SearchPageContent } from "@/components/search-page-content"

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  )
}