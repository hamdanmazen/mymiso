import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Database } from "@/types/database";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type SellerRow = Database["public"]["Tables"]["sellers"]["Row"];
type ProductRow = Database["public"]["Tables"]["products"]["Row"];
type OrderRow = Database["public"]["Tables"]["orders"]["Row"];
type ReviewRow = Database["public"]["Tables"]["reviews"]["Row"];
type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];

// --- Auth helper ---

export async function requireAdmin(): Promise<string> {
  if (!isSupabaseConfigured()) redirect("/login");

  const supabase = (await createClient())!;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/admin/dashboard");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/");
  return user.id;
}

// --- Dashboard Stats ---

export type AdminStats = {
  totalUsers: number;
  totalSellers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  activeProducts: number;
  verifiedSellers: number;
};

export async function getAdminStats(): Promise<AdminStats> {
  const empty: AdminStats = {
    totalUsers: 0,
    totalSellers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    activeProducts: 0,
    verifiedSellers: 0,
  };

  await requireAdmin();
  const supabase = (await createClient())!;

  const [users, sellers, products, orders] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("sellers").select("id, is_verified", { count: "exact" }),
    supabase.from("products").select("id, is_active", { count: "exact" }),
    supabase.from("orders").select("id, status, total"),
  ]);

  const verifiedSellers = sellers.data?.filter((s) => s.is_verified).length ?? 0;
  const activeProducts = products.data?.filter((p) => p.is_active).length ?? 0;
  const pendingOrders = orders.data?.filter((o) => o.status === "pending").length ?? 0;
  const totalRevenue = orders.data
    ?.filter((o) => o.status !== "cancelled" && o.status !== "refunded")
    .reduce((sum, o) => sum + Number(o.total), 0) ?? 0;

  return {
    totalUsers: users.count ?? 0,
    totalSellers: sellers.count ?? 0,
    totalProducts: products.count ?? 0,
    totalOrders: orders.data?.length ?? 0,
    totalRevenue,
    pendingOrders,
    activeProducts,
    verifiedSellers,
  };
}

export type RecentOrder = {
  id: string;
  order_number: string;
  status: string;
  total: number;
  currency: string;
  buyer_name: string | null;
  seller_name: string | null;
  created_at: string;
};

export async function getAdminRecentOrders(limit = 10): Promise<RecentOrder[]> {
  await requireAdmin();
  const supabase = (await createClient())!;

  const { data } = await supabase
    .from("orders")
    .select(`
      id, order_number, status, total, currency, created_at,
      profiles!orders_buyer_id_fkey(full_name),
      sellers!orders_seller_id_fkey(shop_name)
    `)
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data ?? []).map((o: any) => ({
    id: o.id,
    order_number: o.order_number,
    status: o.status,
    total: Number(o.total),
    currency: o.currency,
    buyer_name: o.profiles?.full_name ?? null,
    seller_name: o.sellers?.shop_name ?? null,
    created_at: o.created_at,
  }));
}

// --- Users ---

export type AdminUser = ProfileRow & {
  email: string;
  seller_count: number;
};

