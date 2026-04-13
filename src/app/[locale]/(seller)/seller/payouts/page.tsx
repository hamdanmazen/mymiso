import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils/formatPrice";
import { getSellerDashboardStats } from "@/lib/queries/seller-dashboard";
import { Wallet, CreditCard, Banknote, Clock } from "lucide-react";

export default async function SellerPayoutsPage() {
  const stats = await getSellerDashboardStats();

  // Payout data would come from Whish/Tap APIs in production
  // For now, show a summary based on order data
  const platformFeeRate = 0.1; // 10%
  const estimatedPayout = stats.totalRevenue * (1 - platformFeeRate);
  const platformFees = stats.totalRevenue * platformFeeRate;

  return (
    <div>
      <h1 className="text-[24px] font-semibold tracking-tight mb-6">
        Payouts
      </h1>

      {/* Payout summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card variant="compact">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] text-text-secondary">
              Total Revenue
            </span>
            <Wallet size={16} className="text-text-muted" />
          </div>
          <p className="text-[24px] font-bold font-tabular tracking-tight">
            {formatPrice(stats.totalRevenue)}
          </p>
        </Card>
        <Card variant="compact">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] text-text-secondary">
              Platform Fees
            </span>
            <CreditCard size={16} className="text-text-muted" />
          </div>
          <p className="text-[24px] font-bold font-tabular tracking-tight text-error">
            -{formatPrice(platformFees)}
          </p>
          <p className="text-[12px] text-text-muted mt-1">10% commission</p>
        </Card>
        <Card variant="compact">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] text-text-secondary">Net Payout</span>
            <Banknote size={16} className="text-text-muted" />
          </div>
          <p className="text-[24px] font-bold font-tabular tracking-tight text-success">
            {formatPrice(estimatedPayout)}
          </p>
        </Card>
        <Card variant="compact">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] text-text-secondary">
              Pending
            </span>
            <Clock size={16} className="text-text-muted" />
          </div>
          <p className="text-[24px] font-bold font-tabular tracking-tight">
            {stats.pendingOrders}
          </p>
          <p className="text-[12px] text-text-muted mt-1">orders awaiting settlement</p>
        </Card>
      </div>

      {/* Payout methods */}
      <Card className="mb-6">
        <h2 className="text-[18px] font-semibold mb-4">Payment Methods</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-comfortable border border-border-default">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-comfortable bg-mizo-teal-subtle flex items-center justify-center">
                <Wallet size={18} className="text-mizo-teal" />
              </div>
              <div>
                <p className="text-[14px] font-medium">Whish Pay</p>
                <p className="text-[12px] text-text-muted">
                  Wallet transfers, agent payouts
                </p>
              </div>
            </div>
            <Badge variant="info">Primary</Badge>
          </div>
          <div className="flex items-center justify-between p-4 rounded-comfortable border border-border-default">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-comfortable bg-surface-subtle flex items-center justify-center">
                <CreditCard size={18} className="text-text-muted" />
              </div>
              <div>
                <p className="text-[14px] font-medium">Tap Payments</p>
                <p className="text-[12px] text-text-muted">
                  Card payment splits via Destinations API
                </p>
              </div>
            </div>
            <Badge variant="warning">Not configured</Badge>
          </div>
          <div className="flex items-center justify-between p-4 rounded-comfortable border border-border-default">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-comfortable bg-surface-subtle flex items-center justify-center">
                <Banknote size={18} className="text-text-muted" />
              </div>
              <div>
                <p className="text-[14px] font-medium">Cash on Delivery</p>
                <p className="text-[12px] text-text-muted">
                  Settled weekly minus platform fees
                </p>
              </div>
            </div>
            <Badge variant="success">Active</Badge>
          </div>
        </div>
      </Card>

      {/* Payout history placeholder */}
      <Card>
        <h2 className="text-[18px] font-semibold mb-4">Payout History</h2>
        <p className="text-[14px] text-text-muted py-8 text-center">
          Payout history will appear here once payment integrations are fully
          connected. Settlements are processed weekly for Whish and Tap
          payments, and monthly for COD orders.
        </p>
      </Card>
    </div>
  );
}
