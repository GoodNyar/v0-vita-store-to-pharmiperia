import type { Locale } from '@/lib/i18n/config'

export interface WelcomeEmailCopy {
  subject: string
  preview: string
  title: string
  greeting: (name: string) => string
  intro: string
  perksTitle: string
  perks: string[]
  shopCta: string
  supportText: string
  footer: string
}

const COPY: Record<Locale, WelcomeEmailCopy> = {
  lv: {
    subject: 'Laipni lūdzam Pharmiperia! 🌿',
    preview: 'Paldies, ka pievienojāties — šeit ir īss ceļvedis pa veikalu.',
    title: 'Laipni lūdzam!',
    greeting: (name) => `Sveiki, ${name}!`,
    intro:
      'Paldies, ka izveidojāt kontu Pharmiperia. Mēs esam oriģinālu franču aptiekas zīmolu tiešsaistes veikals Latvijā — ar ātru piegādi un konsultācijām latviski un krieviski.',
    perksTitle: 'Ko varat darīt tūlīt',
    perks: [
      'Pārlūkot personalizētos ieteikumus kontā',
      'Saglabāt favorītus un sekot pasūtījumiem',
      'Saņemt ekskluzīvus piedāvājumus e-pastā',
    ],
    shopCta: 'Apskatīt veikalu',
    supportText: 'Jautājumi? Rakstiet mums:',
    footer: 'Pharmiperia — oriģināla franču aptiekas kosmētika Latvijā',
  },
  ru: {
    subject: 'Добро пожаловать в Pharmiperia! 🌿',
    preview: 'Спасибо за регистрацию — краткий гид по магазину внутри.',
    title: 'Добро пожаловать!',
    greeting: (name) => `Здравствуйте, ${name}!`,
    intro:
      'Спасибо, что создали аккаунт в Pharmiperia. Мы — онлайн-магазин оригинальной французской аптечной косметики в Латвии с быстрой доставкой и поддержкой на латышском и русском.',
    perksTitle: 'Что можно сделать прямо сейчас',
    perks: [
      'Смотреть персональные рекомендации в личном кабинете',
      'Сохранять избранное и отслеживать заказы',
      'Получать эксклюзивные предложения по email',
    ],
    shopCta: 'Перейти в магазин',
    supportText: 'Вопросы? Напишите нам:',
    footer: 'Pharmiperia — оригинальная французская аптечная косметика в Латвии',
  },
}

export function getWelcomeEmailCopy(locale: Locale): WelcomeEmailCopy {
  return COPY[locale]
}