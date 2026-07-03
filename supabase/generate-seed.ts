/**
 * Generates supabase/seed.sql from lib/data.ts + i18n category/description maps.
 * Run: pnpm db:seed:generate
 */
import { writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import {
  catalogSeedBrandUuid,
  catalogSeedCategoryUuid,
  catalogSeedProductUuid,
} from "../lib/catalog-seed"
import {
  BRANDS_ORDERED,
  categories,
  getBrandSlug,
  products,
  type Product,
} from "../lib/data"
import { productSlug } from "../lib/commerce/slugs"
import { productDescriptions } from "../lib/i18n"

const CATEGORY_LV: Record<string, string> = {
  skincare: "Seja",
  haircare: "Mati",
  bodycare: "Ķermenis",
  sunprotection: "Saules aizsardzība",
  makeup: "Dekoratīvā kosmētika",
  mencare: "Vīriešiem",
  womencare: "Sievietēm",
}

const PRODUCT_LV_DESC: Record<number, string> = {
  13: "Dermatologiskais šampūns pret blaugznām ikdienas lietošanai",
  14: "Viegls želejas krēms intensīvai mitrināšanai normālai un sausai ādai",
  15: "Atjaunojošs balzams ļoti sausai un atopiskai ķermeņa ādai",
  16: "Kultais mitrinošais losjons ādas barjeras stiprināšanai",
}

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

function sqlStr(value: string): string {
  return `'${value.replace(/'/g, "''")}'`
}

function descFor(product: Product): { ru: string; lv: string } {
  const fromI18n = productDescriptions[String(product.id) as keyof typeof productDescriptions]
  if (fromI18n) {
    return { ru: fromI18n.ru, lv: fromI18n.lv }
  }
  return {
    ru: product.description,
    lv: PRODUCT_LV_DESC[product.id] ?? product.description,
  }
}

const lines: string[] = [
  "-- Pharmiperia catalog seed (generated from lib/data.ts — ADR-0001)",
  "-- Regenerate: pnpm db:seed:generate",
  "-- Apply: pnpm db:reset",
  "",
  "BEGIN;",
  "",
  "TRUNCATE TABLE product_images, order_items, favorites, reviews, products, categories, brands RESTART IDENTITY CASCADE;",
  "",
  "-- Brands",
  "INSERT INTO brands (id, slug, name, logo_url, country, is_featured) VALUES",
]

const brandRows = BRANDS_ORDERED.map((name, index) => {
  const slug = getBrandSlug(name)
  const logo = BRAND_LOGO_SLUGS.has(slug) ? `/brands/${slug}.png` : null
  const id = catalogSeedBrandUuid(index + 1)
  return `  (${sqlStr(id)}, ${sqlStr(slug)}, ${sqlStr(name)}, ${logo ? sqlStr(logo) : "NULL"}, 'France', true)`
})

lines.push(brandRows.join(",\n") + ";")
lines.push("")
lines.push("-- Categories (product taxonomy; excludes navigation-only \"brands\")")

const catalogCategories = categories.filter((c) => c.id !== "brands")
lines.push(
  "INSERT INTO categories (id, slug, name_ru, name_lv, sort_order) VALUES"
)

const categoryRows = catalogCategories.map((cat, index) => {
  const id = catalogSeedCategoryUuid(index + 1)
  const nameLv = CATEGORY_LV[cat.id] ?? cat.name
  return `  (${sqlStr(id)}, ${sqlStr(cat.id)}, ${sqlStr(cat.name)}, ${sqlStr(nameLv)}, ${index + 1})`
})

lines.push(categoryRows.join(",\n") + ";")
lines.push("")
lines.push("-- Products")

const brandIdBySlug = Object.fromEntries(
  BRANDS_ORDERED.map((name, index) => [getBrandSlug(name), catalogSeedBrandUuid(index + 1)])
)

const categoryIdBySlug = Object.fromEntries(
  catalogCategories.map((cat, index) => [cat.id, catalogSeedCategoryUuid(index + 1)])
)

lines.push(
  `INSERT INTO products (
  id, sku, slug, name_ru, name_lv, description_ru, description_lv,
  brand_id, category_id, price_cents, original_price_cents, currency, volume,
  stock_quantity, is_active, is_featured, is_bestseller, rating, review_count
) VALUES`
)

const productRows = products.map((product) => {
  const id = catalogSeedProductUuid(product.id)
  const desc = descFor(product)
  const brandId = brandIdBySlug[getBrandSlug(product.brand)]
  const categoryId = categoryIdBySlug[product.category]
  const isBestseller = product.badge === "bestSeller"
  const isFeatured = product.badge === "popular" || product.badge === "topRated"

  return `  (${sqlStr(id)}, ${sqlStr(product.sku)}, ${sqlStr(productSlug(product))}, ${sqlStr(product.name)}, ${sqlStr(product.name)}, ${sqlStr(desc.ru)}, ${sqlStr(desc.lv)}, ${sqlStr(brandId)}, ${sqlStr(categoryId)}, ${product.price.amount}, ${product.originalPrice ? product.originalPrice.amount : "NULL"}, 'EUR', ${sqlStr(product.volume)}, ${product.inStock ? 100 : 0}, ${product.inStock}, ${isFeatured}, ${isBestseller}, ${product.rating.toFixed(1)}, ${product.reviewCount})`
})

lines.push(productRows.join(",\n") + ";")
lines.push("")
lines.push("-- Product images")

const imageRows: string[] = []
for (const product of products) {
  const productId = catalogSeedProductUuid(product.id)
  const urls = product.images?.length ? product.images : [product.image]
  urls.forEach((url, index) => {
    const imageId = `e1000001-0000-4000-8000-${(product.id * 10 + index).toString(16).padStart(12, "0")}`
    imageRows.push(
      `  (${sqlStr(imageId)}, ${sqlStr(productId)}, ${sqlStr(url)}, ${index}, ${index === 0})`
    )
  })
}

lines.push(
  "INSERT INTO product_images (id, product_id, image_url, sort_order, is_primary) VALUES"
)
lines.push(imageRows.join(",\n") + ";")
lines.push("")
lines.push("COMMIT;")
lines.push("")

const outPath = resolve(dirname(fileURLToPath(import.meta.url)), "seed.sql")
writeFileSync(outPath, lines.join("\n"), "utf8")
console.log(`Wrote ${outPath} (${products.length} products, ${BRANDS_ORDERED.length} brands, ${catalogCategories.length} categories)`)