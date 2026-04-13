"use client";

import { getShippingOptions, formatEstimatedDelivery } from "@/lib/utils/shipping";
import { formatPrice } from "@/lib/utils/formatPrice";
import { Truck } from "lucide-react";
import type { ShippingOption } from "@/types/order";

interface ShippingOptionsProps {
  sellerId: string;
  sellerName: string;
  selectedOptionId?: string;
  onSelect: (optionId: string) => void;
  allItemsFreeShipping: boolean;
}

export function ShippingOptions({
  sellerId,
  sellerName,
  selectedOptionId,
  onSelect,
  allItemsFreeShipping,
}: ShippingOptionsProps) {
  const options = getShippingOptions();

  if (allItemsFreeShipping) {
    return (
      <div className="bg-success-subtle border border-success/20 rounded-comfortable p-3">
        <div className="flex items-center gap-2">
          <Truck size={16} className="text-success" />
          <span className="text-[14px] font-medium text-success">
            Free Shipping
          </span>
          <span className="text-[12px] text-text-muted ml-auto">
            for {sellerName}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-[13px] font-medium text-mizo-teal">{sellerName}</p>
      {options.map((option) => (
        <label
          key={option.id}
          className={`
            flex items-center gap-3 p-3 rounded-comfortable border cursor-pointer transition-all
            ${
              selectedOptionId === option.id
                ? "border-mizo-teal bg-mizo-teal/5"
                : "border-border-default hover:border-border-subtle"
            }
          `}
        >
          <input
            type="radio"
            name={`shipping-${sellerId}`}
            value={option.id}
            checked={selectedOptionId === option.id}
            onChange={() => onSelect(option.id)}
            className="w-4 h-4 accent-mizo-teal"
          />
          <Truck size={16} className="text-text-muted shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[14px] text-text-primary font-medium">
              {option.label}
            </p>
            <p className="text-[12px] text-text-muted">
              {option.carrier} &middot; Est.{" "}
              {formatEstimatedDelivery(option.estimatedDays)}
            </p>
          </div>
          <span className="text-[14px] font-semibold text-text-primary font-tabular shrink-0">
            {formatPrice(option.price)}
          </span>
        </label>
      ))}
    </div>
  );
}
