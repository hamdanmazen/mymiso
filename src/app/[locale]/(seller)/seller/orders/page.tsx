import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getSellerOrders } from "@/lib/queries/seller-dashboard";
import { OrderTable } from "@/components/seller/OrderTable";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

interface OrdersPageProps {
  searchParams: Promise<{ status?: string; page?: string }>;
}

const STATUS_TABS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export default async function SellerOrdersPage({
  searchParams,
}: OrdersPageProps) {
  const params = await searchParams;
  const statusFilter = params.status ?? "all";
  const page = parseInt(params.page ?? "1", 10);

  const orders = await getSellerOrders(page, 20, statusFilter);

  return (
    <div>
      <h1 className="text-[24px] font-semibold tracking-tight mb-6">
        Orders
      </h1>

      {/* Status filter tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
        {STATUS_TABS.map((tab) => (
          <Link
            key={tab.value}
            href={`/seller/orders?status=${tab.value}`}
            className={`
              px-3 py-1.5 rounded-pill text-[13px] font-medium whitespace-nowrap transition-colors
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

      {/* Order list */}
      {orders.data.length > 0 ? (
        <>
          <Card className="overflow-hidden p-0">
            <OrderTable orders={orders.data} />
          </Card>

          {orders.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              {page > 1 && (
                <Link
                  href={`/seller/orders?status=${statusFilter}&page=${page - 1}`}
                >
                  <Button variant="ghost" size="sm">
                    Previous
                  </Button>
                </Link>
              )}
              <span className="text-[13px] text-text-muted">
                Page {page} of {orders.totalPages}
              </span>
              {page < orders.totalPages && (
                <Link
                  href={`/seller/orders?status=${statusFilter}&page=${page + 1}`}
                >
                  <Button variant="ghost" size="sm">
                    Next
                  </Button>
                </Link>
              )}
            </div>
          )}
        </>
      ) : (
        <Card className="text-center py-12">
          <ShoppingBag size={40} className="text-text-muted mx-auto mb-3" />
          <p className="text-[16px] text-text-secondary">
            {statusFilter !== "all"
              ? `No ${statusFilter} orders`
              : "No orders yet"}
          </p>
          <p className="text-[13px] text-text-muted mt-1">
            Orders will appear here when buyers purchase your products
          </p>
        </Card>
      )}
    </div>
  );
}
