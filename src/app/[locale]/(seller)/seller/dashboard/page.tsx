import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  DollarSign,
  Package,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import {
  getSellerDashboardStats,
  getSellerRecentOrders,
  getSellerLowStockProducts,
} from "@/lib/queries/seller-dashboard";
import { formatPrice } from "@/lib/utils/formatPrice";
import { formatDate } from "@/lib/utils/formatDate";

const STATUS_COLORS: Record<string, "success" | "warning" | "error" | "info"> = {
  pending: "warning",
  confirmed: "info",
  processing: "info",
  shipped: "info",
  delivered: "success",
  cancelled: "error",
  refunded: "error",
};

export default async function SellerDashboardPage() {
  const [stats, recentOrders, lowStock] = await Promise.all([
    getSellerDashboardStats(),
    getSellerRecentOrders(5),
    getSellerLowStockProducts(5),
  ]);

  const statCards = [
    {
      label: "Revenue (30d)",
      value: formatPrice(stats.totalRevenue),
      icon: DollarSign,
      change: stats.revenueChange,
    },
    {
      label: "Orders (30d)",
      value: String(stats.totalOrders),
      icon: ShoppingBag,
      change: stats.ordersChange,
    },
    {
      label: "Products",
      value: String(stats.totalProducts),
      icon: Package,
      change: null,
    },
    {
      label: "Pending",
      value: String(stats.pendingOrders),
      icon: TrendingUp,
      change: null,
    },
  ];

  return (
    <div>
      <h1 className="text-[24px] font-semibold tracking-tight mb-6">
        Seller Dashboard
      </h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} variant="compact">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] text-text-secondary">
                  {stat.label}
                </span>
                <Icon size={16} className="text-text-muted" />
              </div>
              <p className="text-[24px] font-bold font-tabular tracking-tight">
                {stat.value}
              </p>
              {stat.change !== null && stat.change !== 0 && (
                <p
                  className={`text-[12px] mt-1 ${stat.change > 0 ? "text-success" : "text-error"}`}
                >
                  {stat.change > 0 ? "+" : ""}
                  {stat.change}% vs prev 30d
                </p>
              )}
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[18px] font-semibold">Recent Orders</h2>
            <Link
              href="/seller/orders"
              className="text-[13px] text-mizo-teal hover:underline flex items-center gap-1"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>
          {recentOrders.length > 0 ? (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 rounded-comfortable bg-surface-subtle"
                >
                  <div className="min-w-0">
                    <p className="text-[14px] font-medium truncate">
                      {order.order_number}
                    </p>
                    <p className="text-[12px] text-text-muted">
                      {order.buyer_name ?? "Guest"} &middot;{" "}
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Badge variant={STATUS_COLORS[order.status] ?? "info"}>
                      {order.status}
                    </Badge>
                    <span className="text-[14px] font-semibold font-tabular">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[14px] text-text-muted py-6 text-center">
              No orders yet. They&apos;ll appear here when buyers purchase your
              products.
            </p>
          )}
        </Card>

        {/* Low stock alerts */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[18px] font-semibold flex items-center gap-2">
              {stats.lowStockCount > 0 && (
                <AlertTriangle size={16} className="text-warning" />
              )}
              Low Stock Alerts
            </h2>
            <Link
              href="/seller/inventory"
              className="text-[13px] text-mizo-teal hover:underline flex items-center gap-1"
            >
              Manage <ArrowRight size={14} />
            </Link>
          </div>
          {lowStock.length > 0 ? (
            <div className="space-y-3">
              {lowStock.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-comfortable bg-surface-subtle"
                >
                  <div className="min-w-0">
                    <p className="text-[14px] font-medium truncate">
                      {item.title}
                    </p>
                    <p className="text-[12px] text-text-muted">
                      SKU: {item.sku ?? "—"}
                    </p>
                  </div>
                  <Badge
                    variant={item.stock_quantity === 0 ? "error" : "warning"}
                  >
                    {item.stock_quantity === 0
                      ? "Out of stock"
                      : `${item.stock_quantity} left`}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[14px] text-text-muted py-6 text-center">
              All products are well-stocked.
            </p>
          )}
        </Card>
      </div>

      {/* Quick actions */}
      {stats.totalProducts === 0 && (
        <Card className="mt-6">
          <h2 className="text-[18px] font-semibold mb-4">Getting Started</h2>
          <div className="space-y-3">
            <Link
              href="/seller/products/new"
              className="flex items-center gap-3 p-3 rounded-comfortable bg-surface-subtle hover:bg-mizo-teal-subtle transition-colors"
            >
              <div className="w-6 h-6 rounded-circle bg-mizo-teal-subtle flex items-center justify-center text-[12px] font-bold text-mizo-teal">
                1
              </div>
              <p className="text-[14px] text-text-primary font-medium">
                Add your first product
              </p>
            </Link>
            <Link
              href="/seller/settings"
              className="flex items-center gap-3 p-3 rounded-comfortable bg-surface-subtle hover:bg-surface-overlay transition-colors"
            >
              <div className="w-6 h-6 rounded-circle bg-surface-overlay flex items-center justify-center text-[12px] font-bold text-text-muted">
                2
              </div>
              <p className="text-[14px] text-text-muted">
                Customize your shop
              </p>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
