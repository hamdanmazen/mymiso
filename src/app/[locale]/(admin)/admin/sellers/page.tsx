import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getAdminSellers } from "@/lib/queries/admin";
import { AdminSellerActions } from "./AdminSellerActions";

export default async function AdminSellersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; verified?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const { data: sellers, total } = await getAdminSellers(
    page,
    20,
    params.search,
    params.verified
  );
  const totalPages = Math.ceil(total / 20);

  return (
    <div>
      <h1 className="text-[24px] font-semibold tracking-tight mb-6">
        Seller Management
      </h1>

      {/* Filters */}
      <Card variant="compact" className="mb-6">
        <form className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            name="search"
            placeholder="Search by shop name..."
            defaultValue={params.search ?? ""}
            className="flex-1 min-w-[200px] px-3 py-2 text-[14px] bg-surface-input border border-border-default rounded-standard focus:outline-none focus:border-border-focus"
          />
          <select
            name="verified"
            defaultValue={params.verified ?? "all"}
            className="px-3 py-2 text-[14px] bg-surface-input border border-border-default rounded-standard"
          >
            <option value="all">All Sellers</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 text-[14px] font-medium bg-mizo-red text-white rounded-standard hover:bg-mizo-red-hover transition-colors"
          >
            Filter
          </button>
        </form>
      </Card>

      {/* Sellers Table */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[18px] font-semibold">Sellers ({total})</h2>
        </div>

        {sellers.length === 0 ? (
          <p className="text-[14px] text-text-muted py-8 text-center">No sellers found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[14px]">
              <thead>
                <tr className="border-b border-border-subtle text-text-secondary">
                  <th className="text-left py-2 px-3 font-medium">Shop</th>
                  <th className="text-left py-2 px-3 font-medium">Owner</th>
                  <th className="text-left py-2 px-3 font-medium">Country</th>
                  <th className="text-center py-2 px-3 font-medium">Products</th>
                  <th className="text-center py-2 px-3 font-medium">Orders</th>
                  <th className="text-center py-2 px-3 font-medium">Rating</th>
                  <th className="text-center py-2 px-3 font-medium">Verified</th>
                  <th className="text-right py-2 px-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sellers.map((seller) => (
                  <tr key={seller.id} className="border-b border-border-subtle last:border-0 hover:bg-surface-subtle transition-colors">
                    <td className="py-3 px-3">
                      <div>
                        <p className="font-medium">{seller.shop_name}</p>
                        <p className="text-[12px] text-text-muted">/{seller.shop_slug}</p>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-text-secondary">{seller.owner_name ?? "—"}</td>
                    <td className="py-3 px-3 text-text-secondary">{seller.country ?? "—"}</td>
                    <td className="py-3 px-3 text-center font-tabular">{seller.product_count}</td>
                    <td className="py-3 px-3 text-center font-tabular">{seller.order_count}</td>
                    <td className="py-3 px-3 text-center font-tabular">
                      {Number(seller.rating_average).toFixed(1)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <Badge variant={seller.is_verified ? "success" : "warning"}>
                        {seller.is_verified ? "Verified" : "Pending"}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <AdminSellerActions
                        sellerId={seller.id}
                        isVerified={seller.is_verified ?? false}
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
                href={`?page=${i + 1}&search=${params.search ?? ""}&verified=${params.verified ?? "all"}`}
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
