"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export type Lang = "ru" | "lv"

export const translations = {
  ru: {
    // Trust strip
    trustStrip:
      "Аутентичная французская аптечная косметика • Оригинал • Доставка по Латвии 1–2 дня • EUR",
    // Header top bar
    deliverTo: "Доставка: Латвия",
    // Header nav
    help: "Помощь",
    trackOrder: "Отследить заказ",
    signIn: "Войти",
    wishlist: "Избранное",
    cart: "Корзина",
    searchPlaceholder: "Поиск по косметике, брендам или проблемам кожи...",
    mobileSearchPlaceholder: "Поиск...",
    specials: "Акции",
    bestSellers: "Хиты продаж",
    // Sidebar
    categories: "Категории",
    // Category names
    skincare: "Уход за лицом",
    haircare: "Уход за волосами",
    bodycare: "Уход за телом",
    sunprotection: "Защита от солнца",
    makeup: "Макияж",
    mencare: "Для мужчин",
    babymom: "Для мамы и малыша",
    brands: "Бренды",
    // Category subcategories
    cleansers: "Очищение",
    toners: "Тоники",
    serums: "Сыворотки",
    moisturizers: "Увлажнение",
    eyeCare: "Уход за глазами",
    faceMasks: "Маски",
    exfoliants: "Эксфолианты",
    shampoos: "Шампуни",
    conditioners: "Кондиционеры",
    hairMasks: "Маски для волос",
    scalpCare: "Уход за кожей головы",
    hairSerums: "Сыворотки для волос",
    bodyLotions: "Лосьоны для тела",
    bodyWash: "Гели для душа",
    scrubs: "Скрабы",
    deodorants: "Дезодоранты",
    handCream: "Кремы для рук",
    spf50: "SPF 50+",
    spf30: "SPF 30",
    afterSun: "После солнца",
    selfTanning: "Автозагар",
    kidsSunCare: "Детская защита",
    foundation: "Тональные средства",
    lipCare: "Уход за губами",
    eyeMakeup: "Макияж глаз",
    blushBronzer: "Румяна и бронзер",
    settingSprays: "Фиксирующие спреи",
    faceWash: "Гели для умывания",
    shaving: "Для бритья",
    moisturizersM: "Увлажнение",
    afterShave: "После бритья",
    bodyCareM: "Уход за телом",
    babySkincare: "Уход за кожей малыша",
    babyBath: "Купание",
    maternityCare: "Для мам",
    diaperCare: "Уход под подгузник",
    babySun: "Солнцезащита для детей",
    // Page
    shopByCategory: "Категории",
    trendingProducts: "Популярные товары",
    bestSellersSection: "Хиты продаж",
    loadMore: "Загрузить ещё",
    sortLabel: "Сортировка",
    sortBestSelling: "По популярности",
    sortLowHigh: "По цене: дешевле",
    sortHighLow: "По цене: дороже",
    sortTopRated: "По рейтингу",
    sortNewest: "Новинки",
    // Trust badges
    freeShipping: "Бесплатная доставка",
    freeShippingDesc: "При заказе от 40€",
    authentic: "Оригинал",
    authenticDesc: "100% гарантия",
    easyReturns: "Лёгкий возврат",
    easyReturnsDesc: "30 дней",
    // Newsletter
    joinNewsletter: "Подпишитесь на рассылку",
    newsletterDesc:
      "Получайте эксклюзивные предложения, новинки и советы по уходу за кожей.",
    emailPlaceholder: "Ваш email",
    subscribe: "Подписаться",
    // Cart
    shoppingCart: "Корзина",
    cartEmpty: "Корзина пуста",
    continueShopping: "Продолжить покупки",
    total: "Итого",
    checkout: "Оформить заказ",
    freeShippingCart: "Бесплатная доставка при заказе от 40€",
    // Product card
    addToCart: "В корзину",
    // Footer
    footerDesc:
      "Pharmiperia — магазин аутентичной французской аптечной косметики для клиентов в Латвии.",
    footerShop: "Магазин",
    footerHelp: "Помощь",
    footerCompany: "Компания",
    footerAccount: "Аккаунт",
    helpCenter: "Справка",
    shippingInfo: "Условия доставки",
    returns: "Возврат",
    contactUs: "Связаться с нами",
    aboutUs: "О нас",
    blog: "Блог",
    careers: "Вакансии",
    press: "Пресса",
    affiliate: "Партнёрская программа",
    myOrders: "Мои заказы",
    myLists: "Избранное",
    rewards: "Бонусы",
    createAccount: "Создать аккаунт",
    privacy: "Политика конфиденциальности",
    terms: "Условия использования",
    cookies: "Политика cookies",
    allRightsReserved: "Все права защищены.",
  },
  lv: {
    // Trust strip
    trustStrip:
      "Autentiska franču aptiekas kosmētika • Oriģināls • Piegāde Latvijā 1–2 dienās • EUR",
    // Header top bar
    deliverTo: "Piegāde: Latvija",
    // Header nav
    help: "Palīdzība",
    trackOrder: "Izsekot pasūtījumu",
    signIn: "Ieiet",
    wishlist: "Vēlmju saraksts",
    cart: "Grozs",
    searchPlaceholder: "Meklēt kosmētiku, zīmolus vai ādas problēmas...",
    mobileSearchPlaceholder: "Meklēt...",
    specials: "Akcijas",
    bestSellers: "Bestselleri",
    // Sidebar
    categories: "Kategorijas",
    // Category names
    skincare: "Sejas kopšana",
    haircare: "Matu kopšana",
    bodycare: "Ķermeņa kopšana",
    sunprotection: "Saules aizsardzība",
    makeup: "Grims",
    mencare: "Vīriešiem",
    babymom: "Māmiņai un mazulim",
    brands: "Zīmoli",
    // Category subcategories
    cleansers: "Tīrīšana",
    toners: "Toneri",
    serums: "Serumi",
    moisturizers: "Mitrinošie līdzekļi",
    eyeCare: "Acu kopšana",
    faceMasks: "Maskas",
    exfoliants: "Eksfolianti",
    shampoos: "Šampūni",
    conditioners: "Kondicionieri",
    hairMasks: "Matu maskas",
    scalpCare: "Galvas ādas kopšana",
    hairSerums: "Matu serumi",
    bodyLotions: "Ķermeņa losjoni",
    bodyWash: "Dušas želejas",
    scrubs: "Skrubji",
    deodorants: "Dezodoranti",
    handCream: "Roku krēmi",
    spf50: "SPF 50+",
    spf30: "SPF 30",
    afterSun: "Pēc saules",
    selfTanning: "Pašpiedegums",
    kidsSunCare: "Bērnu saules aizsardzība",
    foundation: "Tonālie līdzekļi",
    lipCare: "Lūpu kopšana",
    eyeMakeup: "Acu grims",
    blushBronzer: "Vaigu sārtums un bronzers",
    settingSprays: "Fiksējošie sprejs",
    faceWash: "Sejas mazgāšanas geli",
    shaving: "Skūšanai",
    moisturizersM: "Mitrinošie līdzekļi",
    afterShave: "Pēc skūšanās",
    bodyCareM: "Ķermeņa kopšana",
    babySkincare: "Mazuļa ādas kopšana",
    babyBath: "Mazuļa peldēšana",
    maternityCare: "Māmiņām",
    diaperCare: "Autiņu zona",
    babySun: "Bērnu saules aizsardzība",
    // Page
    shopByCategory: "Kategorijas",
    trendingProducts: "Populārākie produkti",
    bestSellersSection: "Bestselleri",
    loadMore: "Ielādēt vairāk",
    sortLabel: "Kārtošana",
    sortBestSelling: "Pēc popularitātes",
    sortLowHigh: "Cena: lētākie",
    sortHighLow: "Cena: dārgākie",
    sortTopRated: "Pēc vērtējuma",
    sortNewest: "Jaunumi",
    // Trust badges
    freeShipping: "Bezmaksas piegāde",
    freeShippingDesc: "Pasūtot no 40€",
    authentic: "Oriģināls",
    authenticDesc: "100% garantija",
    easyReturns: "Vienkārša atgriešana",
    easyReturnsDesc: "30 dienas",
    // Newsletter
    joinNewsletter: "Piesakieties jaunumiem",
    newsletterDesc:
      "Saņemiet ekskluzīvus piedāvājumus, jaunumus un padomus ādas kopšanā.",
    emailPlaceholder: "Jūsu e-pasts",
    subscribe: "Pieteikties",
    // Cart
    shoppingCart: "Grozs",
    cartEmpty: "Grozs ir tukšs",
    continueShopping: "Turpināt iepirkšanos",
    total: "Kopā",
    checkout: "Noformēt pasūtījumu",
    freeShippingCart: "Bezmaksas piegāde pasūtot no 40€",
    // Product card
    addToCart: "Pievienot grozam",
    // Footer
    footerDesc:
      "Pharmiperia — autentiskas franču aptiekas kosmētikas veikals klientiem Latvijā.",
    footerShop: "Veikals",
    footerHelp: "Palīdzība",
    footerCompany: "Uzņēmums",
    footerAccount: "Konts",
    helpCenter: "Palīdzības centrs",
    shippingInfo: "Piegādes nosacījumi",
    returns: "Atgriešana",
    contactUs: "Sazināties",
    aboutUs: "Par mums",
    blog: "Blogs",
    careers: "Karjera",
    press: "Prese",
    affiliate: "Partneru programma",
    myOrders: "Mani pasūtījumi",
    myLists: "Vēlmju saraksts",
    rewards: "Bonusi",
    createAccount: "Izveidot kontu",
    privacy: "Privātuma politika",
    terms: "Lietošanas noteikumi",
    cookies: "Sīkdatņu politika",
    allRightsReserved: "Visas tiesības aizsargātas.",
  },
} as const

export type TranslationKey = keyof typeof translations.ru

interface LangContextValue {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: TranslationKey) => string
}

const LangContext = createContext<LangContextValue>({
  lang: "ru",
  setLang: () => {},
  t: (key) => translations.ru[key],
})

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("ru")
  const t = (key: TranslationKey) => translations[lang][key]
  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}

export function formatEur(amount: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(amount)
}
