import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getAdminProducts } from "@/lib/queries/admin";
import { AdminProductActions } from "./AdminProductActions";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; status?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const { data: products, total } = await getAdminProducts(
    page,
    20,
    params.search,
    params.status
  );
  const totalPages = Math.ceil(total / 20);

  return (
    <div>
      <h1 className="text-[24px] font-semibold tracking-tight mb-6">
        Product Moderation
      </h1>

      {/* Filters */}
      <Card variant="compact" className="mb-6">
        <form className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            name="search"
            placeholder="Search by product title..."
            defaultValue={params.search ?? ""}
            className="flex-1 min-w-[200px] px-3 py-2 text-[14px] bg-surface-input border border-border-default rounded-standard focus:outline-none focus:border-border-focus"
          />
          <select
            name="status"
            defaultValue={params.status ?? "all"}
            className="px-3 py-2 text-[14px] bg-surface-input border border-border-default rounded-standard"
          >
            <option value="all">All Products</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="featured">Featured</option>
            <option value="flash">Flash Deals</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 text-[14px] font-medium bg-mizo-red text-white rounded-standard hover:bg-mizo-red-hover transition-colors"
          >
            Filter
          </button>
        </form>
      </Card>

      {/* Products Table */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[18px] font-semibold">Products ({total})</h2>
        </div>

        {products.length === 0 ? (
          <p className="text-[14px] text-text-muted py-8 text-center">No products found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[14px]">
              <thead>
                <tr className="border-b border-border-subtle text-text-secondary">
                  <th className="text-left py-2 px-3 font-medium">Product</th>
                  <th className="text-left py-2 px-3 font-medium">Seller</th>
                  <th className="text-left py-2 px-3 font-medium">Category</th>
                  <th className="text-right py-2 px-3 font-medium">Price</th>
                  <th className="text-center py-2 px-3 font-medium">Stock</th>
                  <th className="text-center py-2 px-3 font-medium">Status</th>
                  <th className="text-right py-2 px-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-border-subtle last:border-0 hover:bg-surface-subtle transition-colors">
                    <td className="py-3 px-3">
                      <div>
                        <p className="font-medium">{product.title}</p>
                        <p className="text-[12px] text-text-muted">SKU: {product.sku ?? "—"}</p>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-text-secondary">{product.seller_name ?? "—"}</td>
                    <td className="py-3 px-3 text-text-secondary">{product.category_name ?? "—"}</td>
                    <td className="py-3 px-3 text-right font-tabular">
                      ${Number(product.price).toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`font-tabular ${product.stock_quantity <= (product.low_stock_threshold ?? 5) ? "text-error" : ""}`}>
                        {product.stock_quantity}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Badge variant={product.is_active ? "success" : "error"}>
                          {product.is_active ? "Active" : "Inactive"}
                        </Badge>
                        {product.is_featured && <Badge variant="warning">Featured</Badge>}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <AdminProductActions
                        productId={product.id}
                        isActive={product.is_active ?? true}
                        isFeatured={product.is_featured ?? false}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-border-subtle">
            {Array.from({ length: totalPages }, (_, i) => (
              <a
                key={i + 1}
                href={`?page=${i + 1}&search=${params.search ?? ""}&status=${params.status ?? "all"}`}
                className={`
                  px-3 py-1.5 text-[13px] font-medium rounded-standard transition-colors
                  ${page === i + 1
                    ? "bg-mizo-red text-white"
                    : "text-text-secondary hover:bg-surface-subtle"
                  }
                `}
              >
                {i + 1}
              </a>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
