"use client"

import { useState } from "react"
import Link from "next/link"
import { CartProvider } from "@/components/cart-context"
import { LangProvider } from "@/lib/i18n"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Truck, Package, Clock, ChevronLeft, ShieldCheck, RotateCcw, ChevronDown, MapPin, Home } from "lucide-react"

const PARCEL_STATIONS = {
  omniva: [
    "Rīga, TC Akropole, Maskavas iela 257",
    "Rīga, TC Domina, Ieriķu iela 3",
    "Rīga, TC Alfa, Brīvības gatve 372",
    "Rīga, TC Spice, Lielirbes iela 29",
    "Rīga, Maxima XXX, Vienības gatve 113",
    "Daugavpils, TC Ditton, 18. novembra iela 37",
    "Liepāja, TC Ostmala, Zemnieku iela 16a",
    "Jelgava, TC Pilsētas Pasāža, Lielajā iela 14",
    "Ventspils, TC Tobago, Lielais prospekts 16",
    "Jūrmala, TC Jūrmala, Jomas iela 46",
  ],
  dpd: [
    "Rīga, Narvesen, Elizabetes iela 55",
    "Rīga, Circle K, Brīvības iela 146",
    "Rīga, Rimi, Āzenes iela 5",
    "Daugavpils, Rimi, Cietokšņa iela 60",
    "Liepāja, Maxima, Kuršu iela 14",
    "Valmiera, Rimi, Rīgas iela 64",
    "Rēzekne, TC Rēzekne, Atbrīvošanas aleja 98",
  ],
  venipak: [
    "Rīga, TC Galerija Centrs, Audēju iela 16",
    "Rīga, TC Origo, Stacijas laukums 2",
    "Rīga, Rimi Hypermarket, Kurzemes prospekts 23",
    "Rīga, TC Mols, Krasta iela 46",
    "Ogre, TC Ogre, Brīvības iela 14",
    "Cēsis, Maxima, Rīgas iela 4",
  ],
  smartpost: [
    "Rīga, TC Riga Plaza, Mūkusalas iela 71",
    "Rīga, TC Sky&More, Duntes iela 19a",
    "Rīga, Maxima XX, Maskavas iela 357",
    "Jēkabpils, TC Krustpils, Rīgas iela 210a",
    "Tukums, Rimi, Pasta iela 2",
  ],
}

const SHIPPING_METHODS = [
  {
    id: "omniva",
    carrier: "Omniva pakomāts",
    price: "3,50 €",
    time: "1–2 рабочих дня",
    desc: "Более 200 постаматов по всей Латвии. Удобно забрать в любое время суток.",
  },
  {
    id: "dpd",
    carrier: "DPD Pickup punkts",
    price: "3,20 €",
    time: "1–2 рабочих дня",
    desc: "Пункты выдачи DPD в магазинах-партнёрах по всей Латвии.",
  },
  {
    id: "venipak",
    carrier: "Venipak pakomāts",
    price: "2,95 €",
    time: "1–2 рабочих дня",
    desc: "Современные постаматы Venipak с удобным графиком работы.",
  },
  {
    id: "smartpost",
    carrier: "Smartpost Itella",
    price: "2,99 €",
    time: "2–3 рабочих дня",
    desc: "Надёжная служба доставки в постаматы Smartpost по всей Латвии.",
  },
]

