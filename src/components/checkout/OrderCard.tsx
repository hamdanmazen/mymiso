import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  getOrderStatusBadgeVariant,
  getOrderStatusLabel,
  getPaymentMethodLabel,
} from "@/lib/utils/orderHelpers";
import { formatPrice } from "@/lib/utils/formatPrice";
import { formatDate } from "@/lib/utils/formatDate";
import Image from "next/image";
import Link from "next/link";
import type { OrderSummary } from "@/types/order";

interface OrderCardProps {
  order: OrderSummary;
}

export function OrderCard({ order }: OrderCardProps) {
  return (
    <Link href={`/orders/${order.id}`}>
      <Card hoverable className="flex items-center gap-4 p-4">
        {/* Thumbnail */}
        <div className="relative w-16 h-16 rounded-comfortable overflow-hidden bg-surface-subtle shrink-0">
          {order.first_item_thumbnail ? (
            <Image
              src={order.first_item_thumbnail}
              alt={order.first_item_title ?? "Order item"}
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

        {/* Order info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[14px] font-semibold text-text-primary font-mono">
              {order.order_number}
            </span>
            <Badge variant={getOrderStatusBadgeVariant(order.status)}>
              {getOrderStatusLabel(order.status)}
            </Badge>
          </div>
          <p className="text-[13px] text-text-secondary">
            {order.item_count} {order.item_count === 1 ? "item" : "items"}
            {order.first_item_title && (
              <> &middot; {order.first_item_title}</>
            )}
          </p>
          <p className="text-[12px] text-text-muted mt-0.5">
            {formatDate(order.created_at)} &middot;{" "}
            {getPaymentMethodLabel(order.payment_method)}
          </p>
        </div>

        {/* Total */}
        <div className="text-right shrink-0">
          <span className="text-[16px] font-bold text-text-primary font-tabular">
            {formatPrice(order.total, order.currency)}
          </span>
        </div>
      </Card>
    </Link>
  );
}
