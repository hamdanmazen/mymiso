import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { getMockProducts, getMockSeller } from "@/lib/mock-data";
import type { Database } from "@/types/database";
import type { PaginatedResult } from "@/types/product";

type OrderRow = Database["public"]["Tables"]["orders"]["Row"];
type ProductRow = Database["public"]["Tables"]["products"]["Row"];

// --- Types ---

export type SellerStats = {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  pendingOrders: number;
  lowStockCount: number;
  revenueChange: number; // percentage vs previous period
  ordersChange: number;
};

export type SellerOrderSummary = {
  id: string;
  order_number: string;
  status: OrderRow["status"];
  total: number;
  currency: string;
  payment_method: OrderRow["payment_method"];
  buyer_name: string | null;
  item_count: number;
  created_at: string;
};

export type SellerProductRow = ProductRow & {
  category_name: string | null;
};

export type InventoryItem = {
  id: string;
  title: string;
  sku: string | null;
  thumbnail_url: string | null;
  stock_quantity: number;
  low_stock_threshold: number;
  price: number;
  currency: string;
  is_active: boolean;
  total_sold: number;
};

export type AnalyticsSummary = {
  revenueByDay: { date: string; revenue: number; orders: number }[];
  topProducts: { id: string; title: string; total_sold: number; revenue: number }[];
  ordersByStatus: Record<string, number>;
  averageOrderValue: number;
};

// --- Helper: get current seller ID for the authenticated user ---

export async function getCurrentSellerId(): Promise<string | null> {
  if (!isSupabaseConfigured()) return "s1"; // mock

  const supabase = (await createClient())!;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: seller } = await supabase
    .from("sellers")
    .select("id")
    .eq("user_id", user.id)
    .single();

  return seller?.id ?? null;
}

// --- Dashboard Stats ---

export async function getSellerDashboardStats(): Promise<SellerStats> {
  const empty: SellerStats = {
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    pendingOrders: 0,
    lowStockCount: 0,
    revenueChange: 0,
    ordersChange: 0,
  };

  if (!isSupabaseConfigured()) {
    // Return mock stats
    return {
      totalRevenue: 4_250.0,
      totalOrders: 38,
      totalProducts: 12,
      pendingOrders: 5,
      lowStockCount: 3,
      revenueChange: 12.5,
      ordersChange: 8.3,
    };
  }

  const sellerId = await getCurrentSellerId();
  if (!sellerId) return empty;

  const supabase = (await createClient())!;

  // Fetch stats in parallel
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000).toISOString();
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 86400000).toISOString();

  const [ordersResult, prevOrdersResult, productsResult, lowStockResult] =
    await Promise.all([
      // Current period orders (last 30 days)
      supabase
        .from("orders")
        .select("total, status", { count: "exact" })
        .eq("seller_id", sellerId)
        .gte("created_at", thirtyDaysAgo),
      // Previous period orders (30-60 days ago)
      supabase
        .from("orders")
        .select("total", { count: "exact" })
        .eq("seller_id", sellerId)
        .gte("created_at", sixtyDaysAgo)
        .lt("created_at", thirtyDaysAgo),
      // Total products
      supabase
        .from("products")
        .select("id", { count: "exact" })
        .eq("seller_id", sellerId),
      // Low stock products
      supabase
        .from("products")
        .select("id", { count: "exact" })
        .eq("seller_id", sellerId)
        .eq("is_active", true)
        .lt("stock_quantity", 5), // using default threshold
    ]);

  const currentOrders = ordersResult.data ?? [];
  const totalRevenue = currentOrders.reduce(
    (sum, o) => sum + (o.total ?? 0),
    0
  );
  const pendingOrders = currentOrders.filter(
    (o) => o.status === "pending" || o.status === "confirmed"
  ).length;

  const prevRevenue = (prevOrdersResult.data ?? []).reduce(
    (sum, o) => sum + (o.total ?? 0),
    0
  );
  const prevOrderCount = prevOrdersResult.count ?? 0;
  const currentOrderCount = ordersResult.count ?? 0;

  const revenueChange =
    prevRevenue > 0
      ? Math.round(((totalRevenue - prevRevenue) / prevRevenue) * 1000) / 10
      : 0;
  const ordersChange =
    prevOrderCount > 0
      ? Math.round(
          ((currentOrderCount - prevOrderCount) / prevOrderCount) * 1000
        ) / 10
      : 0;

  return {
    totalRevenue,
    totalOrders: currentOrderCount,
    totalProducts: productsResult.count ?? 0,
    pendingOrders,
    lowStockCount: lowStockResult.count ?? 0,
    revenueChange,
    ordersChange,
  };
}

