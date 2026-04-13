import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { OrderWithItems, OrderSummary } from "@/types/order";
import type { PaginatedResult } from "@/types/product";

export async function getBuyerOrders(
  page: number = 1,
  limit: number = 10,
  statusFilter?: string
): Promise<PaginatedResult<OrderSummary>> {
  const empty = { data: [], total: 0, page, limit, totalPages: 0 };
  if (!isSupabaseConfigured()) return empty;

  const supabase = (await createClient())!;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return empty;

  let query = supabase
    .from("orders")
    .select("*", { count: "exact" })
    .eq("buyer_id", user.id)
    .order("created_at", { ascending: false });

  if (statusFilter && statusFilter !== "all") {
    query = query.eq(
      "status",
      statusFilter as "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded"
    );
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data: orders, count, error } = await query;
  if (error || !orders) return empty;

  // Fetch first item for each order (for thumbnail)
  const orderIds = orders.map((o) => o.id);
  const { data: firstItems } = await supabase
    .from("order_items")
    .select("order_id, product_snapshot, quantity")
    .in("order_id", orderIds);

  // Build item counts and first item per order
  const orderItemMap = new Map<
    string,
    { count: number; firstSnapshot: Record<string, unknown> | null }
  >();
  for (const item of firstItems ?? []) {
    const existing = orderItemMap.get(item.order_id);
    if (existing) {
      existing.count += 1;
    } else {
      orderItemMap.set(item.order_id, {
        count: 1,
        firstSnapshot: item.product_snapshot as Record<string, unknown> | null,
      });
    }
  }

  const summaries: OrderSummary[] = orders.map((order) => {
    const itemInfo = orderItemMap.get(order.id);
    const snapshot = itemInfo?.firstSnapshot;
    return {
      id: order.id,
      order_number: order.order_number,
      status: order.status,
      total: order.total,
      currency: order.currency,
      payment_method: order.payment_method,
      item_count: itemInfo?.count ?? 0,
      first_item_thumbnail: (snapshot?.thumbnail_url as string) ?? null,
      first_item_title: (snapshot?.title as string) ?? null,
      created_at: order.created_at,
    };
  });

  return {
    data: summaries,
    total: count ?? 0,
    page,
    limit,
    totalPages: Math.ceil((count ?? 0) / limit),
  };
}

export async function getOrderById(
  orderId: string
): Promise<OrderWithItems | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = (await createClient())!;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (error || !order) return null;

  // RLS ensures buyer can only see own orders
  const { data: items } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", orderId)
    .order("created_at", { ascending: true });

  return {
    ...order,
    items: items ?? [],
  };
}
