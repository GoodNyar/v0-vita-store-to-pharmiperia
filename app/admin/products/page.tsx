import { ProductStockForm } from '@/components/admin/product-stock-form'
import { listAdminProductStock } from '@/lib/commerce/admin-products'

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
  const products = await listAdminProductStock()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Product stock</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Inventory and activation controls. Stock also decrements on paid orders via webhook.
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-foreground">SKU</th>
              <th className="px-4 py-3 text-left font-medium text-foreground">Name (LV)</th>
              <th className="px-4 py-3 text-left font-medium text-foreground">Name (RU)</th>
              <th className="px-4 py-3 text-right font-medium text-foreground">Stock</th>
              <th className="px-4 py-3 text-left font-medium text-foreground">Stock / Active</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card">
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  No products found.
                </td>
              </tr>
            ) : (
            products.map((product) => (
              <tr key={product.id}>
                <td className="px-4 py-3 font-mono text-xs text-foreground">{product.sku}</td>
                <td className="px-4 py-3 text-foreground">{product.nameLv}</td>
                <td className="px-4 py-3 text-muted-foreground">{product.nameRu}</td>
                <td className="px-4 py-3 text-right font-medium text-foreground">
                  {product.stockQuantity}
                </td>
                <td className="px-4 py-3">
                  <ProductStockForm
                    productId={product.id}
                    initialStock={product.stockQuantity}
                    initialActive={product.isActive}
                  />
                </td>
              </tr>
            ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}