function DeliveryContent() {
  const [expandedCarrier, setExpandedCarrier] = useState<string | null>(null)

  const toggleCarrier = (id: string) => {
    setExpandedCarrier(expandedCarrier === id ? null : id)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-10">
          {/* Back link */}
          <Link
            href="/"
            className="mb-8 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ChevronLeft className="h-4 w-4" />
            Назад на главную
          </Link>

          {/* Page title */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-foreground">Условия доставки</h1>
            <p className="mt-2 text-muted-foreground">
              Доставляем оригинальную французскую косметику по всей Латвии быстро и надёжно.
            </p>
          </div>

          {/* Free shipping banner */}
          <div className="mb-10 rounded-xl bg-primary/10 border border-primary/20 px-6 py-5 flex items-center gap-4">
            <Truck className="h-8 w-8 flex-shrink-0 text-primary" />
            <div>
              <p className="font-semibold text-foreground">Бесплатная доставка при заказе от 40 €</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Добавьте товары на сумму от 40 € и доставка будет бесплатной — автоматически.
              </p>
            </div>
          </div>

          {/* Courier delivery */}
          <section className="mb-10">
            <h2 className="mb-5 flex items-center gap-2 text-xl font-semibold text-foreground">
              <Home className="h-5 w-5 text-primary" />
              Курьерская доставка
            </h2>
            <div className="rounded-xl border border-border bg-card px-6 py-5">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-foreground">Доставка курьером на дом</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    Курьер доставит заказ прямо к вашей двери. После оформления заказа наш оператор свяжется с вами для уточнения удобного времени доставки.
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    1–3 рабочих дня
                  </p>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-8 text-left sm:text-right">
                  <span className="text-lg font-bold text-primary">5,99 €</span>
                </div>
              </div>
            </div>
          </section>

          {/* Parcel shipping methods */}
          <section className="mb-10">
            <h2 className="mb-5 flex items-center gap-2 text-xl font-semibold text-foreground">
              <Package className="h-5 w-5 text-primary" />
              Доставка в постаматы
            </h2>
            <div className="divide-y divide-border rounded-xl border border-border overflow-hidden">
              {SHIPPING_METHODS.map((method) => (
                <div key={method.id} className="bg-card">
                  <div className="flex flex-col gap-1 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{method.carrier}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">{method.desc}</p>
                      <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {method.time}
                      </p>
                    </div>
                    <div className="mt-3 flex items-center gap-4 sm:mt-0 sm:ml-8">
                      <span className="text-lg font-bold text-primary">{method.price}</span>
                      <button
                        onClick={() => toggleCarrier(method.id)}
                        className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                      >
                        <MapPin className="h-3.5 w-3.5" />
                        Постаматы
                        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expandedCarrier === method.id ? "rotate-180" : ""}`} />
                      </button>
                    </div>
                  </div>
                  {/* Expandable stations list */}
                  {expandedCarrier === method.id && (
                    <div className="border-t border-border bg-muted/30 px-6 py-4">
                      <p className="mb-2 text-xs font-medium text-muted-foreground">Популярные локации:</p>
                      <ul className="grid gap-1.5 text-sm text-foreground sm:grid-cols-2">
                        {PARCEL_STATIONS[method.id as keyof typeof PARCEL_STATIONS].map((station, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-primary" />
                            <span>{station}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="mt-3 text-xs text-muted-foreground">
                        Полный список постаматов доступен при оформлении заказа.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* How it works */}
          <section className="mb-10">
            <h2 className="mb-5 text-xl font-semibold text-foreground">Как это работает</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { step: "1", title: "Оформите заказ", desc: "Выберите товары, укажите контактные данные и метод доставки." },
                { step: "2", title: "Мы упакуем заказ", desc: "Все заказы комплектуются и отправляются в течение 1 рабочего дня." },
                { step: "3", title: "Получите заказ", desc: "Вы получите SMS с кодом для получения посылки в постамате." },
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

          {/* Returns & guarantee with anchors */}
          <section className="mb-10 grid gap-4 sm:grid-cols-2">
            <div id="returns" className="scroll-mt-24 rounded-xl border border-border bg-card p-5 flex gap-4">
              <RotateCcw className="h-6 w-6 flex-shrink-0 text-primary mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">14 дней на возврат</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Если товар вам не подошёл — свяжитесь с нами в течение 14 дней после получения. Мы организуем возврат и вернём деньги.
                </p>
              </div>
            </div>
            <div id="guarantee" className="scroll-mt-24 rounded-xl border border-border bg-card p-5 flex gap-4">
              <ShieldCheck className="h-6 w-6 flex-shrink-0 text-primary mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">100% оригинальный товар</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Мы работаем напрямую с официальными дистрибьюторами французской аптечной косметики. Гарантия подлинности на каждый товар.
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
