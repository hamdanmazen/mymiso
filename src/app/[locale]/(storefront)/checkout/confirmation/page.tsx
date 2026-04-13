"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCheckoutStore } from "@/stores/checkoutStore";
import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { CheckCircle, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-2xl mx-auto px-3 sm:px-6 py-12">
          <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
          <Skeleton className="h-8 w-64 mx-auto mb-2" />
          <Skeleton className="h-4 w-96 mx-auto mb-8" />
          <Skeleton className="h-48 w-full rounded-spacious" />
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const ordersParam = searchParams.get("orders");
  const orderIds = ordersParam ? ordersParam.split(",").filter(Boolean) : [];
  const resetCheckout = useCheckoutStore((s) => s.reset);
  const clearCart = useCartStore((s) => s.clearCart);
  const [cleared, setCleared] = useState(false);

  // Clear stores on mount (once)
  useEffect(() => {
    if (!cleared) {
      resetCheckout();
      clearCart();
      setCleared(true);
    }
  }, [cleared, resetCheckout, clearCart]);

  if (orderIds.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-3 sm:px-6 py-12 text-center">
        <Card className="py-12">
          <ShoppingBag size={48} className="text-text-muted mx-auto mb-4" />
          <p className="text-[18px] text-text-secondary mb-4">
            No order found
          </p>
          <Link href="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-6 py-12">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={40} className="text-success" />
        </div>
        <h1 className="text-[28px] sm:text-[36px] font-bold tracking-tight text-text-primary mb-2">
          Order Placed!
        </h1>
        <p className="text-[16px] text-text-secondary">
          Thank you for your order. We&apos;ll send you updates as it progresses.
        </p>
      </div>

      <Card className="mb-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[14px] text-text-secondary">
              {orderIds.length > 1 ? "Orders" : "Order"} Created
            </span>
            <Badge variant="success">
              {orderIds.length} {orderIds.length > 1 ? "orders" : "order"}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[14px] text-text-secondary">
              Payment Method
            </span>
            <span className="text-[14px] text-text-primary font-medium">
              Cash on Delivery
            </span>
          </div>

          <p className="text-[13px] text-text-muted border-t border-border-subtle pt-3">
            Each seller will prepare and ship your items separately. You&apos;ll
            receive tracking information once your items are shipped.
          </p>
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/orders" className="flex-1">
          <Button className="w-full" size="lg">
            View My Orders
            <ArrowRight size={18} />
          </Button>
        </Link>
        <Link href="/products" className="flex-1">
          <Button variant="ghost" className="w-full" size="lg">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
}
