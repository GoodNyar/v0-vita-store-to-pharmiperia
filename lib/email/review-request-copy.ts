import type { Locale } from '@/lib/i18n/config'

export interface ReviewRequestCopy {
  subject: (orderNumber: string) => string
  preview: string
  title: string
  greeting: (name: string) => string
  intro: string
  orderNumberLabel: string
  reviewCta: string
  supportText: string
  footer: string
}

const COPY: Record<Locale, ReviewRequestCopy> = {
  lv: {
    subject: (orderNumber) => `Kā jums patika pasūtījums ${orderNumber}?`,
    preview: 'Jūsu viedoklis palīdz citiem izvēlēties pareizo produktu.',
    title: 'Dalieties ar pieredzi',
    greeting: (name) => `Sveiki, ${name}!`,
    intro:
      'Ceram, ka pasūtījums jau ir pie jums. Ja kāds produkts patika — atstājiet īsu atsauksmi. Tas palīdz citiem klientiem un uzlabo mūsu sortimentu.',
    orderNumberLabel: 'Pasūtījuma numurs',
    reviewCta: 'Atstāt atsauksmi',
    supportText: 'Problēmas ar pasūtījumu? Rakstiet mums:',
    footer: 'Pharmiperia — oriģināla franču aptiekas kosmētika Latvijā',
  },
  ru: {
    subject: (orderNumber) => `Как вам заказ ${orderNumber}?`,
    preview: 'Ваш отзыв помогает другим выбрать подходящий продукт.',
    title: 'Поделитесь впечатлением',
    greeting: (name) => `Здравствуйте, ${name}!`,
    intro:
      'Надеемся, заказ уже у вас. Если какой-то продукт понравился — оставьте короткий отзыв. Это помогает другим покупателям и улучшает наш ассортимент.',
    orderNumberLabel: 'Номер заказа',
    reviewCta: 'Оставить отзыв',
    supportText: 'Проблемы с заказом? Напишите нам:',
    footer: 'Pharmiperia — оригинальная французская аптечная косметика в Латвии',
  },
}

export function getReviewRequestCopy(locale: Locale): ReviewRequestCopy {
  return COPY[locale]
}