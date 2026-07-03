"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useCart, CartProvider } from "@/components/cart-context"
import { useLang, formatEur, LangProvider } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { ChevronLeft, MapPin, Truck, AlertCircle, CreditCard, CheckCircle } from "lucide-react"
import { StripeCheckout } from "@/components/stripe-checkout"

const LATVIAN_STATIONS = [
  { id: 1, name: "Rīga - Akropole", address: "Nīcgales str. 21, Rīga" },
  { id: 2, name: "Rīga - Galleria Riga", address: "Ģertrūdes str. 54, Rīga" },
  { id: 3, name: "Daugavpils", address: "Grīvas iela 34, Daugavpils" },
  { id: 4, name: "Liepāja", address: "12. novembra iela 65, Liepāja" },
  { id: 5, name: "Jelgava", address: "Universitātes iela 3, Jelgava" },
  { id: 6, name: "Rīga - Domina Shopping", address: "Ieriķu iela 3, Rīga" },
  { id: 7, name: "Rīga - Alfa", address: "Brīvības gatve 372, Rīga" },
  { id: 8, name: "Ventspils", address: "Kuldīgas iela 8, Ventspils" },
]

const SHIPPING_OPTIONS = [
  { id: "omniva", name: "omnivaParcel", price: 3.50, days: "1-2" },
  { id: "dpd", name: "dpdPickup", price: 3.20, days: "1-2" },
  { id: "venipak", name: "venipakParcel", price: 2.95, days: "2-3" },
  { id: "smartpost", name: "smartpostItella", price: 2.99, days: "2-3" },
  { id: "courier", name: "courierDelivery", price: 5.99, days: "1-2" },
]

type CheckoutStep = "details" | "payment" | "complete"

