import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Service not configured" },
      { status: 503 }
    );
  }

  const body = await request.json();
  const { orderId } = body;

  if (!orderId) {
    return NextResponse.json(
      { error: "orderId is required" },
      { status: 400 }
    );
  }

  const supabase = createAdminClient()!;

  // Fetch the order
  const { data: order, error: fetchError } = await supabase
    .from("orders")
    .select("id, status, payment_method")
    .eq("id", orderId)
    .single();

  if (fetchError || !order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.payment_method !== "cod") {
    return NextResponse.json(
      { error: "Order is not Cash on Delivery" },
      { status: 400 }
    );
  }

  if (order.status !== "shipped") {
    return NextResponse.json(
      { error: `Order cannot be confirmed in status: ${order.status}` },
      { status: 400 }
    );
  }

  // Update order to delivered
  const { error: updateError } = await supabase
    .from("orders")
    .update({
      status: "delivered",
      cod_confirmed_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  if (updateError) {
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }

  // Create notification for buyer
  if (order) {
    await supabase.from("notifications").insert({
      user_id: (order as Record<string, unknown>).buyer_id as string,
      type: "order_delivered",
      title: "Order Delivered",
      body: "Your order has been delivered. Thank you for shopping with Mymiso!",
      link: `/orders/${orderId}`,
    });
  }

  return NextResponse.json({ success: true });
}
