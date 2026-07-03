import type { Locale } from '@/lib/i18n/config'

export interface RefundNoticeCopy {
  subject: (orderNumber: string) => string
  preview: string
  title: string
  greeting: (name: string) => string
  intro: string
  orderNumberLabel: string
  amountLabel: string
  timelineLabel: string
  timelineValue: string
  note: string
  ordersCta: string
  supportText: string
  footer: string
}

const COPY: Record<Locale, RefundNoticeCopy> = {
  lv: {
    subject: (orderNumber) => `Atmaksas paziņojums par pasūtījumu ${orderNumber} — Pharmiperia`,
    preview: 'Mēs apstrādājam jūsu atmaksu. Detalizēta informācija zemāk.',
    title: 'Atmaksa tiek apstrādāta',
    greeting: (name) => `Sveiki, ${name}!`,
    intro:
      'Esam saņēmuši jūsu atgriešanas pieprasījumu un apstiprinājuši atmaksu. Nauda tiks atgriezta uz sākotnējo maksājuma metodi.',
    orderNumberLabel: 'Pasūtījuma numurs',
    amountLabel: 'Atmaksas summa',
    timelineLabel: 'Paredzamais termiņš',
    timelineValue: '5–7 darba dienas pēc apstiprinājuma',
    note: 'Ja atmaksa nenotiek noteiktajā termiņā, lūdzu, sazinieties ar mums, norādot pasūtījuma numuru.',
    ordersCta: 'Skatīt pasūtījumus',
    supportText: 'Jautājumi par atmaksu? Rakstiet mums:',
    footer: 'Pharmiperia — oriģināla franču aptiekas kosmētika Latvijā',
  },
  ru: {
    subject: (orderNumber) => `Уведомление о возврате по заказу ${orderNumber} — Pharmiperia`,
    preview: 'Мы обрабатываем ваш возврат. Подробности ниже.',
    title: 'Возврат обрабатывается',
    greeting: (name) => `Здравствуйте, ${name}!`,
    intro:
      'Мы получили вашу заявку на возврат и подтвердили возмещение. Средства будут возвращены на исходный способ оплаты.',
    orderNumberLabel: 'Номер заказа',
    amountLabel: 'Сумма возврата',
    timelineLabel: 'Ожидаемый срок',
    timelineValue: '5–7 рабочих дней после подтверждения',
    note: 'Если возврат не поступит в указанный срок, напишите нам с номером заказа.',
    ordersCta: 'Мои заказы',
    supportText: 'Вопросы по возврату? Напишите нам:',
    footer: 'Pharmiperia — оригинальная французская аптечная косметика в Латвии',
  },
}

export function getRefundNoticeCopy(locale: Locale): RefundNoticeCopy {
  return COPY[locale]
}

export function formatRefundEmailMoney(cents: number, locale: Locale): string {
  const intlLocale = locale === 'lv' ? 'lv-LV' : 'ru-LV'
  return new Intl.NumberFormat(intlLocale, {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100)
}