"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useCart } from "@/components/cart-context"
import { useLang, formatEur } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { ChevronLeft, MapPin, Truck, AlertCircle } from "lucide-react"

const LATVIAN_STATIONS = [
  { id: 1, name: "Rīga - Akropole", address: "Nīcgales str. 21, Rīga" },
  { id: 2, name: "Rīga - Galleria Riga", address: "Ģertrūdes str. 54, Rīga" },
  { id: 3, name: "Daugavpils", address: "Grīvas iela 34, Daugavpils" },
  { id: 4, name: "Liepāja", address: "12. novembra iela 65, Liepāja" },
  { id: 5, name: "Jelgava", address: "Universitātes iela 3, Jelgava" },
]

const SHIPPING_OPTIONS = [
  { id: "omniva", name: "omnivaParcel", price: 3.50 },
  { id: "dpd", name: "dpdPickup", price: 3.20 },
  { id: "venipak", name: "venipakParcel", price: 2.95 },
  { id: "smartpost", name: "smartpostItella", price: 2.99 },
]

export default function CheckoutPage() {
  const { items, totalPrice } = useCart()
  const { t } = useLang()

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  })

  const [selectedShipping, setSelectedShipping] = useState("omniva")
  const [selectedStation, setSelectedStation] = useState("1")

  const shippingCost =
    SHIPPING_OPTIONS.find((opt) => opt.id === selectedShipping)?.price || 3.5
  const finalTotal = totalPrice + shippingCost

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmitOrder = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      alert(t("firstName") + " " + t("lastName") + " " + t("email") + " " + t("phone") + " are required")
      return
    }
    console.log("Order placed:", {
      ...formData,
      items,
      shipping: selectedShipping,
      station: selectedStation,
      total: finalTotal,
    })
    alert("Pasūtījums veiksmīgi iesniegts! Paldies jūsu pirkumam.")
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="mx-auto max-w-6xl px-4">
          <Link href="/" className="mb-6 flex items-center gap-2 text-primary hover:underline">
            <ChevronLeft className="h-4 w-4" />
            {t("backToProducts")}
          </Link>
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h2 className="mb-2 text-lg font-semibold text-card-foreground">Grozs ir tukšs</h2>
            <p className="mb-4 text-muted-foreground">Pirms turpināt, pievienojiet preces grozam.</p>
            <Link href="/">
              <Button>{t("continueShopping")}</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="mx-auto max-w-6xl px-4">
        <Link href="/" className="mb-6 flex items-center gap-2 text-primary hover:underline">
          <ChevronLeft className="h-4 w-4" />
          {t("backToProducts")}
        </Link>

        <h1 className="mb-8 text-3xl font-bold text-foreground">{t("checkoutTitle")}</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left column: Form (2/3 width on desktop) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contact Information */}
            <section className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold text-card-foreground">{t("contactInfo")}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    {t("firstName")}
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Jānis"
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    {t("lastName")}
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Bērziņš"
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    {t("email")}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="janis@example.com"
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    {t("phone")}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+371 20 123 456"
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </section>

            {/* Shipping Method */}
            <section className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-card-foreground">
                <Truck className="h-5 w-5" />
                {t("shippingMethod")}
              </h2>
              <div className="space-y-3">
                {SHIPPING_OPTIONS.map((option) => (
                  <label
                    key={option.id}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-4 hover:bg-muted"
                  >
                    <input
                      type="radio"
                      name="shipping"
                      value={option.id}
                      checked={selectedShipping === option.id}
                      onChange={() => setSelectedShipping(option.id)}
                      className="h-4 w-4"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-card-foreground">{t(option.name as any)}</p>
                      <p className="text-sm text-muted-foreground">Piegāde 1-2 darba dienas</p>
                    </div>
                    <span className="font-semibold text-primary">{formatEur(option.price)}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* Station Selection */}
            <section className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-card-foreground">
                <MapPin className="h-5 w-5" />
                {t("selectStation")}
              </h2>
              <select
                value={selectedStation}
                onChange={(e) => setSelectedStation(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {LATVIAN_STATIONS.map((station) => (
                  <option key={station.id} value={station.id}>
                    {station.name} — {station.address}
                  </option>
                ))}
              </select>
            </section>
          </div>

          {/* Right column: Order Summary (1/3 width on desktop) */}
          <div className="rounded-xl border border-border bg-card p-6 h-fit lg:sticky lg:top-8">
            <h2 className="mb-6 text-lg font-semibold text-card-foreground">{t("orderSummary")}</h2>

            {/* Cart Items */}
            <div className="mb-6 space-y-3">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-start gap-3 pb-3 border-b border-border last:border-0">
                  <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="line-clamp-1 text-sm font-medium text-card-foreground">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.quantity}x {formatEur(item.product.price)}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {formatEur(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Summary lines */}
            <div className="space-y-2 border-t border-border pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Preču summa</span>
                <span className="text-foreground">{formatEur(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("shippingCost")}</span>
                <span className="text-foreground">{formatEur(shippingCost)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-3 text-lg font-bold">
                <span className="text-card-foreground">{t("total")}</span>
                <span className="text-primary">{formatEur(finalTotal)}</span>
              </div>
            </div>

            {/* Order button */}
            <Button
              onClick={handleSubmitOrder}
              className="mt-6 w-full bg-primary text-primary-foreground hover:bg-primary/90"
              size="lg"
            >
              {t("placeOrder")}
            </Button>

            {/* Trust badges */}
            <div className="mt-6 space-y-2 text-center text-xs text-muted-foreground">
              <p className="flex items-center justify-center gap-1">
                ✓ 100% orijinālā franču kosmētika
              </p>
              <p className="flex items-center justify-center gap-1">
                ✓ Droša maksāšana un 14 dienu atgriešana
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