export async function getAdminUsers(
  page = 1,
  limit = 20,
  search?: string,
  roleFilter?: string
): Promise<{ data: AdminUser[]; total: number }> {
  await requireAdmin();
  const supabase = (await createClient())!;

  let query = supabase
    .from("profiles")
    .select("*, sellers(id)", { count: "exact" });

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,phone.ilike.%${search}%`);
  }
  if (roleFilter && roleFilter !== "all") {
    query = query.eq("role", roleFilter as any);
  }

  const { data, count } = await query
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  return {
    data: (data ?? []).map((u: any) => ({
      ...u,
      email: "",
      seller_count: u.sellers?.length ?? 0,
    })),
    total: count ?? 0,
  };
}

// --- Sellers ---

export type AdminSeller = SellerRow & {
  owner_name: string | null;
  product_count: number;
  order_count: number;
};

export async function getAdminSellers(
  page = 1,
  limit = 20,
  search?: string,
  verified?: string
): Promise<{ data: AdminSeller[]; total: number }> {
  await requireAdmin();
  const supabase = (await createClient())!;

  let query = supabase
    .from("sellers")
    .select("*, profiles!sellers_user_id_fkey(full_name), products(id), orders(id)", {
      count: "exact",
    });

  if (search) {
    query = query.ilike("shop_name", `%${search}%`);
  }
  if (verified === "verified") {
    query = query.eq("is_verified", true);
  } else if (verified === "unverified") {
    query = query.eq("is_verified", false);
  }

  const { data, count } = await query
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  return {
    data: (data ?? []).map((s: any) => ({
      ...s,
      owner_name: s.profiles?.full_name ?? null,
      product_count: s.products?.length ?? 0,
      order_count: s.orders?.length ?? 0,
    })),
    total: count ?? 0,
  };
}

// --- Products ---

export type AdminProduct = ProductRow & {
  seller_name: string | null;
  category_name: string | null;
};

export async function getAdminProducts(
  page = 1,
  limit = 20,
  search?: string,
  statusFilter?: string
): Promise<{ data: AdminProduct[]; total: number }> {
  await requireAdmin();
  const supabase = (await createClient())!;

  let query = supabase
    .from("products")
    .select("*, sellers!products_seller_id_fkey(shop_name), categories!products_category_id_fkey(name)", {
      count: "exact",
    });

  if (search) {
    query = query.ilike("title", `%${search}%`);
  }
  if (statusFilter === "active") {
    query = query.eq("is_active", true);
  } else if (statusFilter === "inactive") {
    query = query.eq("is_active", false);
  } else if (statusFilter === "featured") {
    query = query.eq("is_featured", true);
  } else if (statusFilter === "flash") {
    query = query.eq("is_flash_deal", true);
  }

  const { data, count } = await query
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  return {
    data: (data ?? []).map((p: any) => ({
      ...p,
      seller_name: p.sellers?.shop_name ?? null,
      category_name: p.categories?.name ?? null,
    })),
    total: count ?? 0,
  };
}

// --- Orders ---

export type AdminOrder = OrderRow & {
  buyer_name: string | null;
  seller_name: string | null;
  item_count: number;
};

export async function getAdminOrders(
  page = 1,
  limit = 20,
  search?: string,
  statusFilter?: string
): Promise<{ data: AdminOrder[]; total: number }> {
  await requireAdmin();
  const supabase = (await createClient())!;

  let query = supabase
    .from("orders")
    .select(`
      *,
      profiles!orders_buyer_id_fkey(full_name),
      sellers!orders_seller_id_fkey(shop_name),
      order_items(id)
    `, { count: "exact" });

  if (search) {
    query = query.ilike("order_number", `%${search}%`);
  }
  if (statusFilter && statusFilter !== "all") {
    query = query.eq("status", statusFilter as any);
  }

  const { data, count } = await query
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  return {
    data: (data ?? []).map((o: any) => ({
      ...o,
      buyer_name: o.profiles?.full_name ?? null,
      seller_name: o.sellers?.shop_name ?? null,
      item_count: o.order_items?.length ?? 0,
    })),
    total: count ?? 0,
  };
}

// --- Categories ---

export async function getAdminCategories(): Promise<CategoryRow[]> {
  await requireAdmin();
  const supabase = (await createClient())!;

  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  return data ?? [];
}

// --- Reviews ---

export type AdminReview = ReviewRow & {
  product_title: string | null;
  reviewer_name: string | null;
};

export async function getAdminReviews(
  page = 1,
  limit = 20,
  search?: string
): Promise<{ data: AdminReview[]; total: number }> {
  await requireAdmin();
  const supabase = (await createClient())!;

  let query = supabase
    .from("reviews")
    .select(`
      *,
      products!reviews_product_id_fkey(title),
      profiles!reviews_user_id_fkey(full_name)
    `, { count: "exact" });

  if (search) {
    query = query.or(`title.ilike.%${search}%,body.ilike.%${search}%`);
  }

  const { data, count } = await query
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  return {
    data: (data ?? []).map((r: any) => ({
      ...r,
      product_title: r.products?.title ?? null,
      reviewer_name: r.profiles?.full_name ?? null,
    })),
    total: count ?? 0,
  };
}
