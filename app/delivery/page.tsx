"use client"

import { useState } from "react"
import Link from "next/link"
import { CartProvider } from "@/components/cart-context"
import { LangProvider } from "@/lib/i18n"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PromoBar } from "@/components/promo-bar"
import { CartDrawer } from "@/components/cart-drawer"
import {
  Truck,
  Package,
  Clock,
  ChevronLeft,
  ShieldCheck,
  RotateCcw,
  MapPin,
  ChevronDown,
  Home,
} from "lucide-react"

const PARCEL_STATIONS: Record<string, { name: string; address: string }[]> = {
  "Omniva pakomāts": [
    { name: "Rīga — Akropole", address: "Nīcgales iela 21, Rīga" },
    { name: "Rīga — Galleria Riga", address: "Ģertrūdes iela 54, Rīga" },
    { name: "Rīga — Alfa", address: "Brīvības gatve 372, Rīga" },
    { name: "Rīga — Olimpia", address: "Ieriku iela 3, Rīga" },
    { name: "Rīga — Spice", address: "Lielirbes iela 29, Rīga" },
    { name: "Jūrmala — Lielupe", address: "Bulduri, Jūrmala" },
    { name: "Daugavpils", address: "Grīvas iela 34, Daugavpils" },
    { name: "Liepāja", address: "12. novembra iela 65, Liepāja" },
    { name: "Jelgava", address: "Universitātes iela 3, Jelgava" },
    { name: "Ventspils", address: "Talsu iela 19, Ventspils" },
    { name: "Rēzekne", address: "Atbrīvošanas aleja 93, Rēzekne" },
  ],
  "DPD Pickup punkts": [
    { name: "Rīga — Imanta", address: "Imanta 7. līnija 1, Rīga" },
    { name: "Rīga — Purvciems", address: "Deglava iela 54, Rīga" },
    { name: "Rīga — Centrs", address: "Čaka iela 96, Rīga" },
    { name: "Rīga — Pārdaugava", address: "Āgenskalna iela 5, Rīga" },
    { name: "Ogre", address: "Brīvības iela 15, Ogre" },
    { name: "Valmiera", address: "Rīgas iela 12, Valmiera" },
    { name: "Cēsis", address: "Raunas iela 8, Cēsis" },
    { name: "Sigulda", address: "Pils iela 4, Sigulda" },
  ],
  "Venipak pakomāts": [
    { name: "Rīga — Mols", address: "Krasta iela 46, Rīga" },
    { name: "Rīga — Stockmann", address: "13. janvāra iela 8, Rīga" },
    { name: "Rīga — Elkor Plaza", address: "Kr. Valdemāra iela 149, Rīga" },
    { name: "Rīga — Ziepniekkalns", address: "Zemgales iela 5, Rīga" },
    { name: "Riga — Bieriņi", address: "Bieriņu iela 18, Rīga" },
    { name: "Jēkabpils", address: "Brīvības iela 182, Jēkabpils" },
    { name: "Tukums", address: "Harmonijas iela 5, Tukums" },
  ],
  "Smartpost Itella": [
    { name: "Rīga — Domina Shopping", address: "Ieriķu iela 3, Rīga" },
    { name: "Rīga — Origo", address: "Stacijas laukums 2, Rīga" },
    { name: "Rīga — Sāga", address: "Maskavas iela 257, Rīga" },
    { name: "Salaspils", address: "Līvzemes iela 8, Salaspils" },
    { name: "Ādaži", address: "Gaujas iela 1, Ādaži" },
    { name: "Mārupe", address: "Tirgus iela 8, Mārupe" },
  ],
}

const SHIPPING_METHODS = [
  {
    id: "omniva",
    carrier: "Omniva pakomāts",
    price: "3,50 €",
    time: "1–2 рабочих дня",
    desc: "Более 200 постаматов по всей Латвии. Доступны 24/7.",
    icon: Package,
    hasParcels: true,
  },
  {
    id: "dpd",
    carrier: "DPD Pickup punkts",
    price: "3,20 €",
    time: "1–2 рабочих дня",
    desc: "Пункты выдачи DPD в магазинах-партнёрах по всей Латвии.",
    icon: Package,
    hasParcels: true,
  },
  {
    id: "venipak",
    carrier: "Venipak pakomāts",
    price: "2,95 €",
    time: "1–2 рабочих дня",
    desc: "Постаматы Venipak с удобным расположением в торговых центрах.",
    icon: Package,
    hasParcels: true,
  },
  {
    id: "smartpost",
    carrier: "Smartpost Itella",
    price: "2,99 €",
    time: "2–3 рабочих дня",
    desc: "Надёжная служба доставки в постаматы по всей Латвии.",
    icon: Package,
    hasParcels: true,
  },
  {
    id: "courier",
    carrier: "Курьерская доставка",
    price: "5,99 €",
    time: "1–2 рабочих дня",
    desc: "Курьер доставит заказ прямо к вашей двери в удобное для вас время.",
    icon: Home,
    hasParcels: false,
  },
]