function CheckoutContent() {
  const { items, totalPrice, clearCart } = useCart()
  const { t } = useLang()
  const router = useRouter()

  const [step, setStep] = useState<CheckoutStep>("details")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  })
  const [selectedShipping, setSelectedShipping] = useState("omniva")
  const [selectedStation, setSelectedStation] = useState("1")
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [preparedOrder, setPreparedOrder] = useState<{
    orderId: string
    orderNumber: string
  } | null>(null)

  const shippingOption = SHIPPING_OPTIONS.find((opt) => opt.id === selectedShipping)
  const shippingCost = shippingOption?.price || 3.5
  const finalTotal = totalPrice + shippingCost
  const isCourier = selectedShipping === "courier"

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}
    if (!formData.firstName.trim()) errors.firstName = "Required"
    if (!formData.lastName.trim()) errors.lastName = "Required"
    if (!formData.email.trim()) errors.email = "Required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Invalid email"
    if (!formData.phone.trim()) errors.phone = "Required"
    
    if (isCourier) {
      if (!formData.address.trim()) errors.address = "Required"
      if (!formData.city.trim()) errors.city = "Required"
      if (!formData.postalCode.trim()) errors.postalCode = "Required"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleProceedToPayment = () => {
    if (validateForm()) {
      setStep("payment")
    }
  }

  const handlePaymentComplete = () => {
    // Payment truth lives in Stripe webhook (ADR-0005). UI only navigates forward.
    setStep("complete")
    clearCart()
  }

  const station = LATVIAN_STATIONS.find((s) => s.id.toString() === selectedStation)
  const checkoutDetails = {
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    phone: formData.phone,
    shippingMethod: selectedShipping,
    shippingCost,
    parcelStation: isCourier
      ? `${formData.address}, ${formData.city}, ${formData.postalCode}`
      : station?.name || "",
    shippingAddress: isCourier
      ? {
          street: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
        }
      : undefined,
  }

  // Empty cart state
  if (items.length === 0 && step !== "complete") {
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

  // Order complete state
  if (step === "complete") {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="mx-auto max-w-2xl px-4">
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="mb-2 text-2xl font-bold text-card-foreground">
              Paldies par pasūtījumu!
            </h1>
            <p className="mb-6 text-muted-foreground">
              Jūsu maksājums ir saņemts. Pasūtījuma apstiprinājumu nosūtīsim uz {formData.email}, kad apmaksa būs apstiprināta serverī.
            </p>
            {preparedOrder?.orderNumber && (
              <p className="mb-6 text-sm text-muted-foreground">
                Pasūtījuma numurs: <span className="font-medium text-card-foreground">{preparedOrder.orderNumber}</span>
              </p>
            )}
            <div className="mb-6 rounded-lg bg-muted p-4 text-left">
              <p className="text-sm text-muted-foreground">Piegādes metode</p>
              <p className="font-medium text-card-foreground">
                {isCourier 
                  ? `Kurjers: ${formData.address}, ${formData.city}`
                  : `${shippingOption?.name}: ${LATVIAN_STATIONS.find(s => s.id.toString() === selectedStation)?.name}`
                }
              </p>
              <p className="mt-2 text-sm text-muted-foreground">Paredzamā piegāde: {shippingOption?.days} darba dienas</p>
            </div>
            <div className="flex gap-4">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full">{t("continueShopping")}</Button>
              </Link>
              <Link href="/account/orders" className="flex-1">
                <Button className="w-full">Mani pasūtījumi</Button>
              </Link>
            </div>
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

        {/* Progress steps */}
        <div className="mb-8 flex items-center justify-center gap-4">
          <div className={`flex items-center gap-2 ${step === "details" ? "text-primary" : "text-muted-foreground"}`}>
            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${step === "details" ? "bg-primary text-white" : "bg-muted"}`}>
              1
            </div>
            <span className="hidden sm:inline">{t("checkoutSteps1")}</span>
          </div>
          <div className="h-px w-8 bg-border" />
          <div className={`flex items-center gap-2 ${step === "payment" ? "text-primary" : "text-muted-foreground"}`}>
            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${step === "payment" ? "bg-primary text-white" : "bg-muted"}`}>
              2
            </div>
            <span className="hidden sm:inline">{t("checkoutSteps2")}</span>
          </div>
        </div>

        <h1 className="mb-8 text-3xl font-bold text-foreground">
          {step === "details" ? t("checkoutTitle") : t("checkoutSteps2")}
        </h1>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left column: Form or Payment */}
          <div className="lg:col-span-2 space-y-6">
            {step === "details" ? (
              <>
                {/* Contact Information */}
                <section className="rounded-xl border border-border bg-card p-6">
                  <h2 className="mb-4 text-lg font-semibold text-card-foreground">{t("contactInfo")}</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-foreground">
                        {t("firstName")} *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="Jānis"
                        className={`w-full rounded-lg border ${formErrors.firstName ? "border-red-500" : "border-border"} bg-background px-4 py-2.5 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20`}
                      />
                      {formErrors.firstName && <p className="mt-1 text-xs text-red-500">{formErrors.firstName}</p>}
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-foreground">
                        {t("lastName")} *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Bērziņš"
                        className={`w-full rounded-lg border ${formErrors.lastName ? "border-red-500" : "border-border"} bg-background px-4 py-2.5 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20`}
                      />
                      {formErrors.lastName && <p className="mt-1 text-xs text-red-500">{formErrors.lastName}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-foreground">
                        {t("email")} *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="janis@example.com"
                        className={`w-full rounded-lg border ${formErrors.email ? "border-red-500" : "border-border"} bg-background px-4 py-2.5 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20`}
                      />
                      {formErrors.email && <p className="mt-1 text-xs text-red-500">{formErrors.email}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-foreground">
                        {t("phone")} *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+371 20 123 456"
                        className={`w-full rounded-lg border ${formErrors.phone ? "border-red-500" : "border-border"} bg-background px-4 py-2.5 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20`}
                      />
                      {formErrors.phone && <p className="mt-1 text-xs text-red-500">{formErrors.phone}</p>}
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
                        className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
                          selectedShipping === option.id 
                            ? "border-primary bg-primary/5" 
                            : "border-border hover:bg-muted"
                        }`}
                      >
                        <input
                          type="radio"
                          name="shipping"
                          value={option.id}
                          checked={selectedShipping === option.id}
                          onChange={() => setSelectedShipping(option.id)}
                          className="h-4 w-4 text-primary"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-card-foreground">
                            {option.id === "courier" ? "Kurjera piegāde" : t(option.name as any)}
                          </p>
                          <p className="text-sm text-muted-foreground">Piegāde {option.days} darba dienas</p>
                        </div>
                        <span className="font-semibold text-primary">{formatEur(option.price)}</span>
                      </label>
                    ))}
                  </div>
                </section>

                {/* Station Selection or Address */}
                {isCourier ? (
                <section className="rounded-xl border border-border bg-card p-6">
                  <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-card-foreground">
                    <MapPin className="h-5 w-5" />
                    {t("deliveryAddress")}
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-foreground">{t("addressLabel")} *</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder={t("addressPlaceholder")}
                        className={`w-full rounded-lg border ${formErrors.address ? "border-red-500" : "border-border"} bg-background px-4 py-2.5 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20`}
                      />
                      {formErrors.address && <p className="mt-1 text-xs text-red-500">{formErrors.address}</p>}
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-foreground">{t("cityLabel")} *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder={t("cityPlaceholder")}
                        className={`w-full rounded-lg border ${formErrors.city ? "border-red-500" : "border-border"} bg-background px-4 py-2.5 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20`}
                      />
                      {formErrors.city && <p className="mt-1 text-xs text-red-500">{formErrors.city}</p>}
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-foreground">{t("postalCodeLabel")} *</label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        placeholder={t("postalCodePlaceholder")}
                        className={`w-full rounded-lg border ${formErrors.postalCode ? "border-red-500" : "border-border"} bg-background px-4 py-2.5 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20`}
                      />
                      {formErrors.postalCode && <p className="mt-1 text-xs text-red-500">{formErrors.postalCode}</p>}
                    </div>
                  </div>
                </section>
                ) : (
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
                )}
              </>
            ) : (
              /* Payment Step - Stripe Embedded Checkout */
              <section className="rounded-xl border border-border bg-card p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-card-foreground">
                    <CreditCard className="h-5 w-5" />
                    {t("securePayment")}
                  </h2>
                  <button 
                    onClick={() => setStep("details")}
                    className="text-sm text-primary hover:underline"
                  >
                    {t("editInformation")}
                  </button>
                </div>
                <StripeCheckout
                  items={items.map((item) => ({
                    id: item.product.id,
                    quantity: item.quantity,
                  }))}
                  checkoutDetails={checkoutDetails}
                  onCheckoutPrepared={setPreparedOrder}
                  onComplete={handlePaymentComplete}
                />
              </section>
            )}
          </div>

          {/* Right column: Order Summary */}
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

            {/* Proceed button (only on details step) */}
            {step === "details" && (
              <Button
                onClick={handleProceedToPayment}
                className="mt-6 w-full bg-primary text-primary-foreground hover:bg-primary/90"
                size="lg"
              >
                Turpināt uz apmaksu
              </Button>
            )}

            {/* Trust badges */}
            <div className="mt-6 space-y-2 text-center text-xs text-muted-foreground">
              <p className="flex items-center justify-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                100% oriģinālā franču kosmētika
              </p>
              <p className="flex items-center justify-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                Droša maksāšana un 14 dienu atgriešana
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <LangProvider>
      <CartProvider>
        <CheckoutContent />
      </CartProvider>
    </LangProvider>
  )
}
