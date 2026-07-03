import type { Locale } from '@/lib/i18n/config'

export interface OrderConfirmationCopy {
  subject: (orderNumber: string) => string
  preview: string
  title: string
  greeting: (name: string) => string
  intro: string
  orderNumberLabel: string
  itemsTitle: string
  quantityLabel: string
  subtotalLabel: string
  shippingLabel: string
  vatLabel: string
  totalLabel: string
  deliveryTitle: string
  supportText: string
  ordersCta: string
  footer: string
}

const COPY: Record<Locale, OrderConfirmationCopy> = {
  lv: {
    subject: (orderNumber) => `Pasūtījuma apstiprinājums ${orderNumber} — Pharmiperia`,
    preview: 'Jūsu apmaksa ir saņemta. Paldies par pirkumu!',
    title: 'Paldies par pasūtījumu!',
    greeting: (name) => `Sveiki, ${name}!`,
    intro:
      'Jūsu maksājums ir veiksmīgi apstrādāts. Zemāk — pasūtījuma kopsavilkums. Kad sūtīsim preces, nosūtīsim arī izsekošanas numuru.',
    orderNumberLabel: 'Pasūtījuma numurs',
    itemsTitle: 'Preces',
    quantityLabel: 'Daudz.',
    subtotalLabel: 'Preču summa',
    shippingLabel: 'Piegāde',
    vatLabel: 'PVN 21% (iekļauts)',
    totalLabel: 'Kopā',
    deliveryTitle: 'Piegāde',
    supportText: 'Jautājumi? Rakstiet mums:',
    ordersCta: 'Skatīt pasūtījumus',
    footer: 'Pharmiperia — oriģināla franču aptiekas kosmētika Latvijā',
  },
  ru: {
    subject: (orderNumber) => `Подтверждение заказа ${orderNumber} — Pharmiperia`,
    preview: 'Ваш платёж получен. Спасибо за покупку!',
    title: 'Спасибо за заказ!',
    greeting: (name) => `Здравствуйте, ${name}!`,
    intro:
      'Ваш платёж успешно обработан. Ниже — сводка заказа. Когда отправим посылку, пришлём трек-номер отдельным письмом.',
    orderNumberLabel: 'Номер заказа',
    itemsTitle: 'Товары',
    quantityLabel: 'Кол-во',
    subtotalLabel: 'Сумма товаров',
    shippingLabel: 'Доставка',
    vatLabel: 'НДС 21% (включён)',
    totalLabel: 'Итого',
    deliveryTitle: 'Доставка',
    supportText: 'Вопросы? Напишите нам:',
    ordersCta: 'Мои заказы',
    footer: 'Pharmiperia — оригинальная французская аптечная косметика в Латвии',
  },
}

const SHIPPING_LABELS: Record<Locale, Record<string, string>> = {
  lv: {
    omniva: 'Omniva pakomāts',
    dpd: 'DPD Pickup',
    venipak: 'Venipak pakomāts',
    smartpost: 'Smartpost Itella',
    courier: 'Kurjera piegāde',
  },
  ru: {
    omniva: 'Omniva pakomāts',
    dpd: 'DPD Pickup',
    venipak: 'Venipak pakomāts',
    smartpost: 'Smartpost Itella',
    courier: 'Курьерская доставка',
  },
}

export function getOrderConfirmationCopy(locale: Locale): OrderConfirmationCopy {
  return COPY[locale]
}

export function getShippingMethodLabel(locale: Locale, method: string): string {
  return SHIPPING_LABELS[locale][method] ?? method
}

export function formatEmailMoney(cents: number, locale: Locale): string {
  const intlLocale = locale === 'lv' ? 'lv-LV' : 'ru-LV'
  return new Intl.NumberFormat(intlLocale, {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100)
}