// --- Seller's Own Products (for management) ---

export async function getSellerProducts(
  page: number = 1,
  limit: number = 20,
  search?: string,
  statusFilter?: "all" | "active" | "inactive"
): Promise<PaginatedResult<SellerProductRow>> {
  const empty: PaginatedResult<SellerProductRow> = {
    data: [],
    total: 0,
    page,
    limit,
    totalPages: 0,
  };

  if (!isSupabaseConfigured()) {
    // Return mock products for seller s1
    const mock = getMockProducts({ sellerId: "s1", page, limit, search });
    const products: SellerProductRow[] = mock.data.map((p) => ({
      id: p.id,
      seller_id: "s1",
      category_id: "cat-1",
      title: p.title,
      slug: p.slug,
      description: null,
      price: p.price,
      compare_at_price: p.compare_at_price,
      currency: p.currency,
      sku: `SKU-${p.id}`,
      stock_quantity: p.stock_quantity,
      low_stock_threshold: 5,
      images: p.images,
      thumbnail_url: p.thumbnail_url,
      tags: [],
      is_active: true,
      is_featured: false,
      is_flash_deal: p.is_flash_deal,
      flash_deal_ends_at: p.flash_deal_ends_at,
      rating_average: p.rating_average,
      rating_count: p.rating_count,
      total_sold: p.total_sold,
      shipping_weight: null,
      shipping_free: p.shipping_free,
      shipping_origin_country: "Lebanon",
      metadata: {},
      created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
      category_name: "Electronics",
    }));
    return { data: products, total: mock.total, page, limit, totalPages: mock.totalPages };
  }

  const sellerId = await getCurrentSellerId();
  if (!sellerId) return empty;

  const supabase = (await createClient())!;
  const offset = (page - 1) * limit;

  let query = supabase
    .from("products")
    .select("*, category:categories(name)", { count: "exact" })
    .eq("seller_id", sellerId)
    .order("created_at", { ascending: false });

  if (search) {
    query = query.ilike("title", `%${search}%`);
  }
  if (statusFilter === "active") {
    query = query.eq("is_active", true);
  } else if (statusFilter === "inactive") {
    query = query.eq("is_active", false);
  }

  query = query.range(offset, offset + limit - 1);

  const { data, count, error } = await query;
  if (error || !data) return empty;

  const products: SellerProductRow[] = data.map((row: Record<string, unknown>) => ({
    ...(row as unknown as ProductRow),
    category_name: (row.category as { name: string } | null)?.name ?? null,
  }));

  const total = count ?? 0;
  return { data: products, total, page, limit, totalPages: Math.ceil(total / limit) };
}

// --- Seller's Product by ID (for editing) ---

export async function getSellerProductById(
  productId: string
): Promise<(ProductRow & { category_name: string | null; variants: Database["public"]["Tables"]["product_variants"]["Row"][] }) | null> {
  if (!isSupabaseConfigured()) {
    const mock = getMockProducts({ sellerId: "s1" });
    const found = mock.data.find((p) => p.id === productId);
    if (!found) return null;
    return {
      id: found.id,
      seller_id: "s1",
      category_id: "cat-1",
      title: found.title,
      slug: found.slug,
      description: `High-quality ${found.title.toLowerCase()} with premium materials.`,
      price: found.price,
      compare_at_price: found.compare_at_price,
      currency: found.currency,
      sku: `SKU-${found.id}`,
      stock_quantity: found.stock_quantity,
      low_stock_threshold: 5,
      images: found.images,
      thumbnail_url: found.thumbnail_url,
      tags: ["bestseller"],
      is_active: true,
      is_featured: false,
      is_flash_deal: found.is_flash_deal,
      flash_deal_ends_at: found.flash_deal_ends_at,
      rating_average: found.rating_average,
      rating_count: found.rating_count,
      total_sold: found.total_sold,
      shipping_weight: 0.5,
      shipping_free: found.shipping_free,
      shipping_origin_country: "Lebanon",
      metadata: {},
      created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
      category_name: "Electronics",
      variants: [],
    };
  }

  const sellerId = await getCurrentSellerId();
  if (!sellerId) return null;

  const supabase = (await createClient())!;

  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(name)")
    .eq("id", productId)
    .eq("seller_id", sellerId)
    .single();

  if (error || !data) return null;

  const { data: variants } = await supabase
    .from("product_variants")
    .select("*")
    .eq("product_id", productId)
    .order("created_at");

  const row = data as Record<string, unknown>;
  return {
    ...(data as unknown as ProductRow),
    category_name: (row.category as { name: string } | null)?.name ?? null,
    variants: variants ?? [],
  };
}

