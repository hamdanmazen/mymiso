import { getOrderById } from "@/lib/queries/orders";
import { StatusTimeline } from "@/components/checkout/StatusTimeline";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  getOrderStatusBadgeVariant,
  getOrderStatusLabel,
  getPaymentMethodLabel,
} from "@/lib/utils/orderHelpers";
import { formatPrice } from "@/lib/utils/formatPrice";
import { formatDateTime } from "@/lib/utils/formatDate";
import { ArrowLeft, Package, MapPin, CreditCard, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  const shippingAddress = order.shipping_address as Record<
    string,
    string
  > | null;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/orders">
          <Button variant="ghost" size="sm">
            <ArrowLeft size={16} />
            Orders
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[24px] font-semibold tracking-tight font-mono">
            {order.order_number}
          </h1>
          <p className="text-[13px] text-text-muted mt-1">
            Placed {formatDateTime(order.created_at)}
          </p>
        </div>
        <Badge variant={getOrderStatusBadgeVariant(order.status)}>
          {getOrderStatusLabel(order.status)}
        </Badge>
      </div>

      {/* Status Timeline */}
      <Card className="mb-6 overflow-x-auto">
        <StatusTimeline currentStatus={order.status} />
      </Card>

      {/* Order Items */}
      <Card className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Package size={18} className="text-text-muted" />
          <h2 className="text-[16px] font-semibold text-text-primary">
            Items ({order.items.length})
          </h2>
        </div>
        <div className="divide-y divide-border-subtle">
          {order.items.map((item) => {
            const snapshot = item.product_snapshot as Record<
              string,
              unknown
            > | null;
            return (
              <div
                key={item.id}
                className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
              >
                <div className="relative w-16 h-16 rounded-comfortable overflow-hidden bg-surface-subtle shrink-0">
                  {snapshot?.thumbnail_url ? (
                    <Image
                      src={snapshot.thumbnail_url as string}
                      alt={(snapshot.title as string) ?? "Product"}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-muted text-[11px]">
                      No image
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium text-text-primary truncate">
                    {(snapshot?.title as string) ?? "Product"}
                  </p>
                  {snapshot?.variant_name ? (
                    <p className="text-[12px] text-text-muted">
                      {String(snapshot.variant_name)}
                    </p>
                  ) : null}
                  <p className="text-[13px] text-text-secondary">
                    Qty: {item.quantity} &times;{" "}
                    {formatPrice(item.unit_price)}
                  </p>
                </div>
                <span className="text-[14px] font-semibold text-text-primary font-tabular">
                  {formatPrice(item.total_price)}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Shipping Address */}
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={18} className="text-text-muted" />
            <h2 className="text-[16px] font-semibold text-text-primary">
              Shipping Address
            </h2>
          </div>
          {shippingAddress ? (
            <div className="text-[14px] text-text-secondary leading-relaxed">
              <p className="font-medium text-text-primary">
                {shippingAddress.full_name}
              </p>
              <p>{shippingAddress.street_address}</p>
              {shippingAddress.apartment && (
                <p>{shippingAddress.apartment}</p>
              )}
              <p>
                {shippingAddress.city}
                {shippingAddress.state && `, ${shippingAddress.state}`}{" "}
                {shippingAddress.postal_code}
              </p>
              <p>{shippingAddress.country}</p>
              {shippingAddress.phone && (
                <p className="text-text-muted mt-1">
                  {shippingAddress.phone}
                </p>
              )}
            </div>
          ) : (
            <p className="text-[14px] text-text-muted">
              Address not available
            </p>
          )}
        </Card>

        {/* Payment & Tracking */}
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <CreditCard size={18} className="text-text-muted" />
            <h2 className="text-[16px] font-semibold text-text-primary">
              Payment & Tracking
            </h2>
          </div>
          <div className="space-y-2 text-[14px]">
            <div className="flex justify-between">
              <span className="text-text-secondary">Payment Method</span>
              <span className="text-text-primary font-medium">
                {getPaymentMethodLabel(order.payment_method)}
              </span>
            </div>
            {order.payment_ref_id && (
              <div className="flex justify-between">
                <span className="text-text-secondary">Reference</span>
                <span className="text-text-primary font-mono text-[13px]">
                  {order.payment_ref_id}
                </span>
              </div>
            )}
            {order.tracking_number && (
              <div className="flex items-center gap-2 pt-2 border-t border-border-subtle">
                <Truck size={16} className="text-mizo-teal" />
                <div>
                  <p className="text-text-primary font-medium">
                    Tracking: {order.tracking_number}
                  </p>
                  {order.tracking_url && (
                    <a
                      href={order.tracking_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-mizo-teal text-[13px] hover:underline"
                    >
                      Track Package
                    </a>
                  )}
                </div>
              </div>
            )}
            {order.status === "shipped" && !order.tracking_number && (
              <p className="text-[13px] text-text-muted pt-2 border-t border-border-subtle">
                Tracking information will be updated soon.
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Order Totals */}
      <Card>
        <div className="space-y-2">
          <div className="flex justify-between text-[14px]">
            <span className="text-text-secondary">Subtotal</span>
            <span className="text-text-primary font-tabular">
              {formatPrice(order.subtotal)}
            </span>
          </div>
          <div className="flex justify-between text-[14px]">
            <span className="text-text-secondary">Shipping</span>
            <span className="text-text-primary font-tabular">
              {order.shipping_cost > 0
                ? formatPrice(order.shipping_cost)
                : "Free"}
            </span>
          </div>
          {order.tax > 0 && (
            <div className="flex justify-between text-[14px]">
              <span className="text-text-secondary">Tax</span>
              <span className="text-text-primary font-tabular">
                {formatPrice(order.tax)}
              </span>
            </div>
          )}
          <div className="flex justify-between text-[18px] pt-2 border-t border-border-default">
            <span className="font-semibold text-text-primary">Total</span>
            <span className="font-bold text-text-primary font-tabular">
              {formatPrice(order.total)}
            </span>
          </div>
        </div>
      </Card>

      {order.notes && (
        <Card className="mt-4">
          <h3 className="text-[14px] font-semibold text-text-primary mb-1">
            Order Notes
          </h3>
          <p className="text-[14px] text-text-secondary">{order.notes}</p>
        </Card>
      )}
    </div>
  );
}
