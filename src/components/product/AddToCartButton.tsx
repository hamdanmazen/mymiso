"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/stores/cartStore";
import { ShoppingCart, Check } from "lucide-react";
import type { CartItemData } from "@/types/product";

interface AddToCartButtonProps {
  product: {
    id: string;
    title: string;
    slug: string;
    price: number;
    compare_at_price: number | null;
    currency: string;
    thumbnail_url: string | null;
    stock_quantity: number;
    sellerId: string;
    sellerName: string;
  };
  variantId?: string | null;
  variantName?: string | null;
  quantity: number;
  className?: string;
}

export function AddToCartButton({
  product,
  variantId = null,
  variantName = null,
  quantity,
  className = "",
}: AddToCartButtonProps) {
  const { addItem, openCart } = useCartStore();
  const [added, setAdded] = useState(false);

  const isOutOfStock = product.stock_quantity <= 0;

  function handleAddToCart() {
    if (isOutOfStock) return;

    const item: CartItemData = {
      id: `${product.id}-${variantId || "default"}`,
      productId: product.id,
      variantId,
      quantity,
      title: product.title,
      slug: product.slug,
      price: product.price,
      compare_at_price: product.compare_at_price,
      currency: product.currency,
      thumbnail_url: product.thumbnail_url,
      stock_quantity: product.stock_quantity,
      variantName,
      sellerId: product.sellerId,
      sellerName: product.sellerName,
    };

    addItem(item);
    setAdded(true);
    openCart();

    setTimeout(() => setAdded(false), 2000);
  }

  if (isOutOfStock) {
    return (
      <Button disabled className={`w-full ${className}`}>
        Out of Stock
      </Button>
    );
  }

  return (
    <Button
      onClick={handleAddToCart}
      className={`w-full ${className}`}
      size="lg"
    >
      {added ? (
        <>
          <Check size={18} />
          Added to Cart
        </>
      ) : (
        <>
          <ShoppingCart size={18} />
          Add to Cart
        </>
      )}
    </Button>
  );
}
