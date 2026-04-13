"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cartStore";
import { useCheckoutStore } from "@/stores/checkoutStore";
import { AddressList } from "@/components/checkout/AddressList";
import { AddressForm } from "@/components/checkout/AddressForm";
import { ShippingOptions } from "@/components/checkout/ShippingOptions";
import { PaymentMethodSelector } from "@/components/checkout/PaymentMethodSelector";
import { CheckoutSummary } from "@/components/checkout/CheckoutSummary";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { getAddresses } from "@/lib/actions/address";
import { placeOrder } from "@/lib/actions/order";
import { getShippingOption } from "@/lib/utils/shipping";
import { formatPrice } from "@/lib/utils/formatPrice";
import { getPaymentMethodLabel } from "@/lib/utils/orderHelpers";
import {
  MapPin,
  Truck,
  CreditCard,
  ClipboardList,
  Check,
  Plus,
  Loader2,
  ShoppingCart,
} from "lucide-react";
import type { Database } from "@/types/database";

type AddressRow = Database["public"]["Tables"]["addresses"]["Row"];

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.getSubtotal());
  const clearCart = useCartStore((s) => s.clearCart);

  const {
    selectedAddressId,
    shippingSelections,
    paymentMethod,
    notes,
    setAddress,
    setShipping,
    setPaymentMethod,
    setNotes,
    reset: resetCheckout,
  } = useCheckoutStore();

  const [addresses, setAddresses] = useState<AddressRow[]>([]);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Hydration guard
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load addresses
  useEffect(() => {
    loadAddresses();
  }, []);

  async function loadAddresses() {
    const result = await getAddresses();
    setAddresses(result.data);
    // Auto-select default address if none selected
    if (!selectedAddressId && result.data.length > 0) {
      const defaultAddr = result.data.find((a) => a.is_default);
      setAddress(defaultAddr?.id ?? result.data[0].id);
    }
  }

  // Group items by seller
  const sellerGroups = useMemo(() => {
    const groups = new Map<
      string,
      {
        sellerName: string;
        items: typeof items;
        allFreeShipping: boolean;
      }
    >();

    for (const item of items) {
      const key = item.sellerId;
      if (!groups.has(key)) {
        groups.set(key, {
          sellerName: item.sellerName,
          items: [],
          allFreeShipping: true,
        });
      }
      const group = groups.get(key)!;
      group.items.push(item);
      // We don't have shipping_free on CartItemData, so we won't auto-flag free shipping here
      // In a real implementation, the product's shipping_free field would be included
    }

    return groups;
  }, [items]);

  // Validation checks
  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);
  const allShippingSelected = Array.from(sellerGroups.keys()).every(
    (sellerId) => shippingSelections[sellerId]
  );
  const canPlaceOrder =
    !!selectedAddressId && allShippingSelected && items.length > 0;

  // Calculate totals
  let totalShipping = 0;
  for (const [sellerId] of sellerGroups) {
    const optionId = shippingSelections[sellerId];
    const option = optionId ? getShippingOption(optionId) : null;
    totalShipping += option?.price ?? 0;
  }
  const total = subtotal + totalShipping;

  async function handlePlaceOrder() {
    if (!canPlaceOrder) return;
    setIsPlacingOrder(true);
    setOrderError(null);

    const result = await placeOrder({
      addressId: selectedAddressId!,
      paymentMethod,
      shippingSelections,
      notes: notes || undefined,
    });

    setIsPlacingOrder(false);

    if (result.error) {
      setOrderError(result.error);
      return;
    }

    // Clear cart and checkout state
    clearCart();
    resetCheckout();

    // Redirect to confirmation
    const orderIds = result.orderIds?.join(",") ?? "";
    router.push(`/checkout/confirmation?orders=${orderIds}`);
  }

  if (!mounted) {
    return (
      <div className="max-w-[1100px] mx-auto px-3 sm:px-6 py-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-surface-raised rounded" />
          <div className="h-64 bg-surface-raised rounded-spacious" />
        </div>
      </div>
    );
  }

  // Empty cart guard
  if (items.length === 0) {
    return (
      <div className="max-w-[1100px] mx-auto px-3 sm:px-6 py-6">
        <h1 className="text-[24px] sm:text-[32px] font-semibold tracking-tight mb-6">
          Checkout
        </h1>
        <Card className="text-center py-12">
          <ShoppingCart size={48} className="text-text-muted mx-auto mb-4" />
          <p className="text-[18px] text-text-secondary mb-2">
            Your cart is empty
          </p>
          <Button onClick={() => router.push("/products")}>
            Continue Shopping
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-[1100px] mx-auto px-3 sm:px-6 py-6">
      <h1 className="text-[24px] sm:text-[32px] font-semibold tracking-tight mb-6">
        Checkout
      </h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main form */}
        <div className="flex-1 space-y-6">
          {/* Section 1: Shipping Address */}
          <section className="bg-surface-raised border border-border-default rounded-spacious p-5">
            <SectionHeader
              icon={MapPin}
              title="Shipping Address"
              complete={!!selectedAddressId}
            />
            {addresses.length > 0 ? (
              <AddressList
                addresses={addresses}
                selectedId={selectedAddressId}
                onSelect={setAddress}
                onAddressChange={loadAddresses}
              />
            ) : (
              <p className="text-[14px] text-text-muted py-3">
                No addresses saved. Add one to continue.
              </p>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAddAddress(true)}
              className="mt-3"
            >
              <Plus size={16} />
              Add New Address
            </Button>
          </section>

          {/* Section 2: Shipping Method */}
          <section className="bg-surface-raised border border-border-default rounded-spacious p-5">
            <SectionHeader
              icon={Truck}
              title="Shipping Method"
              complete={allShippingSelected}
            />
            <div className="space-y-4">
              {Array.from(sellerGroups.entries()).map(([sellerId, group]) => (
                <ShippingOptions
                  key={sellerId}
                  sellerId={sellerId}
                  sellerName={group.sellerName}
                  selectedOptionId={shippingSelections[sellerId]}
                  onSelect={(optionId) => setShipping(sellerId, optionId)}
                  allItemsFreeShipping={false}
                />
              ))}
            </div>
          </section>

          {/* Section 3: Payment Method */}
          <section className="bg-surface-raised border border-border-default rounded-spacious p-5">
            <SectionHeader
              icon={CreditCard}
              title="Payment Method"
              complete={true}
            />
            <PaymentMethodSelector
              selected={paymentMethod}
              onSelect={setPaymentMethod}
            />
          </section>

          {/* Section 4: Order Notes */}
          <section className="bg-surface-raised border border-border-default rounded-spacious p-5">
            <SectionHeader
              icon={ClipboardList}
              title="Order Notes (Optional)"
              complete={false}
            />
            <Input
              placeholder="Special instructions for delivery..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </section>

          {/* Error message */}
          {orderError && (
            <div className="bg-error-subtle text-error rounded-comfortable px-4 py-3 text-[14px]">
              {orderError}
            </div>
          )}

          {/* Place Order */}
          <Button
            size="lg"
            className="w-full"
            disabled={!canPlaceOrder || isPlacingOrder}
            isLoading={isPlacingOrder}
            onClick={handlePlaceOrder}
          >
            {isPlacingOrder
              ? "Placing Order..."
              : `Place Order — ${formatPrice(total)}`}
          </Button>

          {paymentMethod === "cod" && (
            <p className="text-[12px] text-text-muted text-center">
              You will pay {formatPrice(total)} in cash when your order is
              delivered.
            </p>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:w-[360px] shrink-0">
          <CheckoutSummary />
        </div>
      </div>

      {/* Add Address Modal */}
      <Modal
        isOpen={showAddAddress}
        onClose={() => setShowAddAddress(false)}
        title="Add Shipping Address"
      >
        <AddressForm
          onSuccess={(id) => {
            setShowAddAddress(false);
            setAddress(id);
            loadAddresses();
          }}
          onCancel={() => setShowAddAddress(false)}
        />
      </Modal>
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  complete,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  complete: boolean;
}) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Icon
        size={20}
        className={complete ? "text-success" : "text-text-muted"}
      />
      <h2 className="text-[16px] font-semibold text-text-primary">{title}</h2>
      {complete && (
        <Check size={16} className="text-success ml-auto" />
      )}
    </div>
  );
}
