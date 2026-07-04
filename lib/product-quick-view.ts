import type { ActiveIngredient, Product } from "@/lib/data"
import type { TranslationKey } from "@/lib/i18n"

const SKIN_TYPE_TAGS: TranslationKey[] = [
  "tagSensitive",
  "tagDrySensitive",
  "tagNormalDry",
  "tagAllSkin",
  "tagProblemSkin",
]

const DEFAULT_WHY_CHOOSE: TranslationKey[] = [
  "qvWhyDaily",
  "qvWhyAbsorbs",
  "qvWhyNonSticky",
  "qvWhyDermRecommended",
]

const CATEGORY_KEYS: Record<string, TranslationKey> = {
  skincare: "skincare",
  haircare: "haircare",
  bodycare: "bodycare",
  sunprotection: "sunprotection",
  makeup: "makeup",
}

const DEFAULT_TEXTURE: TranslationKey = "textureLightGel"
const DEFAULT_APPLICATION: TranslationKey = "applicationMorningEvening"
const DEFAULT_FREE_FROM: TranslationKey = "qvFreeFromDefault"

/** Gallery images — falls back to main packshot. */
export function getProductImages(product: Product): string[] {
  if (product.images?.length) return product.images
  return [product.image || "/placeholder.svg"]
}

/** All active ingredients for the quick-view block. */
export function getActiveIngredients(product: Product): ActiveIngredient[] {
  if (product.activeIngredients?.length) return product.activeIngredients
  if (product.activeIngredient) return [product.activeIngredient]
  return []
}

/** Short ingredient title without the "Contains …" prefix. */
export function formatIngredientTitle(
  nameKey: string,
  t: (key: TranslationKey) => string,
  lang: "ru" | "lv"
): string {
  const full = t(nameKey as TranslationKey)
  if (lang === "ru") return full.replace(/^Содержит\s+/i, "")
  return full.replace(/^Satur\s+/i, "")
}

/** Comma-separated actives for info card, e.g. "Ниацинамид + Цинк". */
export function formatActivesSummary(
  product: Product,
  t: (key: TranslationKey) => string,
  lang: "ru" | "lv"
): string {
  const ings = getActiveIngredients(product).slice(0, 2)
  if (!ings.length) return "—"
  return ings
    .map((ing) => formatIngredientTitle(ing.name, t, lang))
    .join(" + ")
}

/** Skin-type line derived from product tags. */
export function getSkinTypeTag(product: Product): TranslationKey {
  const match = product.tags?.find((tag) =>
    SKIN_TYPE_TAGS.includes(tag as TranslationKey)
  )
  return (match as TranslationKey) ?? "tagAllSkin"
}

/** Benefit badges — excludes pure skin-type tags when possible. */
export function getBenefitTags(product: Product): TranslationKey[] {
  const tags = (product.tags ?? []) as TranslationKey[]
  const benefits = tags.filter((tag) => !SKIN_TYPE_TAGS.includes(tag))
  const source = benefits.length > 0 ? benefits : tags
  return source.slice(0, 3)
}

export function getCategoryKey(product: Product): TranslationKey {
  return CATEGORY_KEYS[product.category] ?? "skincare"
}

export function getWhyChooseKeys(product: Product): TranslationKey[] {
  return product.whyChoose?.length
    ? (product.whyChoose as TranslationKey[])
    : DEFAULT_WHY_CHOOSE
}

export function getProductTags(product: Product): TranslationKey[] {
  return (product.tags ?? []) as TranslationKey[]
}

export function getTextureKey(product: Product): TranslationKey {
  return (product.texture as TranslationKey) ?? DEFAULT_TEXTURE
}

export function getApplicationKey(product: Product): TranslationKey {
  return (product.application as TranslationKey) ?? DEFAULT_APPLICATION
}

export function getFreeFromKey(product: Product): TranslationKey {
  return (product.freeFrom as TranslationKey) ?? DEFAULT_FREE_FROM
}