// --- Seller Orders ---

export async function getSellerOrders(
  page: number = 1,
  limit: number = 10,
  statusFilter?: string
): Promise<PaginatedResult<SellerOrderSummary>> {
  const empty: PaginatedResult<SellerOrderSummary> = {
    data: [],
    total: 0,
    page,
    limit,
    totalPages: 0,
  };

  if (!isSupabaseConfigured()) {
    // Return mock orders
    const statuses: OrderRow["status"][] = [
      "pending", "confirmed", "processing", "shipped", "delivered",
    ];
    const mockOrders: SellerOrderSummary[] = Array.from({ length: 8 }, (_, i) => ({
      id: `order-${i + 1}`,
      order_number: `MYM-20260412-${String(i + 1).padStart(4, "0")}`,
      status: statuses[i % statuses.length],
      total: 29.99 + i * 15.5,
      currency: "USD",
      payment_method: (["whish", "tap", "cod"] as const)[i % 3],
      buyer_name: ["Sarah M.", "Ahmad K.", "Layla R.", "Omar H.", "Nadia B.", "Hassan T.", "Mira S.", "Ali F."][i],
      item_count: 1 + (i % 3),
      created_at: new Date(Date.now() - i * 86400000).toISOString(),
    }));

    let filtered = mockOrders;
    if (statusFilter && statusFilter !== "all") {
      filtered = filtered.filter((o) => o.status === statusFilter);
    }

    const start = (page - 1) * limit;
    const sliced = filtered.slice(start, start + limit);
    return {
      data: sliced,
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit),
    };
  }

  const sellerId = await getCurrentSellerId();
  if (!sellerId) return empty;

  const supabase = (await createClient())!;
  const offset = (page - 1) * limit;

  let query = supabase
    .from("orders")
    .select("*, buyer:profiles!orders_buyer_id_fkey(full_name)", { count: "exact" })
    .eq("seller_id", sellerId)
    .order("created_at", { ascending: false });

  if (statusFilter && statusFilter !== "all") {
    query = query.eq("status", statusFilter as OrderRow["status"]);
  }

  query = query.range(offset, offset + limit - 1);

  const { data, count, error } = await query;
  if (error || !data) return empty;

  // Get item counts
  const orderIds = data.map((o: Record<string, unknown>) => o.id as string);
  const { data: items } = await supabase
    .from("order_items")
    .select("order_id")
    .in("order_id", orderIds);

  const countMap = new Map<string, number>();
  for (const item of items ?? []) {
    countMap.set(item.order_id, (countMap.get(item.order_id) ?? 0) + 1);
  }

  const summaries: SellerOrderSummary[] = data.map((order: Record<string, unknown>) => ({
    id: order.id as string,
    order_number: order.order_number as string,
    status: order.status as OrderRow["status"],
    total: order.total as number,
    currency: order.currency as string,
    payment_method: order.payment_method as OrderRow["payment_method"],
    buyer_name: (order.buyer as { full_name: string | null } | null)?.full_name ?? null,
    item_count: countMap.get(order.id as string) ?? 0,
    created_at: order.created_at as string,
  }));

  const total = count ?? 0;
  return { data: summaries, total, page, limit, totalPages: Math.ceil(total / limit) };
}

// --- Inventory ---

