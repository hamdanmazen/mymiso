"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { updateOrderStatus } from "@/lib/actions/seller";
import { formatPrice } from "@/lib/utils/formatPrice";
import { formatDate } from "@/lib/utils/formatDate";
import type { SellerOrderSummary } from "@/lib/queries/seller-dashboard";
import { Truck, CheckCircle, XCircle, Package, Clock } from "lucide-react";

const STATUS_COLORS: Record<string, "success" | "warning" | "error" | "info"> = {
  pending: "warning",
  confirmed: "info",
  processing: "info",
  shipped: "info",
  delivered: "success",
  cancelled: "error",
  refunded: "error",
};

const NEXT_STATUS: Record<string, { label: string; value: string; icon: React.ReactNode } | null> = {
  pending: { label: "Confirm", value: "confirmed", icon: <CheckCircle size={14} /> },
  confirmed: { label: "Process", value: "processing", icon: <Package size={14} /> },
  processing: { label: "Ship", value: "shipped", icon: <Truck size={14} /> },
  shipped: { label: "Delivered", value: "delivered", icon: <CheckCircle size={14} /> },
  delivered: null,
  cancelled: null,
  refunded: null,
};

interface OrderTableProps {
  orders: SellerOrderSummary[];
}

export function OrderTable({ orders }: OrderTableProps) {
  const router = useRouter();
  const [shipModal, setShipModal] = useState<string | null>(null);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleStatusUpdate(
    orderId: string,
    status: string,
    tracking?: { number: string; url: string }
  ) {
    setLoading(orderId);
    setError("");

    const result = await updateOrderStatus({
      orderId,
      status: status as "confirmed" | "processing" | "shipped" | "delivered" | "cancelled",
      trackingNumber: tracking?.number,
      trackingUrl: tracking?.url || undefined,
    });

    if (result.error) {
      setError(result.error);
    } else {
      setShipModal(null);
      setTrackingNumber("");
      setTrackingUrl("");
      router.refresh();
    }
    setLoading(null);
  }

  function handleShipClick(orderId: string) {
    setShipModal(orderId);
    setTrackingNumber("");
    setTrackingUrl("");
    setError("");
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-subtle bg-surface-subtle">
              <th className="text-left text-[12px] font-semibold text-text-muted uppercase tracking-wider px-4 py-3">
                Order
              </th>
              <th className="text-left text-[12px] font-semibold text-text-muted uppercase tracking-wider px-4 py-3 hidden sm:table-cell">
                Buyer
              </th>
              <th className="text-left text-[12px] font-semibold text-text-muted uppercase tracking-wider px-4 py-3">
                Status
              </th>
              <th className="text-right text-[12px] font-semibold text-text-muted uppercase tracking-wider px-4 py-3">
                Total
              </th>
              <th className="text-left text-[12px] font-semibold text-text-muted uppercase tracking-wider px-4 py-3 hidden md:table-cell">
                Payment
              </th>
              <th className="text-right text-[12px] font-semibold text-text-muted uppercase tracking-wider px-4 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const nextAction = NEXT_STATUS[order.status];
              const isShipAction =
                order.status === "processing" && nextAction?.value === "shipped";

              return (
                <tr
                  key={order.id}
                  className="border-b border-border-subtle last:border-0 hover:bg-surface-subtle/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <p className="text-[14px] font-medium">
                      {order.order_number}
                    </p>
                    <p className="text-[12px] text-text-muted">
                      {formatDate(order.created_at)} &middot; {order.item_count}{" "}
                      item{order.item_count !== 1 ? "s" : ""}
                    </p>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="text-[14px] text-text-secondary">
                      {order.buyer_name ?? "Guest"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={STATUS_COLORS[order.status] ?? "info"}>
                      {order.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-[14px] font-semibold font-tabular">
                      {formatPrice(order.total)}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-[13px] text-text-secondary capitalize">
                      {order.payment_method === "cod"
                        ? "Cash on Delivery"
                        : order.payment_method}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {nextAction && (
                        <>
                          {isShipAction ? (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleShipClick(order.id)}
                              disabled={loading === order.id}
                            >
                              {nextAction.icon} {nextAction.label}
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() =>
                                handleStatusUpdate(order.id, nextAction.value)
                              }
                              isLoading={loading === order.id}
                            >
                              {nextAction.icon} {nextAction.label}
                            </Button>
                          )}
                        </>
                      )}
                      {order.status !== "cancelled" &&
                        order.status !== "delivered" &&
                        order.status !== "refunded" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              handleStatusUpdate(order.id, "cancelled")
                            }
                            disabled={loading === order.id}
                          >
                            <XCircle size={14} />
                          </Button>
                        )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Ship modal with tracking */}
      <Modal
        isOpen={!!shipModal}
        onClose={() => setShipModal(null)}
        title="Add Shipping Details"
        size="sm"
      >
        <div className="space-y-4">
          {error && (
            <div className="p-3 rounded-comfortable bg-error-subtle text-error text-[13px]">
              {error}
            </div>
          )}
          <Input
            label="Tracking Number"
            placeholder="e.g. LB123456789"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
          />
          <Input
            label="Tracking URL (optional)"
            placeholder="https://tracking.example.com/..."
            value={trackingUrl}
            onChange={(e) => setTrackingUrl(e.target.value)}
          />
          <div className="flex gap-3 pt-2">
            <Button
              onClick={() =>
                shipModal &&
                handleStatusUpdate(shipModal, "shipped", {
                  number: trackingNumber,
                  url: trackingUrl,
                })
              }
              isLoading={!!loading}
              fullWidth
            >
              <Truck size={16} /> Mark as Shipped
            </Button>
            <Button variant="ghost" onClick={() => setShipModal(null)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
