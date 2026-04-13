"use client";

import { useCartStore } from "@/stores/cartStore";
import { useCheckoutStore } from "@/stores/checkoutStore";
import { formatPrice } from "@/lib/utils/formatPrice";
import { getShippingOption } from "@/lib/utils/shipping";
import Image from "next/image";

export function CheckoutSummary() {
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.getSubtotal());
  const shippingSelections = useCheckoutStore((s) => s.shippingSelections);

  // Group items by seller
  const sellerGroups = new Map<
    string,
    { sellerName: string; items: typeof items; shippingCost: number }
  >();

  for (const item of items) {
    const key = item.sellerId;
    if (!sellerGroups.has(key)) {
      sellerGroups.set(key, {
        sellerName: item.sellerName,
        items: [],
        shippingCost: 0,
      });
    }
    sellerGroups.get(key)!.items.push(item);
  }

  // Calculate shipping per seller
  let totalShipping = 0;
  for (const [sellerId, group] of sellerGroups) {
    const optionId = shippingSelections[sellerId];
    const option = optionId ? getShippingOption(optionId) : null;
    group.shippingCost = option?.price ?? 0;
    totalShipping += group.shippingCost;
  }

  const total = subtotal + totalShipping;

  return (
    <div className="bg-surface-raised border border-border-default rounded-spacious p-5 sticky top-24">
      <h3 className="text-[16px] font-semibold text-text-primary mb-4">
        Order Summary
      </h3>

      {/* Items grouped by seller */}
      <div className="space-y-4 mb-4">
        {Array.from(sellerGroups.entries()).map(([sellerId, group]) => (
          <div key={sellerId}>
            <p className="text-[12px] font-medium text-mizo-teal mb-2">
              {group.sellerName}
            </p>
            <div className="space-y-2">
              {group.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3"
                >
                  <div className="relative w-10 h-10 rounded-compact overflow-hidden bg-surface-subtle shrink-0">
                    {item.thumbnail_url && (
                      <Image
                        src={item.thumbnail_url}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    )}
                    <span className="absolute -top-1 -right-1 bg-mizo-red text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-semibold">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-text-primary truncate">
                      {item.title}
                    </p>
                    {item.variantName && (
                      <p className="text-[11px] text-text-muted">
                        {item.variantName}
                      </p>
                    )}
                  </div>
                  <span className="text-[13px] font-medium text-text-primary font-tabular shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            {group.shippingCost > 0 && (
              <div className="flex justify-between text-[12px] text-text-muted mt-2 pt-1 border-t border-border-subtle">
                <span>Shipping</span>
                <span className="font-tabular">
                  {formatPrice(group.shippingCost)}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="border-t border-border-default pt-3 space-y-2">
        <div className="flex justify-between text-[14px]">
          <span className="text-text-secondary">Subtotal</span>
          <span className="text-text-primary font-medium font-tabular">
            {formatPrice(subtotal)}
          </span>
        </div>
        <div className="flex justify-between text-[14px]">
          <span className="text-text-secondary">Shipping</span>
          <span className="text-text-primary font-medium font-tabular">
            {totalShipping > 0
              ? formatPrice(totalShipping)
              : "Free"}
          </span>
        </div>
        <div className="flex justify-between text-[16px] pt-2 border-t border-border-subtle">
          <span className="font-semibold text-text-primary">Total</span>
          <span className="font-bold text-text-primary font-tabular">
            {formatPrice(total)}
          </span>
        </div>
      </div>
    </div>
  );
}
