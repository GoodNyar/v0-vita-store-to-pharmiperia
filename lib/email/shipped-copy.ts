import type { Locale } from '@/lib/i18n/config'

export interface OrderShippedCopy {
  subject: (orderNumber: string) => string
  preview: string
  title: string
  greeting: (name: string) => string
  intro: string
  orderNumberLabel: string
  trackingLabel: string
  trackingPending: string
  deliveryTitle: string
  ordersCta: string
  supportText: string
  footer: string
}

const COPY: Record<Locale, OrderShippedCopy> = {
  lv: {
    subject: (orderNumber) => `Jūsu pasūtījums ${orderNumber} ir nosūtīts — Pharmiperia`,
    preview: 'Jūsu sūtījums ir ceļā! Zemāk — izsekošanas informācija.',
    title: 'Pasūtījums nosūtīts!',
    greeting: (name) => `Sveiki, ${name}!`,
    intro:
      'Labas ziņas — jūsu pasūtījums ir nodots kurjerim. Kad izsekošanas numurs būs pieejams, to redzēsiet arī savā kontā.',
    orderNumberLabel: 'Pasūtījuma numurs',
    trackingLabel: 'Izsekošanas numurs',
    trackingPending: 'Tiks nosūtīts atsevišķi, tiklīdz būs pieejams',
    deliveryTitle: 'Piegādes veids',
    ordersCta: 'Skatīt pasūtījumu',
    supportText: 'Jautājumi par piegādi? Rakstiet mums:',
    footer: 'Pharmiperia — oriģināla franču aptiekas kosmētika Latvijā',
  },
  ru: {
    subject: (orderNumber) => `Ваш заказ ${orderNumber} отправлен — Pharmiperia`,
    preview: 'Посылка в пути! Ниже — информация для отслеживания.',
    title: 'Заказ отправлен!',
    greeting: (name) => `Здравствуйте, ${name}!`,
    intro:
      'Хорошие новости — заказ передан в доставку. Когда появится трек-номер, он также будет доступен в личном кабинете.',
    orderNumberLabel: 'Номер заказа',
    trackingLabel: 'Трек-номер',
    trackingPending: 'Будет отправлен отдельно, как только появится',
    deliveryTitle: 'Способ доставки',
    ordersCta: 'Открыть заказ',
    supportText: 'Вопросы по доставке? Напишите нам:',
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

export function getOrderShippedCopy(locale: Locale): OrderShippedCopy {
  return COPY[locale]
}

export function getShippedDeliveryLabel(locale: Locale, method: string): string {
  return SHIPPING_LABELS[locale][method] ?? method
}