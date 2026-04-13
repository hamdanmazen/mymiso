import type { ShippingOption } from "@/types/order";

export const SHIPPING_OPTIONS: ShippingOption[] = [
  {
    id: "standard",
    label: "Standard Delivery",
    price: 3.0,
    estimatedDays: 5,
    carrier: "Aramex",
  },
  {
    id: "express",
    label: "Express Delivery",
    price: 7.0,
    estimatedDays: 2,
    carrier: "Aramex",
  },
  {
    id: "pickup",
    label: "Whish Agent Pickup",
    price: 1.5,
    estimatedDays: 3,
    carrier: "Whish",
  },
];

export function getShippingOptions(): ShippingOption[] {
  return SHIPPING_OPTIONS;
}

export function getShippingOption(optionId: string): ShippingOption | undefined {
  return SHIPPING_OPTIONS.find((o) => o.id === optionId);
}

export function getEstimatedDeliveryDate(estimatedDays: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + estimatedDays);
  return date;
}

export function formatEstimatedDelivery(estimatedDays: number): string {
  const date = getEstimatedDeliveryDate(estimatedDays);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}
