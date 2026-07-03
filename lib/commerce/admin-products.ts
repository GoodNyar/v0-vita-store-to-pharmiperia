import 'server-only'

import { createClient } from '@/lib/supabase/server'

export interface AdminProductStockItem {
  id: string
  sku: string
  nameLv: string
  nameRu: string
  stockQuantity: number
  isActive: boolean
}

type ProductStockRow = {
  id: string
  sku: string
  name_lv: string
  name_ru: string
  stock_quantity: number | null
  is_active: boolean | null
}

export async function listAdminProductStock(): Promise<AdminProductStockItem[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('id, sku, name_lv, name_ru, stock_quantity, is_active')
    .order('sku', { ascending: true })

  if (error) {
    throw new Error(`Failed to load product stock: ${error.message}`)
  }

  return ((data as ProductStockRow[] | null) ?? []).map((row) => ({
    id: row.id,
    sku: row.sku,
    nameLv: row.name_lv,
    nameRu: row.name_ru,
    stockQuantity: row.stock_quantity ?? 0,
    isActive: row.is_active ?? false,
  }))
}