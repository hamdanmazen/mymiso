import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import { getSellerProducts } from "@/lib/queries/seller-dashboard";
import { formatPrice } from "@/lib/utils/formatPrice";
import {
  Plus,
  Package,
  Search,
  Edit2,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getProductThumbnailUrl } from "@/lib/utils/images";

interface ProductsPageProps {
  searchParams: Promise<{ page?: string; search?: string; status?: string }>;
}

const STATUS_TABS = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

export default async function SellerProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page ?? "1", 10);
  const search = params.search;
  const statusFilter = (params.status as "all" | "active" | "inactive") ?? "all";

  const products = await getSellerProducts(page, 20, search, statusFilter);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[24px] font-semibold tracking-tight">Products</h1>
        <Link href="/seller/products/new">
          <Button size="sm">
            <Plus size={16} /> Add Product
          </Button>
        </Link>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <form className="relative flex-1" action="/seller/products">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Search products..."
            className="w-full bg-surface-input border border-border-default rounded-comfortable pl-9 pr-4 py-2.5 text-[14px] text-text-primary placeholder:text-text-muted focus-ring"
          />
          {statusFilter !== "all" && (
            <input type="hidden" name="status" value={statusFilter} />
          )}
        </form>
        <div className="flex gap-1">
          {STATUS_TABS.map((tab) => (
            <Link
              key={tab.value}
              href={`/seller/products?status=${tab.value}${search ? `&search=${search}` : ""}`}
              className={`
                px-3 py-2 rounded-comfortable text-[13px] font-medium whitespace-nowrap transition-colors
                ${
                  statusFilter === tab.value
                    ? "bg-mizo-red text-white"
                    : "bg-surface-subtle text-text-secondary hover:text-text-primary"
                }
              `}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Product table */}
      {products.data.length > 0 ? (
        <>
          <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-subtle bg-surface-subtle">
                    <th className="text-left text-[12px] font-semibold text-text-muted uppercase tracking-wider px-4 py-3">
                      Product
                    </th>
                    <th className="text-left text-[12px] font-semibold text-text-muted uppercase tracking-wider px-4 py-3 hidden sm:table-cell">
                      Status
                    </th>
                    <th className="text-right text-[12px] font-semibold text-text-muted uppercase tracking-wider px-4 py-3">
                      Price
                    </th>
                    <th className="text-right text-[12px] font-semibold text-text-muted uppercase tracking-wider px-4 py-3 hidden md:table-cell">
                      Stock
                    </th>
                    <th className="text-right text-[12px] font-semibold text-text-muted uppercase tracking-wider px-4 py-3 hidden lg:table-cell">
                      Sold
                    </th>
                    <th className="text-right text-[12px] font-semibold text-text-muted uppercase tracking-wider px-4 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.data.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-border-subtle last:border-0 hover:bg-surface-subtle/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-comfortable bg-surface-subtle overflow-hidden shrink-0">
                            <img
                              src={
                                product.thumbnail_url ||
                                getProductThumbnailUrl(product.id)
                              }
                              alt={product.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[14px] font-medium truncate max-w-[200px] lg:max-w-[300px]">
                              {product.title}
                            </p>
                            <p className="text-[12px] text-text-muted">
                              {product.category_name ?? "Uncategorized"}
                              {product.sku && ` · ${product.sku}`}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        {product.is_active ? (
                          <Badge variant="success">
                            <Eye size={10} /> Active
                          </Badge>
                        ) : (
                          <Badge variant="warning">
                            <EyeOff size={10} /> Hidden
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-[14px] font-semibold font-tabular">
                          {formatPrice(product.price)}
                        </span>
                        {product.compare_at_price && (
                          <span className="text-[12px] text-text-muted line-through ml-1">
                            {formatPrice(product.compare_at_price)}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right hidden md:table-cell">
                        <span
                          className={`text-[14px] font-tabular ${
                            product.stock_quantity <= product.low_stock_threshold
                              ? product.stock_quantity === 0
                                ? "text-error font-semibold"
                                : "text-warning font-semibold"
                              : "text-text-primary"
                          }`}
                        >
                          {product.stock_quantity}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right hidden lg:table-cell">
                        <span className="text-[14px] text-text-secondary font-tabular">
                          {product.total_sold}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/seller/products/${product.id}/edit`}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[12px] font-medium text-text-secondary hover:text-mizo-teal rounded-comfortable hover:bg-mizo-teal-subtle transition-colors"
                        >
                          <Edit2 size={12} /> Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {products.totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={products.totalPages}
              className="mt-6"
            />
          )}
        </>
      ) : (
        <Card className="text-center py-12">
          <Package size={40} className="text-text-muted mx-auto mb-3" />
          <p className="text-[16px] text-text-secondary">
            {search
              ? "No products match your search"
              : "No products yet"}
          </p>
          <p className="text-[13px] text-text-muted mt-1">
            {search
              ? "Try a different search term"
              : "Add your first product to start selling"}
          </p>
          {!search && (
            <Link href="/seller/products/new" className="inline-block mt-4">
              <Button size="sm">
                <Plus size={16} /> Add Product
              </Button>
            </Link>
          )}
        </Card>
      )}
    </div>
  );
}
