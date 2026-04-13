import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  Users,
  Store,
  Package,
  ShoppingBag,
  DollarSign,
  Clock,
  CheckCircle,
  ShieldCheck,
} from "lucide-react";
import { getAdminStats, getAdminRecentOrders } from "@/lib/queries/admin";

const statusColors: Record<string, "success" | "warning" | "error" | "info"> = {
  pending: "warning",
  confirmed: "info",
  processing: "info",
  shipped: "info",
  delivered: "success",
  cancelled: "error",
  refunded: "error",
};

export default async function AdminDashboardPage() {
  const [stats, recentOrders] = await Promise.all([
    getAdminStats(),
    getAdminRecentOrders(10),
  ]);

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, icon: Users },
    { label: "Total Sellers", value: stats.totalSellers, icon: Store, sub: `${stats.verifiedSellers} verified` },
    { label: "Total Products", value: stats.totalProducts, icon: Package, sub: `${stats.activeProducts} active` },
    { label: "Total Orders", value: stats.totalOrders, icon: ShoppingBag, sub: `${stats.pendingOrders} pending` },
    {
      label: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
    },
  ];

  return (
    <div>
      <h1 className="text-[24px] font-semibold tracking-tight mb-6">
        Admin Dashboard
      </h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} variant="compact">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] text-text-secondary">{stat.label}</span>
                <Icon size={16} className="text-text-muted" />
              </div>
              <p className="text-[22px] font-bold font-tabular tracking-tight">
                {stat.value}
              </p>
              {"sub" in stat && stat.sub && (
                <p className="text-[12px] text-text-muted mt-1">{stat.sub}</p>
              )}
            </Card>
          );
        })}
      </div>

      {/* Recent Orders */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[18px] font-semibold">Recent Orders</h2>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-[14px] text-text-muted py-8 text-center">No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[14px]">
              <thead>
                <tr className="border-b border-border-subtle text-text-secondary">
                  <th className="text-left py-2 px-3 font-medium">Order</th>
                  <th className="text-left py-2 px-3 font-medium">Buyer</th>
                  <th className="text-left py-2 px-3 font-medium">Seller</th>
                  <th className="text-left py-2 px-3 font-medium">Status</th>
                  <th className="text-right py-2 px-3 font-medium">Total</th>
                  <th className="text-right py-2 px-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border-subtle last:border-0 hover:bg-surface-subtle transition-colors">
                    <td className="py-3 px-3 font-medium font-tabular">{order.order_number}</td>
                    <td className="py-3 px-3 text-text-secondary">{order.buyer_name ?? "—"}</td>
                    <td className="py-3 px-3 text-text-secondary">{order.seller_name ?? "—"}</td>
                    <td className="py-3 px-3">
                      <Badge variant={statusColors[order.status] ?? "info"}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right font-tabular">
                      ${Number(order.total).toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right text-text-muted">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
