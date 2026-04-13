"use server";

import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkoutSchema } from "@/lib/utils/validators";
import { getShippingOption } from "@/lib/utils/shipping";
import { generateOrderNumber } from "@/lib/utils/orderHelpers";
import { processPayment } from "@/lib/payments/router";
import { revalidatePath } from "next/cache";
import type { PlaceOrderResult } from "@/types/order";

export async function placeOrder(input: {
  addressId: string;
  paymentMethod: "whish" | "tap" | "cod";
  shippingSelections: Record<string, string>;
  notes?: string;
}): Promise<PlaceOrderResult> {
  if (!isSupabaseConfigured()) return { error: "Service not configured" };

  const supabase = (await createClient())!;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Validate input
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  // Fetch the shipping address
  const { data: address, error: addrError } = await supabase
    .from("addresses")
    .select("*")
    .eq("id", input.addressId)
    .eq("user_id", user.id)
    .single();

  if (addrError || !address) return { error: "Address not found" };

  // Fetch cart items from DB (server-side truth)
  const { data: rawCartItems, error: cartError } = await supabase
    .from("cart_items")
    .select("id, product_id, variant_id, quantity")
    .eq("user_id", user.id);

  if (cartError) return { error: "Failed to load cart" };
  if (!rawCartItems || rawCartItems.length === 0)
    return { error: "Cart is empty" };

  // Fetch product details for each cart item
  const productIds = [
    ...new Set(rawCartItems.map((ci) => ci.product_id)),
  ];
  const { data: products } = await supabase
    .from("products")
    .select("id, title, slug, price, currency, thumbnail_url, stock_quantity, shipping_free, seller_id")
    .in("id", productIds);

  if (!products) return { error: "Failed to load products" };

  // Fetch sellers for all products
  const sellerIds = [...new Set(products.map((p) => p.seller_id).filter(Boolean))];
  const { data: sellers } = await supabase
    .from("sellers")
    .select("id, shop_name, user_id")
    .in("id", sellerIds as string[]);

  const sellerMap = new Map(
    (sellers ?? []).map((s) => [s.id, s])
  );
  const productMap = new Map(products.map((p) => [p.id, p]));

  const cartItems = rawCartItems.map((ci) => ({
    ...ci,
    product: productMap.get(ci.product_id) ?? null,
    seller: productMap.get(ci.product_id)?.seller_id
      ? sellerMap.get(productMap.get(ci.product_id)!.seller_id!) ?? null
      : null,
  }));

  // Group items by seller
  const sellerGroups = new Map<
    string,
    {
      sellerId: string;
      sellerName: string;
      items: {
        product_id: string;
        variant_id: string | null;
        quantity: number;
        unit_price: number;
        title: string;
        thumbnail_url: string | null;
        variant_name: string | null;
      }[];
    }
  >();

  for (const cartItem of cartItems) {
    const product = cartItem.product;
    const seller = cartItem.seller;

    if (!product || !seller) continue;

    const sellerId = seller.id;
    if (!sellerGroups.has(sellerId)) {
      sellerGroups.set(sellerId, {
        sellerId,
        sellerName: seller.shop_name,
        items: [],
      });
    }

    sellerGroups.get(sellerId)!.items.push({
      product_id: product.id,
      variant_id: cartItem.variant_id,
      quantity: cartItem.quantity,
      unit_price: product.price,
      title: product.title,
      thumbnail_url: product.thumbnail_url,
      variant_name: null,
    });
  }

  if (sellerGroups.size === 0) return { error: "No valid items in cart" };

  // Build shipping address snapshot
  const shippingAddressSnapshot = {
    full_name: address.full_name,
    phone: address.phone,
    street_address: address.street_address,
    apartment: address.apartment,
    city: address.city,
    state: address.state,
    postal_code: address.postal_code,
    country: address.country,
  };

  const orderIds: string[] = [];
  const orderNumbers: string[] = [];

  // Create one order per seller
  for (const [sellerId, group] of sellerGroups) {
    const shippingOptionId = input.shippingSelections[sellerId];
    const shippingOption = shippingOptionId
      ? getShippingOption(shippingOptionId)
      : null;
    const shippingCost = shippingOption?.price ?? 0;
    const shippingMethod = shippingOption?.label ?? "Standard";

    const itemSubtotal = group.items.reduce(
      (sum, item) => sum + item.unit_price * item.quantity,
      0
    );
    const orderTotal = itemSubtotal + shippingCost;
    const orderNumber = generateOrderNumber();

    // Build items JSON for the RPC
    const itemsJson = group.items.map((item) => ({
      product_id: item.product_id,
      variant_id: item.variant_id ?? "",
      quantity: item.quantity,
      unit_price: item.unit_price,
      variant_name: item.variant_name ?? "",
    }));

    // Call atomic place_order RPC
    const { data: orderId, error: orderError } = await supabase.rpc(
      "place_order" as never,
      {
        p_buyer_id: user.id,
        p_seller_id: sellerId,
        p_order_number: orderNumber,
        p_items: JSON.stringify(itemsJson),
        p_shipping_address: JSON.stringify(shippingAddressSnapshot),
        p_payment_method: input.paymentMethod,
        p_shipping_cost: shippingCost,
        p_shipping_method: shippingMethod,
        p_subtotal: itemSubtotal,
        p_total: orderTotal,
        p_currency: "USD",
        p_notes: input.notes ?? null,
      } as never
    );

    if (orderError) {
      return { error: orderError.message };
    }

    orderIds.push(orderId as unknown as string);
    orderNumbers.push(orderNumber);
  }

  // Process payment
  const grandTotal = Array.from(sellerGroups.values()).reduce(
    (sum, group) => {
      const shippingOptionId = input.shippingSelections[group.sellerId];
      const shippingOption = shippingOptionId
        ? getShippingOption(shippingOptionId)
        : null;
      const shippingCost = shippingOption?.price ?? 0;
      const itemSubtotal = group.items.reduce(
        (s, item) => s + item.unit_price * item.quantity,
        0
      );
      return sum + itemSubtotal + shippingCost;
    },
    0
  );

  const paymentResult = await processPayment(
    input.paymentMethod,
    orderIds,
    grandTotal,
    "USD"
  );

  if (!paymentResult.success && input.paymentMethod !== "cod") {
    // For non-COD, payment failure means we need to flag orders
    // Orders stay in 'pending' status and can be retried
    return {
      error:
        paymentResult.error ?? "Payment failed. Please try another method.",
    };
  }

  // Update orders with payment ref if available
  if (paymentResult.paymentRefId) {
    const adminClient = createAdminClient();
    for (const orderId of orderIds) {
      await adminClient
        .from("orders")
        .update({
          payment_ref_id: paymentResult.paymentRefId,
          status: "confirmed",
        })
        .eq("id", orderId);
    }
  }

  // Clear the user's cart
  await supabase.from("cart_items").delete().eq("user_id", user.id);

  // Create notifications (best-effort, non-blocking)
  const adminClient = createAdminClient();
  try {
    // Notify buyer
    await adminClient.from("notifications").insert({
      user_id: user.id,
      type: "order_placed",
      title: "Order Placed Successfully",
      body: `Your order${orderNumbers.length > 1 ? "s" : ""} ${orderNumbers.join(", ")} ${orderNumbers.length > 1 ? "have" : "has"} been placed.`,
      link: `/orders/${orderIds[0]}`,
    });

    // Notify each seller
    for (const [sellerId, group] of sellerGroups) {
      // Look up seller's user_id
      const { data: seller } = await adminClient
        .from("sellers")
        .select("user_id")
        .eq("id", sellerId)
        .single();

      if (seller) {
        await adminClient.from("notifications").insert({
          user_id: seller.user_id,
          type: "new_order",
          title: "New Order Received",
          body: `You have a new order with ${group.items.length} item${group.items.length > 1 ? "s" : ""}.`,
          link: "/seller/orders",
        });
      }
    }
  } catch {
    // Notifications are best-effort
  }

  revalidatePath("/orders");
  revalidatePath("/cart");

  return { success: true, orderIds, orderNumbers };
}
