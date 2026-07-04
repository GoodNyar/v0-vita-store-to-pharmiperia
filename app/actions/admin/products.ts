'use server'

import { revalidatePath } from 'next/cache'

import { revalidateCatalogTags } from '@/lib/cache/revalidate'
import { logAdminAction } from '@/lib/admin/audit'
import { requirePermission } from '@/lib/admin/rbac'
import {
  createAdminProduct,
  deactivateAdminProduct,
  updateAdminProduct,
  type AdminProductInput,
  type AdminProductUpdateInput,
} from '@/lib/commerce/admin-products'

export async function createProductAction(
  input: AdminProductInput
): Promise<{ success: true; productId: string } | { success: false; error: string }> {
  try {
    await requirePermission('products:write')
    const product = await createAdminProduct(input)
    await logAdminAction({
      action: 'product.create',
      entityType: 'product',
      entityId: product.id,
      metadata: { sku: product.sku },
    })
    revalidatePath('/admin/products')
    await revalidateCatalogTags({ productSlug: product.slug })
    return { success: true, productId: product.id }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create product'
    return { success: false, error: message }
  }
}

export async function updateProductAction(
  productId: string,
  input: AdminProductUpdateInput
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    await requirePermission('products:write')
    const product = await updateAdminProduct(productId, input)
    await logAdminAction({
      action: 'product.update',
      entityType: 'product',
      entityId: product.id,
      metadata: { sku: product.sku, fields: Object.keys(input) },
    })
    revalidatePath('/admin/products')
    await revalidateCatalogTags({ productSlug: product.slug })
    return { success: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update product'
    return { success: false, error: message }
  }
}

export async function deactivateProductAction(
  productId: string
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    await requirePermission('products:write')
    const product = await deactivateAdminProduct(productId)
    await logAdminAction({
      action: 'product.deactivate',
      entityType: 'product',
      entityId: product.id,
      metadata: { sku: product.sku },
    })
    revalidatePath('/admin/products')
    await revalidateCatalogTags({ productSlug: product.slug })
    return { success: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to deactivate product'
    return { success: false, error: message }
  }
}