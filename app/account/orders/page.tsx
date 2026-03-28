"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LangProvider, useLang, formatEur } from "@/lib/i18n"
import { CartProvider } from "@/components/cart-context"
import { PromoBar } from "@/components/promo-bar"
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
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface Order {
  id: string
  order_number: string
  status: string
  subtotal: number
  shipping_cost: number
  total: number
  shipping_method: string
  parcel_station: string
  created_at: string
}

interface OrderItem {
  id: string
  quantity: number
  price: number
  product: {
    name: string
    image_url: string
  } | null
}

function OrdersContent() {
  const { t } = useLang()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    async function loadOrders() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login')
        return
      }
      
      setUser(user)

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setOrders(data)
      }
      setLoading(false)
    }

    loadOrders()
  }, [router])

  const loadOrderItems = async (order: Order) => {
    setSelectedOrder(order)
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('order_items')
      .select(`
        id,
        quantity,
        price,
        product:products (
          name,
          image_url
        )
      `)
      .eq('order_id', order.id)

    if (!error && data) {
      setOrderItems(data as any)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'processing':
        return <Package className="h-5 w-5 text-blue-500" />
      case 'shipped':
        return <Truck className="h-5 w-5 text-orange-500" />
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Gaida apmaksu'
      case 'paid': return 'Apmaksāts'
      case 'processing': return 'Tiek apstrādāts'
      case 'shipped': return 'Nosūtīts'
      case 'delivered': return 'Piegādāts'
      case 'cancelled': return 'Atcelts'
      default: return status
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('lv-LV', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <>
      <PromoBar />
      <SiteHeader />
      <CartDrawer />

      <main className="min-h-screen bg-background py-8">
        <div className="mx-auto max-w-4xl px-4">
          <Link href="/account" className="mb-6 flex items-center gap-2 text-primary hover:underline">
            <ChevronLeft className="h-4 w-4" />
            Atpakaļ uz profilu
          </Link>

          <h1 className="mb-8 text-3xl font-bold text-foreground">Mani pasūtījumi</h1>

          {orders.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-12 text-center">
              <ShoppingBag className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
              <h2 className="mb-2 text-xl font-semibold text-card-foreground">Nav pasūtījumu</h2>
              <p className="mb-6 text-muted-foreground">
                Jūs vēl neesat veicis nevienu pasūtījumu. Sāciet iepirkties!
              </p>
              <Link href="/">
                <Button>Sākt iepirkties</Button>
              </Link>
            </div>
          ) : selectedOrder ? (
            /* Order Detail View */
            <div className="space-y-6">
              <button 
                onClick={() => setSelectedOrder(null)}
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <ChevronLeft className="h-4 w-4" />
                Atpakaļ uz pasūtījumiem
              </button>

              <div className="rounded-xl border border-border bg-card p-6">
                <div className="mb-6 flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-card-foreground">
                      Pasūtījums #{selectedOrder.order_number}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(selectedOrder.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1">
                    {getStatusIcon(selectedOrder.status)}
                    <span className="text-sm font-medium">{getStatusText(selectedOrder.status)}</span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-6 space-y-4">
                  <h3 className="font-semibold text-card-foreground">Preces</h3>
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 rounded-lg border border-border p-4">
                      <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center">
                        {item.product?.image_url ? (
                          <img 
                            src={item.product.image_url} 
                            alt={item.product?.name || ''} 
                            className="h-full w-full object-cover rounded-md"
                          />
                        ) : (
                          <Package className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-card-foreground">
                          {item.product?.name || 'Prece nav pieejama'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Daudzums: {item.quantity}
                        </p>
                      </div>
                      <span className="font-semibold text-foreground">
                        {formatEur(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Preču summa</span>
                    <span>{formatEur(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Piegāde</span>
                    <span>{formatEur(selectedOrder.shipping_cost)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                    <span>Kopā</span>
                    <span className="text-primary">{formatEur(selectedOrder.total)}</span>
                  </div>
                </div>

                {/* Shipping Info */}
                <div className="mt-6 rounded-lg bg-muted p-4">
                  <h3 className="mb-2 font-semibold text-card-foreground">Piegādes informācija</h3>
                  <p className="text-sm text-muted-foreground">
                    Metode: {selectedOrder.shipping_method}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Adrese: {selectedOrder.parcel_station}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Orders List View */
            <div className="space-y-4">
              {orders.map((order) => (
                <button
                  key={order.id}
                  onClick={() => loadOrderItems(order)}
                  className="w-full rounded-xl border border-border bg-card p-6 text-left transition-colors hover:border-primary/50 hover:bg-muted/50"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(order.status)}
                        <span className="font-bold text-card-foreground">
                          #{order.order_number}
                        </span>
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold text-primary">
                        {formatEur(order.total)}
                      </span>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </>
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
