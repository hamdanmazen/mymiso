"use client";

import { useEffect } from "react";
import { useCartStore } from "@/stores/cartStore";
import { CartItem } from "./CartItem";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils/formatPrice";
import { X, ShoppingBag } from "lucide-react";
import Link from "next/link";

export function CartDrawer() {
  const { items, isCartOpen, closeCart, getSubtotal, getItemCount } =
    useCartStore();

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const itemCount = getItemCount();
  const subtotal = getSubtotal();

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-surface-overlay flex flex-col shadow-floating">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
          <h2 className="text-[18px] font-semibold text-text-primary">
            Cart ({itemCount})
          </h2>
          <button
            type="button"
            onClick={closeCart}
            className="flex items-center justify-center w-9 h-9 rounded-comfortable hover:bg-surface-subtle transition-colors"
            aria-label="Close cart"
          >
            <X size={20} className="text-text-secondary" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <ShoppingBag
                size={48}
                className="text-text-muted mb-4"
              />
              <p className="text-[16px] text-text-secondary mb-2">
                Your cart is empty
              </p>
              <p className="text-[14px] text-text-muted mb-6">
                Browse products and add items to your cart
              </p>
              <Button variant="secondary" onClick={closeCart}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <CartItem key={item.id} item={item} compact />
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border-subtle px-5 py-4 space-y-3">
            <div className="flex justify-between text-[16px]">
              <span className="font-medium text-text-secondary">Subtotal</span>
              <span className="font-bold text-text-primary font-tabular">
                {formatPrice(subtotal)}
              </span>
            </div>
            <Link href="/cart" onClick={closeCart} className="block">
              <Button variant="secondary" className="w-full">
                View Cart
              </Button>
            </Link>
            <Link href="/checkout" onClick={closeCart} className="block">
              <Button className="w-full">Checkout</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
