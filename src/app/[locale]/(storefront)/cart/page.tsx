"use client";

import { useCartStore } from "@/stores/cartStore";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);

  if (items.length === 0) {
    return (
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 py-6">
        <h1 className="text-[24px] sm:text-[32px] font-semibold tracking-tight mb-6">
          Shopping Cart
        </h1>
        <Card className="text-center py-12">
          <ShoppingCart size={48} className="text-text-muted mx-auto mb-4" />
          <p className="text-[18px] text-text-secondary mb-2">
            Your cart is empty
          </p>
          <p className="text-[14px] text-text-muted mb-6">
            Browse products and add items to your cart
          </p>
          <Link href="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-3 sm:px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[24px] sm:text-[32px] font-semibold tracking-tight">
          Shopping Cart
        </h1>
        <Button variant="ghost" size="sm" onClick={clearCart}>
          Clear Cart
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Cart items */}
        <div className="flex-1 bg-surface-raised border border-border-default rounded-spacious p-5">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        {/* Summary */}
        <div className="lg:w-[340px] shrink-0">
          <CartSummary />
          <Link href="/products" className="block mt-3">
            <Button variant="ghost" className="w-full">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