function DeliveryContent() {
  const [openStation, setOpenStation] = useState<string | null>(null)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PromoBar />
      <SiteHeader />
      <CartDrawer />

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-10">
          {/* Back link */}
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ChevronLeft className="h-4 w-4" />
            Назад на главную
          </Link>

          {/* Title */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-foreground">Условия доставки</h1>
            <p className="mt-2 text-muted-foreground">
              Доставляем оригинальную французскую косметику по всей Латвии быстро и надёжно.
            </p>
          </div>

          {/* Free shipping banner */}
          <div className="mb-10 flex items-center gap-4 rounded-xl border border-primary/20 bg-primary/10 px-6 py-5">
            <Truck className="h-8 w-8 flex-shrink-0 text-primary" />
            <div>
              <p className="font-semibold text-foreground">Бесплатная доставка при заказе от 40 €</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Добавьте товары на сумму от 40 € и доставка будет бесплатной — автоматически.
              </p>
            </div>
          </div>

          {/* Shipping methods */}
          <section className="mb-10">
            <h2 className="mb-5 flex items-center gap-2 text-xl font-semibold text-foreground">
              <Package className="h-5 w-5 text-primary" />
              Способы доставки
            </h2>

            <div className="space-y-3">
              {SHIPPING_METHODS.map((method) => {
                const Icon = method.icon
                const isOpen = openStation === method.carrier
                const stations = PARCEL_STATIONS[method.carrier]

                return (
                  <div
                    key={method.id}
                    className="overflow-hidden rounded-xl border border-border bg-card"
                  >
                    {/* Method row */}
                    <div className="flex items-start gap-4 px-5 py-4 sm:items-center">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground">{method.carrier}</p>
                        <p className="mt-0.5 text-sm text-muted-foreground">{method.desc}</p>
                        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          {method.time}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <span className="text-lg font-bold text-primary">{method.price}</span>
                        {method.hasParcels && stations && (
                          <button
                            onClick={() => setOpenStation(isOpen ? null : method.carrier)}
                            className="flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                          >
                            <MapPin className="h-3 w-3" />
                            Постаматы
                            <ChevronDown
                              className={`h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
                            />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Parcel stations dropdown */}
                    {method.hasParcels && isOpen && stations && (
                      <div className="border-t border-border bg-background px-5 py-4">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Доступные постаматы
                        </p>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {stations.map((station, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-2 rounded-lg bg-card p-3 border border-border"
                            >
                              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                              <div>
                                <p className="text-sm font-medium text-foreground">{station.name}</p>
                                <p className="text-xs text-muted-foreground">{station.address}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Courier note */}
                    {method.id === "courier" && (
                      <div className="border-t border-border bg-background px-5 py-4">
                        <p className="text-sm text-muted-foreground">
                          После оформления заказа наш оператор свяжется с вами для уточнения удобного времени доставки.
                          Доставка осуществляется в рабочие дни с <strong>9:00 до 20:00</strong>.
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>

          {/* How it works */}
          <section className="mb-10">
            <h2 className="mb-5 text-xl font-semibold text-foreground">Как это работает</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { step: "1", title: "Оформите заказ", desc: "Выберите товары, укажите контактные данные и метод доставки." },
                { step: "2", title: "Мы упакуем заказ", desc: "Все заказы комплектуются и отправляются в течение 1 рабочего дня." },
                { step: "3", title: "Получите заказ", desc: "Получите SMS с кодом для постамата или встретьте курьера дома." },
              ].map(({ step, title, desc }) => (
                <div key={step} className="rounded-xl border border-border bg-card p-5">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-base font-bold text-primary-foreground">
                    {step}
                  </div>
                  <p className="font-semibold text-foreground">{title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Returns & guarantee — anchor targets */}
          <section id="guarantee" className="mb-4 scroll-mt-20">
            <div className="rounded-xl border border-border bg-card p-5 flex gap-4">
              <ShieldCheck className="h-6 w-6 flex-shrink-0 text-primary mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">100% оригинальный товар</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Мы работаем напрямую с официальными дистрибьюторами. Каждый товар имеет сертификат подлинности и соответствует всем европейским стандартам качества.
                </p>
              </div>
            </div>
          </section>

          <section id="returns" className="mb-10 scroll-mt-20">
            <div className="rounded-xl border border-border bg-card p-5 flex gap-4">
              <RotateCcw className="h-6 w-6 flex-shrink-0 text-primary mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">14 дней на возврат</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Если товар вам не подошёл — свяжитесь с нами в течение 14 дней после получения. Мы вернём деньги в течение 3 рабочих дней после получения возврата.
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <div className="rounded-xl bg-primary px-6 py-6 text-center text-primary-foreground">
            <p className="text-lg font-semibold">Готовы сделать заказ?</p>
            <p className="mt-1 text-sm text-primary-foreground/80">
              Перейдите в каталог и выберите лучшую французскую косметику для вашей кожи.
            </p>
            <Link
              href="/"
              className="mt-4 inline-block rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-white/90"
            >
              Перейти в каталог
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

export default function DeliveryPage() {
  return (
    <LangProvider>
      <CartProvider>
        <DeliveryContent />
      </CartProvider>
    </LangProvider>
  )
}
