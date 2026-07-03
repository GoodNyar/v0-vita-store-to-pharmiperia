"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LangProvider, useLang, formatMoney } from "@/lib/i18n"
import { moneyFromDb, multiplyMoney, type Money } from "@/lib/money"
import { CartProvider } from "@/components/cart-context"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CartDrawer } from "@/components/cart-drawer"
import { createClient } from "@/lib/supabase/client"
import {
  ChevronLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  ShoppingBag,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface Order {
  id: string
  order_number: string
  status: string
  subtotal_cents: number
  shipping_cost_cents: number
  tax_cents: number
  total_cents: number
  currency: string
  shipping_method: string
  parcel_station: string
  created_at: string
}

interface OrderItem {
  id: string
  quantity: number
  unit_price_cents: number
  currency: string
  product: {
    name: string
    image_url: string
  } | null
}

function orderMoney(cents: number, currency: string): Money {
  return moneyFromDb(cents, currency as Money["currency"])
}

function normalizeProductRelation(
  product: { name: string; image_url: string } | { name: string; image_url: string }[] | null,
  fallbackName: string
): { name: string; image_url: string } {
  if (!product) {
    return { name: fallbackName, image_url: "/placeholder.svg" }
  }
  if (Array.isArray(product)) {
    return product[0] ?? { name: fallbackName, image_url: "/placeholder.svg" }
  }
  return product
}

function OrdersContent() {
  const { t } = useLang()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadOrders() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      const { data, error } = await supabase
        .from("orders")
        .select(
          "id, order_number, status, subtotal_cents, shipping_cost_cents, tax_cents, total_cents, currency, shipping_method, parcel_station, created_at"
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (!error && data) {
        setOrders(data as Order[])
      }
      setLoading(false)
    }

    loadOrders()
  }, [router])

  const loadOrderItems = async (order: Order) => {
    setSelectedOrder(order)
    const supabase = createClient()

    const { data, error } = await supabase
      .from("order_items")
      .select(
        `
        id,
        quantity,
        unit_price_cents,
        currency,
        product_name,
        product:products (
          name,
          image_url
        )
      `
      )
      .eq("order_id", order.id)

    if (!error && data) {
      setOrderItems(
        data.map((row) => ({
          id: row.id,
          quantity: row.quantity,
          unit_price_cents: row.unit_price_cents,
          currency: row.currency,
          product: normalizeProductRelation(
            row.product as
              | { name: string; image_url: string }
              | { name: string; image_url: string }[]
              | null,
            (row as { product_name?: string }).product_name ?? "Product"
          ),
        }))
      )
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
      case "paid":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "in_progress":
      case "pending":
        return <Truck className="h-5 w-5 text-blue-500" />
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "delivered":
        return t("orderDelivered")
      case "paid":
        return t("orderDelivered")
      case "in_progress":
      case "pending":
        return t("orderInProgress")
      case "cancelled":
        return t("orderCancelled")
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <CartDrawer />

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <Link
            href="/account"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            {t("accountTitle")}
          </Link>

          <h1 className="mb-6 text-2xl font-bold text-foreground">{t("orderHistory")}</h1>

          {orders.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-8 text-center">
              <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">{t("noOrdersText")}</p>
              <Link href="/" className="mt-4 inline-block">
                <Button>{t("continueShopping")}</Button>
              </Link>
            </div>
          ) : selectedOrder ? (
            <div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="mb-4 inline-flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <ChevronLeft className="h-4 w-4" />
                {t("orderHistory")}
              </button>

              <div className="rounded-xl border border-border bg-card p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t("orderNumber")}</p>
                    <p className="text-lg font-bold text-foreground">{selectedOrder.order_number}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedOrder.status)}
                    <span className="font-medium">{getStatusText(selectedOrder.status)}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {orderItems.map((item) => {
                    const unitPrice = orderMoney(item.unit_price_cents, item.currency)
                    const lineTotal = multiplyMoney(unitPrice, item.quantity)
                    return (
                      <div key={item.id} className="flex items-center gap-4 border-b border-border pb-4">
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{item.product?.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} x {formatMoney(unitPrice)}
                          </p>
                        </div>
                        <p className="font-semibold text-foreground">{formatMoney(lineTotal)}</p>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-6 space-y-2 border-t border-border pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t("subtotal")}</span>
                    <span>
                      {formatMoney(
                        orderMoney(selectedOrder.subtotal_cents, selectedOrder.currency)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t("shippingCost")}</span>
                    <span>
                      {formatMoney(
                        orderMoney(selectedOrder.shipping_cost_cents, selectedOrder.currency)
                      )}
                    </span>
                  </div>
                  {selectedOrder.tax_cents > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t("vatAmount")}</span>
                      <span>
                        {formatMoney(
                          orderMoney(selectedOrder.tax_cents, selectedOrder.currency)
                        )}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold">
                    <span>{t("total")}</span>
                    <span className="text-primary">
                      {formatMoney(orderMoney(selectedOrder.total_cents, selectedOrder.currency))}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <button
                  key={order.id}
                  onClick={() => loadOrderItems(order)}
                  className="flex w-full items-center justify-between rounded-xl border border-border bg-card p-4 text-left transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{order.order_number}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-foreground">
                        {formatMoney(orderMoney(order.total_cents, order.currency))}
                      </p>
                      <p className="text-sm text-muted-foreground">{getStatusText(order.status)}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

export default function OrdersPage() {
  return (
    <LangProvider>
      <CartProvider>
        <OrdersContent />
      </CartProvider>
    </LangProvider>
  )
}