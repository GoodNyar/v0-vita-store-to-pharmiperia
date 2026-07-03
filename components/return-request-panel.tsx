"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { submitReturnRequest } from "@/app/actions/returns"
import { RETURN_REASONS, type ReturnReason, type ReturnRequest } from "@/lib/commerce/returns"
import { useLang } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { RotateCcw, CheckCircle2, Clock, XCircle } from "lucide-react"

const REASON_KEYS: Record<ReturnReason, string> = {
  damaged: "returnReasonDamaged",
  wrong_item: "returnReasonWrongItem",
  not_as_described: "returnReasonNotAsDescribed",
  changed_mind: "returnReasonChangedMind",
  other: "returnReasonOther",
}

const STATUS_KEYS: Record<ReturnRequest["status"], string> = {
  pending: "returnStatusPending",
  approved: "returnStatusApproved",
  rejected: "returnStatusRejected",
  refunded: "returnStatusRefunded",
}

function StatusIcon({ status }: { status: ReturnRequest["status"] }) {
  switch (status) {
    case "approved":
    case "refunded":
      return <CheckCircle2 className="h-5 w-5 text-green-500" />
    case "rejected":
      return <XCircle className="h-5 w-5 text-destructive" />
    default:
      return <Clock className="h-5 w-5 text-primary" />
  }
}

export function ReturnRequestPanel({
  initialRequests,
  eligibleOrders,
}: {
  initialRequests: ReturnRequest[]
  eligibleOrders: { id: string; orderNumber: string; createdAt: string }[]
}) {
  const { t } = useLang()
  const router = useRouter()
  const [requests, setRequests] = useState(initialRequests)
  const [orderId, setOrderId] = useState(eligibleOrders[0]?.id ?? "")
  const [reason, setReason] = useState<ReturnReason>("changed_mind")
  const [description, setDescription] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)
    setSuccess(false)

    if (!orderId) {
      setError(t("returnFormNoOrders"))
      return
    }

    startTransition(async () => {
      const result = await submitReturnRequest({ orderId, reason, description })
      if (!result.ok) {
        setError(result.message ?? t("returnFormError"))
        return
      }
      setRequests((prev) => [result.data, ...prev])
      setSuccess(true)
      setDescription("")
      router.refresh()
    })
  }

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <RotateCcw className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">{t("returnFormTitle")}</h2>
            <p className="text-sm text-muted-foreground">{t("returnFormSubtitle")}</p>
          </div>
        </div>

        {eligibleOrders.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("returnFormNoOrders")}</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="return-order" className="mb-1 block text-sm font-medium text-foreground">
                {t("returnFormOrderLabel")}
              </label>
              <select
                id="return-order"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              >
                {eligibleOrders.map((order) => (
                  <option key={order.id} value={order.id}>
                    {order.orderNumber} — {new Date(order.createdAt).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="return-reason" className="mb-1 block text-sm font-medium text-foreground">
                {t("returnFormReasonLabel")}
              </label>
              <select
                id="return-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value as ReturnReason)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              >
                {RETURN_REASONS.map((value) => (
                  <option key={value} value={value}>
                    {t(REASON_KEYS[value])}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="return-description" className="mb-1 block text-sm font-medium text-foreground">
                {t("returnFormDescriptionLabel")}
              </label>
              <textarea
                id="return-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                placeholder={t("returnFormDescriptionPlaceholder")}
              />
            </div>

            <p className="text-xs text-muted-foreground">{t("returnFormManualNote")}</p>

            {error && <p className="text-sm text-destructive">{error}</p>}
            {success && <p className="text-sm text-green-600">{t("returnFormSuccess")}</p>}

            <Button type="submit" disabled={isPending}>
              {isPending ? t("returnFormSubmitting") : t("returnFormSubmit")}
            </Button>
          </form>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground">{t("returnListTitle")}</h2>
        {requests.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("returnListEmpty")}</p>
        ) : (
          <div className="space-y-3">
            {requests.map((request) => (
              <div
                key={request.id}
                className="flex items-start justify-between gap-4 rounded-xl border border-border bg-card p-4"
              >
                <div>
                  <p className="font-semibold text-foreground">{request.orderNumber}</p>
                  <p className="text-sm text-muted-foreground">
                    {t(REASON_KEYS[request.reason])} · {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                  {request.description && (
                    <p className="mt-2 text-sm text-muted-foreground">{request.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <StatusIcon status={request.status} />
                  {t(STATUS_KEYS[request.status])}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}