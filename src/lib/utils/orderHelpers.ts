export function getOrderStatusBadgeVariant(
  status: string
): "success" | "warning" | "error" | "info" {
  switch (status) {
    case "pending":
      return "warning";
    case "confirmed":
    case "processing":
    case "shipped":
      return "info";
    case "delivered":
      return "success";
    case "cancelled":
    case "refunded":
      return "error";
    default:
      return "info";
  }
}

export function getOrderStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: "Pending",
    confirmed: "Confirmed",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
    refunded: "Refunded",
  };
  return labels[status] || status;
}

export function getPaymentMethodLabel(method: string): string {
  const labels: Record<string, string> = {
    cod: "Cash on Delivery",
    whish: "Whish Pay",
    tap: "Card Payment",
  };
  return labels[method] || method;
}

export function generateOrderNumber(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `MYM-${date}-${rand}`;
}

export const ORDER_STATUS_STEPS = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
] as const;

export function getOrderStatusStepIndex(status: string): number {
  const idx = ORDER_STATUS_STEPS.indexOf(
    status as (typeof ORDER_STATUS_STEPS)[number]
  );
  return idx >= 0 ? idx : -1;
}
