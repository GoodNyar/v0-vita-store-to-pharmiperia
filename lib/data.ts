import { eur, type Money } from "./money"

export const BRANDS_ORDERED = [
  "Bioderma",
  "Vichy",
  "Biotherm",
  "Evian",
  "Clinique",
  "Nuxe",
  "Avène",
  "Uriage",
  "Caudalie",
  "La Roche-Posay",
]

/** Active ingredient highlight shown in the product card education block.
 *  Both fields store i18n translation keys (LV primary, RU fallback). */
export interface ActiveIngredient {
  /** i18n key for the ingredient title, e.g. "ingRetinolName" */
  name: string
  /** i18n key for the short benefit description, e.g. "ingRetinolDesc" */
  shortDescription: string
}

/** Normalize catalog product ids from app state, URLs, or external string sources. */
export function normalizeProductId(value: string | number): number {
  return typeof value === "number" ? value : Number(value)
}

export function isCatalogProductId(value: number): boolean {
  return Number.isInteger(value) && value > 0
}

export interface Product {
  id: number
  sku: string
  name: string
  brand: string
  volume: string
  description: string
  price: Money
  originalPrice?: Money
  rating: number
  reviewCount: number
  /** Packshot URL — product only (tube/bottle/jar) on plain white (#fff).
   *  No lifestyle, hands, water splashes, droplets, towels, or props. */
  image: string
  category: string
  badge?: string
  inStock: boolean
  /** i18n keys for skin-type + benefit pill badges */
  tags?: string[]
  /** highlighted active ingredient (i18n keys) */
  activeIngredient?: ActiveIngredient
  /** Extra packshots for quick-view gallery */
  images?: string[]
  /** Additional actives for quick-view (falls back to activeIngredient) */
  activeIngredients?: ActiveIngredient[]
  /** i18n keys for "why choose" bullets in quick view */
  whyChoose?: string[]
  /** i18n key for texture line in quick view */
  texture?: string
  /** i18n key for application line in quick view */
  application?: string
  /** i18n key for "free from" disclaimer in quick view */
  freeFrom?: string
}

export interface Category {
  id: string
  name: string
  icon: string
  subcategories: string[]
}

export const categories: Category[] = [
  {
    id: "skincare",
    name: "Лицо",
    icon: "sparkles",
    subcategories: [
      "cleansers",
      "toners",
      "serums",
      "moisturizers",
      "eyeCare",
      "faceMasks",
      "exfoliants",
    ],
  },
  {
    id: "haircare",
    name: "Волосы",
    icon: "droplets",
    subcategories: [
      "shampoos",
      "conditioners",
      "hairMasks",
      "scalpCare",
    ],
  },
  {
    id: "bodycare",
    name: "Тело",
    icon: "heart",
    subcategories: [
      "bodyLotions",
      "bodyWash",
      "scrubs",
      "deodorants",
      "handCream",
    ],
  },
  {
    id: "sunprotection",
    name: "Солнцезащита",
    icon: "sun",
    subcategories: [
      "spf50",
      "spf30",
      "afterSun",
      "selfTanning",
      "kidsSunCare",
    ],
  },
  {
    id: "makeup",
    name: "Макияж",
    icon: "paintbrush",
    subcategories: [
      "foundation",
      "lipCare",
      "eyeMakeup",
      "blushBronzer",
      "settingSprays",
    ],
  },
  {
    id: "mencare",
    name: "Мужчинам",
    icon: "user",
    subcategories: [
      "faceWash",
      "shaving",
      "moisturizersM",
      "afterShave",
      "bodyCareM",
    ],
  },
  {
    id: "womencare",
    name: "Женщинам",
    icon: "userRound",
    subcategories: [
      "antiAgeing",
      "brightening",
      "sensitiveSkin",
      "perfume",
      "giftSets",
    ],
  },
  {
    id: "brands",
    name: "Бренды",
    icon: "tag",
    subcategories: BRANDS_ORDERED,
  },
]