export async function getSellerInventory(
  page: number = 1,
  limit: number = 20,
  filter?: "all" | "low" | "out"
): Promise<PaginatedResult<InventoryItem>> {
  const empty: PaginatedResult<InventoryItem> = {
    data: [],
    total: 0,
    page,
    limit,
    totalPages: 0,
  };

  if (!isSupabaseConfigured()) {
    const mock = getMockProducts({ sellerId: "s1", page, limit });
    const items: InventoryItem[] = mock.data.map((p) => ({
      id: p.id,
      title: p.title,
      sku: `SKU-${p.id}`,
      thumbnail_url: p.thumbnail_url,
      stock_quantity: p.stock_quantity,
      low_stock_threshold: 5,
      price: p.price,
      currency: p.currency,
      is_active: true,
      total_sold: p.total_sold,
    }));
    return { data: items, total: mock.total, page, limit, totalPages: mock.totalPages };
  }

  const sellerId = await getCurrentSellerId();
  if (!sellerId) return empty;

  const supabase = (await createClient())!;
  const offset = (page - 1) * limit;

  let query = supabase
    .from("products")
    .select("id, title, sku, thumbnail_url, stock_quantity, low_stock_threshold, price, currency, is_active, total_sold", {
      count: "exact",
    })
    .eq("seller_id", sellerId)
    .order("stock_quantity", { ascending: true });

  if (filter === "low") {
    // Products where stock is below threshold but > 0
    query = query.gt("stock_quantity", 0).lt("stock_quantity", 5);
  } else if (filter === "out") {
    query = query.eq("stock_quantity", 0);
  }

  query = query.range(offset, offset + limit - 1);

  const { data, count, error } = await query;
  if (error || !data) return empty;

  const total = count ?? 0;
  return {
    data: data as InventoryItem[],
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

// --- Analytics ---

export async function getSellerAnalytics(): Promise<AnalyticsSummary> {
  const empty: AnalyticsSummary = {
    revenueByDay: [],
    topProducts: [],
    ordersByStatus: {},
    averageOrderValue: 0,
  };

  if (!isSupabaseConfigured()) {
    // Mock analytics
    const days = Array.from({ length: 14 }, (_, i) => {
      const d = new Date(Date.now() - (13 - i) * 86400000);
      return {
        date: d.toISOString().split("T")[0],
        revenue: Math.round((80 + Math.random() * 200) * 100) / 100,
        orders: Math.floor(2 + Math.random() * 6),
      };
    });
    return {
      revenueByDay: days,
      topProducts: [
        { id: "mock-1", title: "Wireless Bluetooth Headphones Pro", total_sold: 45, revenue: 1345.55 },
        { id: "mock-6", title: "Smart Watch Series X", total_sold: 32, revenue: 2559.68 },
        { id: "mock-11", title: "4K Ultra HD Webcam", total_sold: 28, revenue: 1399.72 },
        { id: "mock-16", title: "Mechanical Keyboard RGB", total_sold: 22, revenue: 1759.78 },
        { id: "mock-21", title: "Portable Bluetooth Speaker", total_sold: 18, revenue: 539.82 },
      ],
      ordersByStatus: {
        pending: 5,
        confirmed: 8,
        processing: 3,
        shipped: 12,
        delivered: 45,
        cancelled: 2,
      },
      averageOrderValue: 65.5,
    };
  }

  const sellerId = await getCurrentSellerId();
  if (!sellerId) return empty;

  const supabase = (await createClient())!;
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString();

  // Get all orders for last 30 days
  const { data: orders } = await supabase
    .from("orders")
    .select("id, total, status, created_at")
    .eq("seller_id", sellerId)
    .gte("created_at", thirtyDaysAgo)
    .order("created_at", { ascending: true });

  if (!orders || orders.length === 0) return empty;

  // Revenue by day
  const dayMap = new Map<string, { revenue: number; orders: number }>();
  const statusCount: Record<string, number> = {};

  for (const order of orders) {
    const day = order.created_at.split("T")[0];
    const existing = dayMap.get(day) ?? { revenue: 0, orders: 0 };
    existing.revenue += order.total;
    existing.orders += 1;
    dayMap.set(day, existing);

    statusCount[order.status] = (statusCount[order.status] ?? 0) + 1;
  }

  const revenueByDay = Array.from(dayMap.entries()).map(([date, data]) => ({
    date,
    revenue: Math.round(data.revenue * 100) / 100,
    orders: data.orders,
  }));

  // Top products by total_sold
  const { data: topProducts } = await supabase
    .from("products")
    .select("id, title, total_sold, price")
    .eq("seller_id", sellerId)
    .order("total_sold", { ascending: false })
    .limit(5);

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);

  return {
    revenueByDay,
    topProducts: (topProducts ?? []).map((p) => ({
      id: p.id,
      title: p.title,
      total_sold: p.total_sold,
      revenue: Math.round(p.total_sold * p.price * 100) / 100,
    })),
    ordersByStatus: statusCount,
    averageOrderValue:
      orders.length > 0
        ? Math.round((totalRevenue / orders.length) * 100) / 100
        : 0,
  };
}

// --- Recent orders for dashboard ---

export async function getSellerRecentOrders(
  limit: number = 5
): Promise<SellerOrderSummary[]> {
  const result = await getSellerOrders(1, limit);
  return result.data;
}

// --- Low stock alerts for dashboard ---

export async function getSellerLowStockProducts(
  limit: number = 5
): Promise<InventoryItem[]> {
  const result = await getSellerInventory(1, limit, "low");
  return result.data;
}
