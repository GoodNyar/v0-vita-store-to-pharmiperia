import type { Locale } from '@/lib/i18n/config'

interface AbandonedCartCopy {
  subject: string
  preview: string
  title: string
  greeting: (name: string) => string
  intro: string
  cta: string
  footer: string
  supportText: string
}

const COPY: Record<Locale, AbandonedCartCopy> = {
  lv: {
    subject: 'Jūsu grozs gaida — Pharmiperia',
    preview: 'Pabeidziet pasūtījumu, kamēr preces ir noliktavā',
    title: 'Jūsu grozs gaida',
    greeting: (name) => `Sveiki, ${name || 'draugs'}!`,
    intro:
      'Pamanījām, ka jūsu grozā joprojām ir preces. Pabeidziet pasūtījumu, kamēr tās ir pieejamas.',
    cta: 'Atgriezties pie groza',
    footer: 'Pharmiperia — jūsu tiešsaistes aptieka Latvijā.',
    supportText: 'Jautājumi? Rakstiet mums:',
  },
  ru: {
    subject: 'Ваша корзина ждёт — Pharmiperia',
    preview: 'Завершите заказ, пока товары в наличии',
    title: 'Ваша корзина ждёт',
    greeting: (name) => `Здравствуйте, ${name || 'друг'}!`,
    intro:
      'Мы заметили, что в вашей корзине остались товары. Завершите заказ, пока они доступны.',
    cta: 'Вернуться к корзине',
    footer: 'Pharmiperia — ваша онлайн-аптека в Латвии.',
    supportText: 'Вопросы? Напишите нам:',
  },
}

export function getAbandonedCartCopy(locale: Locale): AbandonedCartCopy {
  return COPY[locale]
}