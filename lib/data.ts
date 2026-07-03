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

export interface Product {
  id: number
  sku: string
  name: string
  brand: string
  volume: string
  description: string
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  image: string
  category: string
  badge?: string
  inStock: boolean
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

export const products: Product[] = [
  {
    id: 1,
    sku: "02314",
    name: "Sensibio H2O Micellar Water",
    brand: "Bioderma",
    volume: "500 ml",
    description: "Очищающая мицеллярная вода для чувствительной кожи",
    price: 18.99,
    originalPrice: 24.99,
    rating: 4.9,
    reviewCount: 24560,
    image: "/images/products/bioderma-sensibio.jpg",
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
    price: 12.50,
    rating: 4.8,
    reviewCount: 18340,
    image: "/images/products/avene-thermal.jpg",
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
    price: 29.95,
    originalPrice: 37.00,
    rating: 4.8,
    reviewCount: 15890,
    image: "/images/products/vichy-mineral89.jpg",
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
    price: 49.00,
    originalPrice: 62.00,
    rating: 4.7,
    reviewCount: 9210,
    image: "/images/products/biotherm-serum.jpg",
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
    price: 42.00,
    rating: 4.6,
    reviewCount: 11450,
    image: "/images/products/clinique-moisture.jpg",
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
    price: 34.95,
    originalPrice: 42.00,
    rating: 4.9,
    reviewCount: 20130,
    image: "/images/products/nuxe-huile.jpg",
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
    price: 9.99,
    rating: 4.8,
    reviewCount: 31200,
    image: "/images/products/nuxe-lip-balm.jpg",
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
    price: 22.50,
    rating: 4.7,
    reviewCount: 8760,
    image: "/images/products/vichy-sunscreen.jpg",
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
    price: 21.99,
    originalPrice: 27.00,
    rating: 4.7,
    reviewCount: 7430,
    image: "/images/products/bioderma-sensibio-cream.jpg",
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
    price: 8.99,
    rating: 4.5,
    reviewCount: 14200,
    image: "/images/products/evian-spray.jpg",
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
    price: 68.00,
    originalPrice: 82.00,
    rating: 4.8,
    reviewCount: 6540,
    image: "/images/products/biotherm-essence.jpg",
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
    price: 14.95,
    rating: 4.6,
    reviewCount: 9870,
    image: "/images/products/avene-cleansing.jpg",
    category: "skincare",
    inStock: true,
  },
  {
    id: 13,
    name: "Dercos Anti-Dandruff Shampoo 200ml",
    brand: "Vichy",
    price: 17.50,
    originalPrice: 22.00,
    rating: 4.6,
    reviewCount: 12300,
    image: "/images/products/vichy-shampoo.jpg",
    category: "haircare",
    badge: "discount",
    inStock: true,
  },
  {
    id: 14,
    name: "Aquasource Gel Moisturizer 50ml",
    brand: "Biotherm",
    price: 39.00,
    rating: 4.5,
    reviewCount: 5670,
    image: "/images/products/biotherm-aquasource.jpg",
    category: "skincare",
    inStock: true,
  },
  {
    id: 15,
    name: "Atoderm Intensive Baume 500ml",
    brand: "Bioderma",
    price: 26.99,
    originalPrice: 33.00,
    rating: 4.8,
    reviewCount: 10890,
    image: "/images/products/bioderma-atoderm.jpg",
    category: "bodycare",
    badge: "popular",
    inStock: true,
  },
  {
    id: 16,
    name: "Dramatically Different Moisturizing Lotion 125ml",
    brand: "Clinique",
    price: 35.00,
    rating: 4.7,
    reviewCount: 17650,
    image: "/images/products/clinique-ddml.jpg",
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
