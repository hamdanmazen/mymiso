"use client";

import Image from "next/image";
import Link from "next/link";
import { QuantityPicker } from "@/components/product/QuantityPicker";
import { PriceDisplay } from "@/components/product/PriceDisplay";
import { useCartStore } from "@/stores/cartStore";
import { Trash2 } from "lucide-react";
import { getProductThumbnailUrl } from "@/lib/utils/images";
import type { CartItemData } from "@/types/product";

interface CartItemProps {
  item: CartItemData;
  compact?: boolean;
}

export function CartItem({ item, compact = false }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();

  const thumbnailUrl =
    item.thumbnail_url || getProductThumbnailUrl(item.productId);

  return (
    <div className="flex gap-3 py-3 border-b border-border-subtle last:border-0">
      {/* Thumbnail */}
      <Link
        href={`/products/${item.slug}`}
        className="relative shrink-0 rounded-comfortable overflow-hidden bg-surface-subtle"
        style={{ width: compact ? 64 : 80, height: compact ? 64 : 80 }}
      >
        <Image
          src={thumbnailUrl}
          alt={item.title}
          fill
          sizes={compact ? "64px" : "80px"}
          className="object-cover"
        />
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/products/${item.slug}`}
          className="text-[14px] font-medium text-text-primary hover:text-mizo-teal line-clamp-2 transition-colors"
        >
          {item.title}
        </Link>

        {item.variantName && (
          <p className="text-[12px] text-text-muted mt-0.5">
            {item.variantName}
          </p>
        )}

        <PriceDisplay
          price={item.price}
          compareAtPrice={item.compare_at_price}
          currency={item.currency}
          size="sm"
          showDiscount={false}
          className="mt-1"
        />

        <div className="flex items-center justify-between mt-2">
          <QuantityPicker
            quantity={item.quantity}
            onChange={(qty) => updateQuantity(item.productId, item.variantId, qty)}
            max={item.stock_quantity}
          />
          <button
            type="button"
            onClick={() => removeItem(item.productId, item.variantId)}
            className="flex items-center justify-center w-9 h-9 text-text-muted hover:text-error rounded-comfortable hover:bg-error-subtle transition-colors"
            aria-label="Remove item"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