// Packshot only — product on plain white. No water, droplets, splashes, hands, or props.
// Sources: Unsplash mockup-free & Curology studio shots.
const IMG = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=800&h=800&fit=crop&auto=format&q=85&bg=ffffff`

export const products: Product[] = [
  {
    id: 1,
    sku: "02314",
    name: "Sensibio H2O Micellar Water",
    brand: "Bioderma",
    volume: "500 ml",
    description: "Очищающая мицеллярная вода для чувствительной кожи",
    price: eur(1899),
    originalPrice: eur(2499),
    rating: 4.9,
    reviewCount: 87,
    image: IMG("1693990437506-dac9d69697a9"),
    images: [
      IMG("1693990437506-dac9d69697a9"),
      IMG("1556228578-8c89e6adf883"),
    ],
    tags: ["tagSensitive", "tagCleansing"],
    activeIngredient: { name: "ingMicellesName", shortDescription: "ingMicellesDesc" },
    activeIngredients: [
      { name: "ingMicellesName", shortDescription: "ingMicellesDesc" },
      { name: "ingGlycerinName", shortDescription: "ingGlycerinDesc" },
    ],
    whyChoose: ["qvWhyDaily", "qvWhyAbsorbs", "qvWhyDermRecommended"],
    texture: "textureMicellarWater",
    application: "applicationDaily",
    freeFrom: "qvFreeFromDefault",
    category: "skincare",
    badge: "bestSeller",
    inStock: true,
  },
  {
    id: 2,
    sku: "05428",
    name: "Thermal Spring Water Spray",
    brand: "Avène",
    volume: "300 ml",
    description: "Успокаивающий спрей с термальной водой",
    price: eur(1250),
    rating: 4.8,
    reviewCount: 64,
    image: IMG("1639112389900-a858bf671be1"),
    tags: ["tagSensitive", "tagSoothing"],
    activeIngredient: { name: "ingThermalName", shortDescription: "ingThermalDesc" },
    category: "skincare",
    badge: "popular",
    inStock: true,
  },
  {
    id: 3,
    sku: "01847",
    name: "Mineral 89 Hyaluronic Acid Serum",
    brand: "Vichy",
    volume: "50 ml",
    description: "Увлажняющая сыворотка с гиалуроновой кислотой",
    price: eur(2995),
    originalPrice: eur(3700),
    rating: 4.8,
    reviewCount: 52,
    image: IMG("1556228721-e65f06ab45c8"),
    images: [IMG("1556228721-e65f06ab45c8"), IMG("1556227834-09f1de7a7d14")],
    tags: ["tagAllSkin", "tagHydration"],
    activeIngredient: { name: "ingHyaluronicName", shortDescription: "ingHyaluronicDesc" },
    activeIngredients: [
      { name: "ingHyaluronicName", shortDescription: "ingHyaluronicDesc" },
      { name: "ingGlycerinName", shortDescription: "ingGlycerinDesc" },
    ],
    whyChoose: [
      "qvWhyReducesBlemishes",
      "qvWhyReducesBreakouts",
      "qvWhyRegulatesSebum",
      "qvWhyNoDryness",
    ],
    texture: "textureSerum",
    application: "applicationMorningEvening",
    freeFrom: "qvFreeFromDefault",
    category: "skincare",
    badge: "topRated",
    inStock: true,
  },
  {
    id: 4,
    sku: "03561",
    name: "Proactive Anti-Aging Serum",
    brand: "Biotherm",
    volume: "30 ml",
    description: "Активная сыворотка против старения кожи",
    price: eur(4900),
    originalPrice: eur(6200),
    rating: 4.7,
    reviewCount: 31,
    image: IMG("1556227834-09f1de7a7d14"),
    tags: ["tagNormalDry", "tagAntiAge"],
    activeIngredient: { name: "ingRetinolName", shortDescription: "ingRetinolDesc" },
    category: "skincare",
    badge: "discount",
    inStock: true,
  },
  {
    id: 5,
    sku: "04112",
    name: "Moisture Surge 100H Moisturizer",
    brand: "Clinique",
    volume: "50 ml",
    description: "Увлажняющий крем на 100 часов",
    price: eur(4200),
    rating: 4.6,
    reviewCount: 45,
    image: IMG("1640967378425-50dbf90aee8a"),
    tags: ["tagAllSkin", "tagHydration"],
    activeIngredient: { name: "ingHyaluronicName", shortDescription: "ingHyaluronicDesc" },
    category: "skincare",
    inStock: true,
  },
  {
    id: 6,
    sku: "02891",
    name: "Huile Prodigieuse Dry Oil",
    brand: "Nuxe",
    volume: "100 ml",
    description: "Универсальное сухое масло для лица и тела",
    price: eur(3495),
    originalPrice: eur(4200),
    rating: 4.9,
    reviewCount: 118,
    image: IMG("1696894756299-345f1c0feb00"),
    tags: ["tagAllSkin", "tagNourishing"],
    activeIngredient: { name: "ingArganName", shortDescription: "ingArganDesc" },
    category: "bodycare",
    badge: "bestSeller",
    inStock: true,
  },
  {
    id: 7,
    sku: "03725",
    name: "Reve de Miel Lip Balm",
    brand: "Nuxe",
    volume: "15 g",
    description: "Питательный бальзам для губ с медом",
    price: eur(999),
    rating: 4.8,
    reviewCount: 96,
    image: IMG("1693990437531-720851467ffe"),
    tags: ["tagDrySensitive", "tagNourishing"],
    activeIngredient: { name: "ingHoneyName", shortDescription: "ingHoneyDesc" },
    category: "makeup",
    badge: "popular",
    inStock: true,
  },
  {
    id: 8,
    sku: "04506",
    name: "Capital Soleil SPF 50+ Face Fluid",
    brand: "Vichy",
    volume: "40 ml",
    description: "Солнцезащитный флюид для лица SPF 50+",
    price: eur(2250),
    rating: 4.7,
    reviewCount: 38,
    image: IMG("1707555647418-627729a66329"),
    tags: ["tagAllSkin", "tagProtection"],
    activeIngredient: { name: "ingMineralFilterName", shortDescription: "ingMineralFilterDesc" },
    category: "sunprotection",
    inStock: true,
  },
  {
    id: 9,
    sku: "02619",
    name: "Sensibio Light Soothing Cream",
    brand: "Bioderma",
    volume: "40 ml",
    description: "Успокаивающий легкий крем для чувствительной кожи",
    price: eur(2199),
    originalPrice: eur(2700),
    rating: 4.7,
    reviewCount: 41,
    image: IMG("1556228578-8c89e6adf883"),
    tags: ["tagSensitive", "tagSoothing"],
    activeIngredient: { name: "ingGlycerinName", shortDescription: "ingGlycerinDesc" },
    category: "skincare",
    badge: "discount",
    inStock: true,
  },
  {
    id: 10,
    sku: "05134",
    name: "Thermal Spring Water Facial Mist",
    brand: "Evian",
    volume: "50 ml",
    description: "Успокаивающий спрей с термальной водой Эвиана",
    price: eur(899),
    rating: 4.5,
    reviewCount: 19,
    image: IMG("1694101455025-bc2f91667841"),
    tags: ["tagAllSkin", "tagSoothing"],
    activeIngredient: { name: "ingThermalName", shortDescription: "ingThermalDesc" },
    category: "skincare",
    inStock: true,
  },
  {
    id: 11,
    sku: "03892",
    name: "Life Plankton Essence",
    brand: "Biotherm",
    volume: "175 ml",
    description: "Питающая эссенция с морским планктоном",
    price: eur(6800),
    originalPrice: eur(8200),
    rating: 4.8,
    reviewCount: 27,
    image: IMG("1699373384241-06b627ae2c8c"),
    tags: ["tagAllSkin", "tagAntiAge"],
    activeIngredient: { name: "ingPlanktonName", shortDescription: "ingPlanktonDesc" },
    category: "skincare",
    badge: "discount",
    inStock: true,
  },
  {
    id: 12,
    sku: "01423",
    name: "Eau Thermale Gentle Cleansing Gel",
    brand: "Avène",
    volume: "200 ml",
    description: "Мягкий гель для очищения с термальной водой",
    price: eur(1495),
    rating: 4.6,
    reviewCount: 73,
    image: IMG("1701992678972-d5a053ad0fb0"),
    tags: ["tagSensitive", "tagCleansing"],
    activeIngredient: { name: "ingThermalName", shortDescription: "ingThermalDesc" },
    category: "skincare",
    inStock: true,
  },
  {
    id: 13,
    sku: "04718",
    name: "Dercos Anti-Dandruff Shampoo 200ml",
    brand: "Vichy",
    volume: "200 ml",
    description: "Дерматологический шампунь против перхоти для ежедневного применения",
    price: eur(1750),
    originalPrice: eur(2200),
    rating: 4.6,
    reviewCount: 56,
    image: IMG("1701992678972-d5a053ad0fb0"),
    tags: ["tagAllSkin", "tagAntiDandruff"],
    activeIngredient: { name: "ingZincName", shortDescription: "ingZincDesc" },
    category: "haircare",
    badge: "discount",
    inStock: true,
  },
  {
    id: 14,
    sku: "05136",
    name: "Aquasource Gel Moisturizer 50ml",
    brand: "Biotherm",
    volume: "50 ml",
    description: "Лёгкий гель-крем для интенсивного увлажнения нормальной и сухой кожи",
    price: eur(3900),
    rating: 4.5,
    reviewCount: 22,
    image: IMG("1704297004675-bf0ef33713e4"),
    tags: ["tagNormalDry", "tagHydration"],
    activeIngredient: { name: "ingGlycerinName", shortDescription: "ingGlycerinDesc" },
    category: "skincare",
    inStock: true,
  },
  {
    id: 15,
    sku: "03904",
    name: "Atoderm Intensive Baume 500ml",
    brand: "Bioderma",
    volume: "500 ml",
    description: "Восстанавливающий бальзам для очень сухой и атопичной кожи тела",
    price: eur(2699),
    originalPrice: eur(3300),
    rating: 4.8,
    reviewCount: 104,
    image: IMG("1697201358649-ca8e6ecc3ac0"),
    tags: ["tagDrySensitive", "tagNourishing"],
    activeIngredient: { name: "ingSheaName", shortDescription: "ingSheaDesc" },
    category: "bodycare",
    badge: "popular",
    inStock: true,
  },
  {
    id: 16,
    sku: "04287",
    name: "Dramatically Different Moisturizing Lotion 125ml",
    brand: "Clinique",
    volume: "125 ml",
    description: "Культовый увлажняющий лосьон для укрепления кожного барьера",
    price: eur(3500),
    rating: 4.7,
    reviewCount: 68,
    image: IMG("1693990437506-dac9d69697a9"),
    tags: ["tagNormalDry", "tagHydration"],
    activeIngredient: { name: "ingNiacinamideName", shortDescription: "ingNiacinamideDesc" },
    category: "skincare",
    inStock: true,
  },
]

export const promoBarItems: Record<
  "ru" | "lv",
  Array<{ icon: "Sparkles" | "Truck" | "BadgeCheck"; text: string }>
> = {
  ru: [
    { icon: "Truck", text: "Бесплатная доставка по Латвии от 40€" },
    { icon: "BadgeCheck", text: "100% оригинальная французская косметика" },
    { icon: "Sparkles", text: "Новинки Bioderma, Vichy и Avène уже в наличии" },
  ],
  lv: [
    { icon: "Truck", text: "Bezmaksas piegāde Latvijā no 40€" },
    { icon: "BadgeCheck", text: "100% oriģināla franču kosmētika" },
    { icon: "Sparkles", text: "Jaunumi no Bioderma, Vichy un Avène jau pieejami" },
  ],
}

// ---------------------------------------------------------------------------
// Brand helpers — single source of truth for brand slugs so links (header,
// brand strip, brands page) and brand-page filtering always agree, including
// for accented names like "Avène" or hyphenated ones like "La Roche-Posay".
// ---------------------------------------------------------------------------

export const getBrandSlug = (brand: string): string =>
  brand
    .toLowerCase()
    .replace(/[èéêë]/g, "e")
    .replace(/[âäà]/g, "a")
    .replace(/[ôöò]/g, "o")
    .replace(/[ûüù]/g, "u")
    .replace(/[ïî]/g, "i")
    .replace(/[ç]/g, "c")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")

/** Number of products that belong to a given brand name. */
export const getBrandProductCount = (brand: string): number =>
  products.filter((p) => p.brand === brand).length

/** All products for a brand identified by its slug. */
export const getProductsByBrandSlug = (slug: string): Product[] =>
  products.filter((p) => getBrandSlug(p.brand) === slug)

/** Resolve the canonical brand display name from a slug (falls back to title-case). */
export const getBrandNameFromSlug = (slug: string): string => {
  const match = BRANDS_ORDERED.find((b) => getBrandSlug(b) === slug)
  if (match) return match
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

// Brands that ship with a real transparent-PNG logo in /public/brands.
const BRAND_LOGO_SLUGS = new Set([
  "bioderma",
  "vichy",
  "biotherm",
  "evian",
  "clinique",
  "nuxe",
  "avene",
  "uriage",
  "caudalie",
  "la-roche-posay",
])

/** Path to a brand's logo PNG, or null when we only have a name (fallback to monogram). */
export const getBrandLogo = (slug: string): string | null =>
  BRAND_LOGO_SLUGS.has(slug) ? `/brands/${slug}.png` : null

export interface BrandInfo {
  name: string
  slug: string
  productCount: number
  logo: string | null
}

/** Brand list in curated order, each with its product count and logo. */
export const getBrandsWithCounts = (): BrandInfo[] =>
  BRANDS_ORDERED.map((name) => {
    const slug = getBrandSlug(name)
    return {
      name,
      slug,
      productCount: getBrandProductCount(name),
      logo: getBrandLogo(slug),
    }
  })
