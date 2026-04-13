"use client";

import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/utils/formatPrice";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

interface CartSummaryProps {
  showCheckoutButton?: boolean;
  className?: string;
}

export function CartSummary({
  showCheckoutButton = true,
  className = "",
}: CartSummaryProps) {
  const subtotal = useCartStore((s) => s.getSubtotal());
  const itemCount = useCartStore((s) => s.getItemCount());

  const shipping = 0; // Calculated at checkout
  const total = subtotal + shipping;

  return (
    <div
      className={`bg-surface-raised border border-border-default rounded-spacious p-5 ${className}`}
    >
      <h3 className="text-[16px] font-semibold text-text-primary mb-4">
        Order Summary
      </h3>

      <div className="space-y-2">
        <div className="flex justify-between text-[14px]">
          <span className="text-text-secondary">
            Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
          </span>
          <span className="text-text-primary font-medium font-tabular">
            {formatPrice(subtotal)}
          </span>
        </div>
        <div className="flex justify-between text-[14px]">
          <span className="text-text-secondary">Shipping</span>
          <span className="text-text-muted text-[13px]">
            Calculated at checkout
          </span>
        </div>
        <div className="border-t border-border-subtle pt-2 mt-2">
          <div className="flex justify-between text-[16px]">
            <span className="font-semibold text-text-primary">Total</span>
            <span className="font-bold text-text-primary font-tabular">
              {formatPrice(total)}
            </span>
          </div>
        </div>
      </div>

      {showCheckoutButton && (
        <Link href="/checkout" className="block mt-4">
          <Button className="w-full" size="lg">
            Proceed to Checkout
          </Button>
        </Link>
      )}
    </div>
  );
}
