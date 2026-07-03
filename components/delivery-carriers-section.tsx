"use client"

import { useState } from "react"
import { useLang } from "@/lib/i18n"
import { Clock, MapPin, ChevronDown } from "lucide-react"

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
} as const

const SHIPPING_METHODS = [
  {
    id: "omniva",
    carrier: "Omniva pakomāts",
    logo: "/images/delivery-logos/omniva.png",
    logoWidth: 90,
    logoHeight: 32,
    price: "3,50 €",
    timeKey: "deliveryDays12",
    descKey: "deliveryOmnivaDesc",
  },
  {
    id: "dpd",
    carrier: "DPD Pickup punkts",
    logo: "/images/delivery-logos/dpd.png",
    logoWidth: 56,
    logoHeight: 32,
    price: "3,20 €",
    timeKey: "deliveryDays12",
    descKey: "deliveryDpdDesc",
  },
  {
    id: "venipak",
    carrier: "Venipak pakomāts",
    logo: "/images/delivery-logos/venipak.png",
    logoWidth: 90,
    logoHeight: 28,
    price: "2,95 €",
    timeKey: "deliveryDays12",
    descKey: "deliveryVenipakDesc",
  },
  {
    id: "smartpost",
    carrier: "Smartpost Itella",
    logo: "/images/delivery-logos/smartposti.png",
    logoWidth: 110,
    logoHeight: 28,
    price: "2,99 €",
    timeKey: "deliveryDays23",
    descKey: "deliverySmartpostDesc",
  },
] as const

export function DeliveryCarriersSection() {
  const { t } = useLang()
  const [expandedCarrier, setExpandedCarrier] = useState<string | null>(null)

  return (
    <div className="divide-y divide-border rounded-xl border border-border overflow-hidden">
      {SHIPPING_METHODS.map((method) => (
        <div key={method.id} className="bg-card">
          <div className="flex flex-col gap-1 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <div className="mb-1 flex items-center gap-3">
                <img
                  src={method.logo}
                  alt={method.carrier}
                  width={method.logoWidth}
                  height={method.logoHeight}
                  className="object-contain"
                />
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">{t(method.descKey)}</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                {t(method.timeKey)}
              </p>
            </div>
            <div className="mt-3 flex items-center gap-4 sm:mt-0 sm:ml-8">
              <span className="text-lg font-bold text-primary">{method.price}</span>
              <button
                type="button"
                onClick={() =>
                  setExpandedCarrier(expandedCarrier === method.id ? null : method.id)
                }
                className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
              >
                <MapPin className="h-3.5 w-3.5" />
                {t("deliveryParcelLabel")}
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${expandedCarrier === method.id ? "rotate-180" : ""}`}
                />
              </button>
            </div>
          </div>
          {expandedCarrier === method.id && (
            <div className="border-t border-border bg-muted/30 px-6 py-4">
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                {t("deliveryPopularLocations")}
              </p>
              <ul className="grid gap-1.5 text-sm text-foreground sm:grid-cols-2">
                {PARCEL_STATIONS[method.id].map((station) => (
                  <li key={station} className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-primary" />
                    <span>{station}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-muted-foreground">{t("deliveryFullListNote")}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}