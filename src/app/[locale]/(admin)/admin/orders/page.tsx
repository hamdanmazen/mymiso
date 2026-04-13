import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getAdminOrders } from "@/lib/queries/admin";
import { AdminOrderActions } from "./AdminOrderActions";

const statusColors: Record<string, "success" | "warning" | "error" | "info"> = {
  pending: "warning",
  confirmed: "info",
  processing: "info",
  shipped: "info",
  delivered: "success",
  cancelled: "error",
  refunded: "error",
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; status?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const { data: orders, total } = await getAdminOrders(
    page,
    20,
    params.search,
    params.status
  );
  const totalPages = Math.ceil(total / 20);

  return (
    <div>
      <h1 className="text-[24px] font-semibold tracking-tight mb-6">
        Order Oversight
      </h1>

      {/* Filters */}
      <Card variant="compact" className="mb-6">
        <form className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            name="search"
            placeholder="Search by order number..."
            defaultValue={params.search ?? ""}
            className="flex-1 min-w-[200px] px-3 py-2 text-[14px] bg-surface-input border border-border-default rounded-standard focus:outline-none focus:border-border-focus"
          />
          <select
            name="status"
            defaultValue={params.status ?? "all"}
            className="px-3 py-2 text-[14px] bg-surface-input border border-border-default rounded-standard"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 text-[14px] font-medium bg-mizo-red text-white rounded-standard hover:bg-mizo-red-hover transition-colors"
          >
            Filter
          </button>
        </form>
      </Card>

      {/* Orders Table */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[18px] font-semibold">Orders ({total})</h2>
        </div>

        {orders.length === 0 ? (
          <p className="text-[14px] text-text-muted py-8 text-center">No orders found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[14px]">
              <thead>
                <tr className="border-b border-border-subtle text-text-secondary">
                  <th className="text-left py-2 px-3 font-medium">Order</th>
                  <th className="text-left py-2 px-3 font-medium">Buyer</th>
                  <th className="text-left py-2 px-3 font-medium">Seller</th>
                  <th className="text-center py-2 px-3 font-medium">Items</th>
                  <th className="text-left py-2 px-3 font-medium">Payment</th>
                  <th className="text-left py-2 px-3 font-medium">Status</th>
                  <th className="text-right py-2 px-3 font-medium">Total</th>
                  <th className="text-right py-2 px-3 font-medium">Date</th>
                  <th className="text-right py-2 px-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-border-subtle last:border-0 hover:bg-surface-subtle transition-colors">
                    <td className="py-3 px-3 font-medium font-tabular">{order.order_number}</td>
                    <td className="py-3 px-3 text-text-secondary">{order.buyer_name ?? "—"}</td>
                    <td className="py-3 px-3 text-text-secondary">{order.seller_name ?? "—"}</td>
                    <td className="py-3 px-3 text-center font-tabular">{order.item_count}</td>
                    <td className="py-3 px-3 text-text-secondary uppercase text-[12px]">
                      {order.payment_method}
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant={statusColors[order.status ?? ""] ?? "info"}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right font-tabular">
                      ${Number(order.total).toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right text-text-muted">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <AdminOrderActions
                        orderId={order.id}
                        currentStatus={order.status ?? "pending"}
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
