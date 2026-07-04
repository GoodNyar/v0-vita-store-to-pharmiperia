'use client'

import { useState, useTransition } from 'react'
import { updateProductAction } from '@/app/actions/admin/products'

export function ProductStockForm({
  productId,
  initialStock,
  initialActive,
}: {
  productId: string
  initialStock: number
  initialActive: boolean
}) {
  const [stock, setStock] = useState(String(initialStock))
  const [isActive, setIsActive] = useState(initialActive)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const save = () => {
    const parsedStock = Number.parseInt(stock, 10)
    if (!Number.isInteger(parsedStock) || parsedStock < 0) {
      setError('Stock must be a non-negative integer')
      return
    }

    setError(null)
    startTransition(async () => {
      const result = await updateProductAction(productId, {
        stockQuantity: parsedStock,
        isActive,
      })
      if (!result.success) {
        setError(result.error)
      }
    })
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <input
        type="number"
        min={0}
        aria-label="Stock quantity"
        className="w-20 rounded-md border border-border bg-background px-2 py-1 text-sm"
        value={stock}
        disabled={pending}
        onChange={(event) => setStock(event.target.value)}
      />
      <label className="flex items-center gap-1 text-xs text-muted-foreground">
        <input
          type="checkbox"
          checked={isActive}
          disabled={pending}
          onChange={(event) => setIsActive(event.target.checked)}
        />
        Active
      </label>
      <button
        type="button"
        disabled={pending}
        onClick={save}
        className="rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {pending ? 'Saving…' : 'Save'}
      </button>
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  )
}