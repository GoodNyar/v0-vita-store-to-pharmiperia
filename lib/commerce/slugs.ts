/** Normalize text for URL slugs — transliterate diacritics (ADR-0003). */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[èéêë]/g, "e")
    .replace(/[âäà]/g, "a")
    .replace(/[ôöò]/g, "o")
    .replace(/[ûüù]/g, "u")
    .replace(/[ïî]/g, "i")
    .replace(/[ç]/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

/** Brand slug — single source of truth (Avène → avene, La Roche-Posay → la-roche-posay). */
export function brandSlug(brand: string): string {
  return brand
    .toLowerCase()
    .replace(/[èéêë]/g, "e")
    .replace(/[âäà]/g, "a")
    .replace(/[ôöò]/g, "o")
    .replace(/[ûüù]/g, "u")
    .replace(/[ïî]/g, "i")
    .replace(/[ç]/g, "c")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
}

/** Product slug — unique per SKU, matches DB `products.slug`. */
export function productSlug(product: { name: string; sku: string }): string {
  const base = slugify(product.name)
  return `${base}-${product.sku.toLowerCase()}`
}