import { products } from "@/lib/data"
import { productSlug } from "./slugs"

/**
 * Registry of legacy numeric product URLs → canonical slugs (ADR-0003).
 * Used by middleware for permanent 301 redirects.
 */
export const LEGACY_PRODUCT_ID_REDIRECTS: Readonly<Record<string, string>> =
  Object.fromEntries(products.map((product) => [String(product.id), productSlug(product)]))