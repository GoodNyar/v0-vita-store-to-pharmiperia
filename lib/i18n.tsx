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
    bestSellers: "Популярное",
    viewCatalog: "Смотреть каталог",
    // Sidebar
    categories: "Категории",
    // Category names
    skincare: "Лицо",
    haircare: "Волосы",
    bodycare: "Тело",
    sunprotection: "Солнцезащита",
    makeup: "Макияж",
    mencare: "Мужчинам",
    womencare: "Женщинам",
    brands: "Бренды",
    bestsellers: "Популярное",
    // Subcategories — skincare
    cleansers: "Очищение",
    toners: "Тоники",
    serums: "Сыворотки",
    moisturizers: "Увлажнение",
    eyeCare: "Уход за глазами",
    faceMasks: "Маски",
    exfoliants: "Эксфолианты",
    // Subcategories — haircare
    shampoos: "Шампуни",
    conditioners: "Кондиционеры",
    hairMasks: "Маски для волос",
    scalpCare: "Уход за кожей головы",
    hairSerums: "Сыворотки для волос",
    // Subcategories — bodycare
    bodyLotions: "Лосьоны для тела",
    bodyWash: "Гели для душа",
    scrubs: "Скрабы",
    deodorants: "Дезодоранты",
    handCream: "Кремы для рук",
    // Subcategories — sun
    spf50: "SPF 50+",
    spf30: "SPF 30",
    afterSun: "После солнца",
    selfTanning: "Автозагар",
    kidsSunCare: "Детская защита",
    // Subcategories — makeup
    foundation: "Тональные средства",
    lipCare: "Уход за губами",
    eyeMakeup: "Макияж глаз",
    blushBronzer: "Румяна и бронзер",
    settingSprays: "Фиксирующие спреи",
    // Subcategories — men
    faceWash: "Гели для умывания",
    shaving: "Для бритья",
    moisturizersM: "Увлажнение",
    afterShave: "После бритья",
    bodyCareM: "Уход за телом",
    // Subcategories — women
    antiAgeing: "Антивозрастной уход",
    brightening: "Осветление кожи",
    sensitiveSkin: "Чувствительная кожа",
    perfume: "Парфюмерия",
    giftSets: "Подарочные наборы",
    // Product badges
    bestSeller: "Хит продаж",
    popular: "Популярно",
    topRated: "Топ рейтинг",
    discount: "Скидка",
    // Page
    shopByCategory: "Категории",
    trendingProducts: "Популярные товары",
    bestSellersSection: "Популярное",
    loadMore: "Загрузить ещё",
    viewAllPopular: "Смотреть все популярные товары",
    // Promos section
    specialOffers: "Акции и специальные предложения",
    viewOffer: "Смотреть предложение",
    promo1Title: "Скидка 20% на Vichy",
    promo1Desc: "Вся линейка Mineral 89 и Liftactiv — только до конца месяца.",
    promo2Title: "Набор Bioderma в подарок",
    promo2Desc: "При покупке от 60€ получите travel-набор Sensibio в подарок.",
    // Why buy us section
    whyBuyUs: "Почему покупать у нас",
    fastDelivery: "Быстрая доставка",
    fastDeliveryDesc: "Доставка по Латвии за 1–2 рабочих дня\nПакоматы и курьер",
    originalCosmetics: "100% оригинальная косметика",
    originalCosmeticsDesc: "Работаем только с официальными поставщиками\nГарантия оригинальной продукции",
    securePayment: "Безопасная оплата",
    securePaymentDesc: "Visa • Mastercard • Apple Pay",
    easyReturnTitle: "Лёгкий возврат",
    easyReturnDesc: "14 дней право на отказ",
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
    joinNewsletter: "Получайте лучшие предложения",
    newsletterDesc:
      "Скидки, новинки и рекомендации по аптечному уходу за кожей.",
    emailPlaceholder: "Ваш email",
    subscribe: "Подписаться",
    newsletterBonus: "−10% на первый заказ после подписки",
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
    specials: "Atlaides",
    bestSellers: "Populārais",
    viewCatalog: "Skatīt katalogu",
    // Sidebar
    categories: "Kategorijas",
    // Category names
    skincare: "Seja",
    haircare: "Mati",
    bodycare: "Ķermenis",
    sunprotection: "Saules aizsardzība",
    makeup: "Dekoratīvā kosmētika",
    mencare: "Vīriešiem",
    womencare: "Sievietēm",

    brands: "Zīmoli",
    bestsellers: "Populārais",
    // Subcategories — skincare
    cleansers: "Tīrīšana",
    toners: "Toneri",
    serums: "Serumi",
    moisturizers: "Mitrinošie līdzekļi",
    eyeCare: "Acu kopšana",
    faceMasks: "Maskas",
    exfoliants: "Eksfolianti",
    // Subcategories — haircare
    shampoos: "Šampūni",
    conditioners: "Kondicionieri",
    hairMasks: "Matu maskas",
    scalpCare: "Galvas ādas kopšana",
    hairSerums: "Matu serumi",
    // Subcategories — bodycare
    bodyLotions: "Ķermeņa losjoni",
    bodyWash: "Dušas želejas",
    scrubs: "Skrubji",
    deodorants: "Dezodoranti",
    handCream: "Roku krēmi",
    // Subcategories — sun
    spf50: "SPF 50+",
    spf30: "SPF 30",
    afterSun: "Pēc saules",
    selfTanning: "Pašpiedegums",
    kidsSunCare: "Bērnu saules aizsardzība",
    // Subcategories — makeup
    foundation: "Tonālie līdzekļi",
    lipCare: "Lūpu kopšana",
    eyeMakeup: "Acu grims",
    blushBronzer: "Vaigu sārtums un bronzers",
    settingSprays: "Fiksējošie sprejs",
    // Subcategories — men
    faceWash: "Sejas mazgāšanas geli",
    shaving: "Skūšanai",
    moisturizersM: "Mitrinošie līdzekļi",
    afterShave: "Pēc skūšanās",
    bodyCareM: "Ķermeņa kopšana",
    // Subcategories — women
    antiAgeing: "Pretnovecošanās kopšana",
    brightening: "Ādas izlīdzināšana",
    sensitiveSkin: "Jutīga āda",
    perfume: "Smaržas",
    giftSets: "Dāvanu komplekti",
    // Product badges
    bestSeller: "Pārdotākais",
    popular: "Populārs",
    topRated: "Augsts vērtējums",
    discount: "Atlaide",
    // Page
    shopByCategory: "Kategorijas",
    trendingProducts: "Populārākie produkti",
    bestSellersSection: "Populārais",
    loadMore: "Ielādēt vairāk",
    viewAllPopular: "Skatīt visus populāros produktus",
    // Promos section
    specialOffers: "Akcijas un īpašie piedāvājumi",
    viewOffer: "Skatīt piedāvājumu",
    promo1Title: "20% atlaide Vichy",
    promo1Desc: "Visa Mineral 89 un Liftactiv kolekcija — tikai līdz mēneša beigām.",
    promo2Title: "Bioderma komplekts dāvanā",
    promo2Desc: "Pērkot no 60€, sa��emiet Sensibio ceļojumu komplektu dāvanā.",
    // Why buy us section
    whyBuyUs: "Kāpēc pirkt mums",
    fastDelivery: "Ātra piegāde",
    fastDeliveryDesc: "Piegāde Latvijā 1–2 darba dienās\nPakšķi un kurjers",
    originalCosmetics: "100% oriģināla kosmētika",
    originalCosmeticsDesc: "Strādājam tikai ar oficiāliem piegādātājiem\nOriģinālo preču garantija",
    securePayment: "Draudzīga maksāšana",
    securePaymentDesc: "Visa • Mastercard • Apple Pay",
    easyReturnTitle: "Vienkārša atgriešana",
    easyReturnDesc: "14 dienu tiesības uz atgriešanu",
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
    joinNewsletter: "Saņemiet labākos piedāvājumus",
    newsletterDesc:
      "Atlaides, jaunumi un ieteikumi ādas kopšanai.",
    emailPlaceholder: "Jūsu e-pasts",
    subscribe: "Pieteikties",
    newsletterBonus: "−10% pirmajam pasūtījumam",
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
