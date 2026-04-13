"use client";

import { Badge } from "@/components/ui/Badge";
import { Banknote, Wallet, CreditCard } from "lucide-react";

interface PaymentMethodSelectorProps {
  selected: "whish" | "tap" | "cod";
  onSelect: (method: "whish" | "tap" | "cod") => void;
}

const PAYMENT_METHODS = [
  {
    id: "cod" as const,
    label: "Cash on Delivery",
    description: "Pay when you receive your order",
    icon: Banknote,
    badge: "Most Popular",
    badgeVariant: "success" as const,
    disabled: false,
  },
  {
    id: "whish" as const,
    label: "Whish Pay",
    description: "Pay with Whish wallet, Visa card, or at any agent location",
    icon: Wallet,
    badge: "Coming Soon",
    badgeVariant: "info" as const,
    disabled: true,
  },
  {
    id: "tap" as const,
    label: "Card Payment",
    description: "Visa, Mastercard, Apple Pay",
    icon: CreditCard,
    badge: "Coming Soon",
    badgeVariant: "info" as const,
    disabled: true,
  },
];

export function PaymentMethodSelector({
  selected,
  onSelect,
}: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-2">
      {PAYMENT_METHODS.map((method) => {
        const Icon = method.icon;
        const isSelected = selected === method.id;
        return (
          <label
            key={method.id}
            className={`
              flex items-center gap-4 p-4 rounded-comfortable border cursor-pointer transition-all
              ${method.disabled ? "opacity-50 cursor-not-allowed" : ""}
              ${
                isSelected && !method.disabled
                  ? "border-mizo-teal bg-mizo-teal/5"
                  : "border-border-default hover:border-border-subtle"
              }
            `}
          >
            <input
              type="radio"
              name="payment-method"
              value={method.id}
              checked={isSelected}
              disabled={method.disabled}
              onChange={() => onSelect(method.id)}
              className="w-4 h-4 accent-mizo-teal"
            />
            <Icon
              size={24}
              className={
                isSelected ? "text-mizo-teal" : "text-text-muted"
              }
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-medium text-text-primary">
                  {method.label}
                </span>
                <Badge variant={method.badgeVariant}>{method.badge}</Badge>
              </div>
              <p className="text-[12px] text-text-muted mt-0.5">
                {method.description}
              </p>
            </div>
          </label>
        );
      })}
    </div>
  );
}
