import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getSellerAnalytics } from "@/lib/queries/seller-dashboard";
import { formatPrice } from "@/lib/utils/formatPrice";
import { BarChart3, TrendingUp, ShoppingBag, DollarSign } from "lucide-react";

const STATUS_COLORS: Record<string, "success" | "warning" | "error" | "info"> = {
  pending: "warning",
  confirmed: "info",
  processing: "info",
  shipped: "info",
  delivered: "success",
  cancelled: "error",
  refunded: "error",
};

export default async function SellerAnalyticsPage() {
  const analytics = await getSellerAnalytics();

  const totalRevenue = analytics.revenueByDay.reduce(
    (sum, d) => sum + d.revenue,
    0
  );
  const totalOrders = analytics.revenueByDay.reduce(
    (sum, d) => sum + d.orders,
    0
  );
  const maxDayRevenue = Math.max(
    ...analytics.revenueByDay.map((d) => d.revenue),
    1
  );

  return (
    <div>
      <h1 className="text-[24px] font-semibold tracking-tight mb-6">
        Analytics
      </h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card variant="compact">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] text-text-secondary">
              Revenue (30d)
            </span>
            <DollarSign size={16} className="text-text-muted" />
          </div>
          <p className="text-[24px] font-bold font-tabular tracking-tight">
            {formatPrice(totalRevenue)}
          </p>
        </Card>
        <Card variant="compact">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] text-text-secondary">
              Orders (30d)
            </span>
            <ShoppingBag size={16} className="text-text-muted" />
          </div>
          <p className="text-[24px] font-bold font-tabular tracking-tight">
            {totalOrders}
          </p>
        </Card>
        <Card variant="compact">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] text-text-secondary">
              Avg. Order Value
            </span>
            <TrendingUp size={16} className="text-text-muted" />
          </div>
          <p className="text-[24px] font-bold font-tabular tracking-tight">
            {formatPrice(analytics.averageOrderValue)}
          </p>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue chart (bar chart using divs) */}
        <Card>
          <h2 className="text-[18px] font-semibold mb-4 flex items-center gap-2">
            <BarChart3 size={18} className="text-text-muted" /> Daily Revenue
          </h2>
          {analytics.revenueByDay.length > 0 ? (
            <div className="space-y-2">
              {analytics.revenueByDay.map((day) => (
                <div key={day.date} className="flex items-center gap-3">
                  <span className="text-[12px] text-text-muted font-tabular w-20 shrink-0">
                    {new Date(day.date + "T00:00:00").toLocaleDateString(
                      "en-US",
                      { month: "short", day: "numeric" }
                    )}
                  </span>
                  <div className="flex-1 h-6 bg-surface-subtle rounded-compact overflow-hidden">
                    <div
                      className="h-full bg-mizo-teal/70 rounded-compact transition-all duration-300"
                      style={{
                        width: `${Math.max((day.revenue / maxDayRevenue) * 100, 2)}%`,
                      }}
                    />
                  </div>
                  <span className="text-[12px] font-tabular text-text-secondary w-16 text-right shrink-0">
                    {formatPrice(day.revenue)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[14px] text-text-muted py-6 text-center">
              No revenue data yet
            </p>
          )}
        </Card>

        {/* Top products */}
        <Card>
          <h2 className="text-[18px] font-semibold mb-4">Top Products</h2>
          {analytics.topProducts.length > 0 ? (
            <div className="space-y-3">
              {analytics.topProducts.map((product, i) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 p-3 rounded-comfortable bg-surface-subtle"
                >
                  <span className="w-6 h-6 rounded-circle bg-surface-overlay flex items-center justify-center text-[12px] font-bold text-text-muted shrink-0">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-medium truncate">
                      {product.title}
                    </p>
                    <p className="text-[12px] text-text-muted">
                      {product.total_sold} sold &middot;{" "}
                      {formatPrice(product.revenue)} revenue
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[14px] text-text-muted py-6 text-center">
              No sales data yet
            </p>
          )}
        </Card>

        {/* Orders by status */}
        <Card className="lg:col-span-2">
          <h2 className="text-[18px] font-semibold mb-4">
            Orders by Status (30d)
          </h2>
          {Object.keys(analytics.ordersByStatus).length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {Object.entries(analytics.ordersByStatus).map(
                ([status, count]) => (
                  <div
                    key={status}
                    className="flex items-center gap-2 px-4 py-3 rounded-comfortable bg-surface-subtle"
                  >
                    <Badge variant={STATUS_COLORS[status] ?? "info"}>
                      {status}
                    </Badge>
                    <span className="text-[18px] font-bold font-tabular">
                      {count}
                    </span>
                  </div>
                )
              )}
            </div>
          ) : (
            <p className="text-[14px] text-text-muted py-6 text-center">
              No orders yet
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
