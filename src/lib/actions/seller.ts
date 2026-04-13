"use server";

import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { getCurrentSellerId } from "@/lib/queries/seller-dashboard";
import type { Database } from "@/types/database";
import {
  productFormSchema,
  shopSettingsSchema,
  orderStatusUpdateSchema,
} from "@/lib/utils/validators";
import { slugify } from "@/lib/utils/slugify";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendOrderStatusUpdate } from "@/lib/email";

type ProductUpdate = Database["public"]["Tables"]["products"]["Update"];
type OrderUpdate = Database["public"]["Tables"]["orders"]["Update"];

// --- Product CRUD ---

export async function createProduct(input: {
  title: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  categoryId?: string;
  sku?: string;
  stockQuantity?: number;
  lowStockThreshold?: number;
  tags?: string[];
  isActive?: boolean;
  shippingWeight?: number;
  shippingFree?: boolean;
  shippingOriginCountry?: string;
  images?: string[];
}): Promise<{ success?: boolean; productId?: string; error?: string }> {
  if (!isSupabaseConfigured()) return { error: "Service not configured" };

  const sellerId = await getCurrentSellerId();
  if (!sellerId) return { error: "Not authenticated as a seller" };

  const parsed = productFormSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = (await createClient())!;
  const slug = slugify(input.title) + "-" + Date.now().toString(36);

  const { data, error } = await supabase
    .from("products")
    .insert({
      seller_id: sellerId,
      title: input.title,
      slug,
      description: input.description ?? null,
      price: input.price,
      compare_at_price: input.compareAtPrice ?? null,
      category_id: input.categoryId || null,
      sku: input.sku ?? null,
      stock_quantity: input.stockQuantity ?? 0,
      low_stock_threshold: input.lowStockThreshold ?? 5,
      tags: input.tags ?? [],
      is_active: input.isActive ?? true,
      shipping_weight: input.shippingWeight ?? null,
      shipping_free: input.shippingFree ?? false,
      shipping_origin_country: input.shippingOriginCountry ?? null,
      images: input.images ?? [],
      thumbnail_url: input.images?.[0] ?? null,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/seller/products");
  revalidatePath("/seller/dashboard");
  revalidatePath("/seller/inventory");

  return { success: true, productId: data.id };
}

export async function updateProduct(
  productId: string,
  input: {
    title?: string;
    description?: string;
    price?: number;
    compareAtPrice?: number | null;
    categoryId?: string | null;
    sku?: string | null;
    stockQuantity?: number;
    lowStockThreshold?: number;
    tags?: string[];
    isActive?: boolean;
    shippingWeight?: number | null;
    shippingFree?: boolean;
    shippingOriginCountry?: string | null;
    images?: string[];
  }
): Promise<{ success?: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { error: "Service not configured" };

  const sellerId = await getCurrentSellerId();
  if (!sellerId) return { error: "Not authenticated as a seller" };

  const supabase = (await createClient())!;

  // Verify ownership
  const { data: existing } = await supabase
    .from("products")
    .select("id")
    .eq("id", productId)
    .eq("seller_id", sellerId)
    .single();

  if (!existing) return { error: "Product not found" };

  const updateData: ProductUpdate = {
    updated_at: new Date().toISOString(),
  };

  if (input.title !== undefined) updateData.title = input.title;
  if (input.description !== undefined) updateData.description = input.description;
  if (input.price !== undefined) updateData.price = input.price;
  if (input.compareAtPrice !== undefined) updateData.compare_at_price = input.compareAtPrice;
  if (input.categoryId !== undefined) updateData.category_id = input.categoryId;
  if (input.sku !== undefined) updateData.sku = input.sku;
  if (input.stockQuantity !== undefined) updateData.stock_quantity = input.stockQuantity;
  if (input.lowStockThreshold !== undefined) updateData.low_stock_threshold = input.lowStockThreshold;
  if (input.tags !== undefined) updateData.tags = input.tags;
  if (input.isActive !== undefined) updateData.is_active = input.isActive;
  if (input.shippingWeight !== undefined) updateData.shipping_weight = input.shippingWeight;
  if (input.shippingFree !== undefined) updateData.shipping_free = input.shippingFree;
  if (input.shippingOriginCountry !== undefined) updateData.shipping_origin_country = input.shippingOriginCountry;
  if (input.images !== undefined) {
    updateData.images = input.images;
    updateData.thumbnail_url = input.images[0] ?? null;
  }

  const { error } = await supabase
    .from("products")
    .update(updateData)
    .eq("id", productId);

  if (error) return { error: error.message };

  revalidatePath("/seller/products");
  revalidatePath("/seller/dashboard");
  revalidatePath("/seller/inventory");
  revalidatePath(`/seller/products/${productId}/edit`);

  return { success: true };
}

export async function deleteProduct(
  productId: string
): Promise<{ success?: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { error: "Service not configured" };

  const sellerId = await getCurrentSellerId();
  if (!sellerId) return { error: "Not authenticated as a seller" };

  const supabase = (await createClient())!;

  // Soft delete by deactivating
  const { error } = await supabase
    .from("products")
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq("id", productId)
    .eq("seller_id", sellerId);

  if (error) return { error: error.message };

  revalidatePath("/seller/products");
  revalidatePath("/seller/dashboard");
  revalidatePath("/seller/inventory");

  return { success: true };
}

// --- Order Management ---

export async function updateOrderStatus(input: {
  orderId: string;
  status: "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  trackingNumber?: string;
  trackingUrl?: string;
}): Promise<{ success?: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { error: "Service not configured" };

  const parsed = orderStatusUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const sellerId = await getCurrentSellerId();
  if (!sellerId) return { error: "Not authenticated as a seller" };

  const supabase = (await createClient())!;

  // Verify seller owns this order
  const { data: order } = await supabase
    .from("orders")
    .select("id, status")
    .eq("id", input.orderId)
    .eq("seller_id", sellerId)
    .single();

  if (!order) return { error: "Order not found" };

  const updateData: OrderUpdate = {
    status: input.status,
    updated_at: new Date().toISOString(),
  };

  if (input.trackingNumber) updateData.tracking_number = input.trackingNumber;
  if (input.trackingUrl) updateData.tracking_url = input.trackingUrl;

  const { error } = await supabase
    .from("orders")
    .update(updateData)
    .eq("id", input.orderId);

  if (error) return { error: error.message };

  // Notify buyer about status change (best-effort)
  try {
    const { data: fullOrder } = await supabase
      .from("orders")
      .select("buyer_id, order_number")
      .eq("id", input.orderId)
      .single();

    if (fullOrder?.buyer_id) {
      const statusLabels: Record<string, string> = {
        confirmed: "confirmed",
        processing: "being prepared",
        shipped: "shipped",
        delivered: "delivered",
        cancelled: "cancelled",
      };

      const adminClient = createAdminClient();
      await adminClient.from("notifications").insert({
        user_id: fullOrder.buyer_id,
        type: `order_${input.status}`,
        title: `Order ${statusLabels[input.status] || "updated"}`,
        body: `Your order ${fullOrder.order_number} has been ${statusLabels[input.status] || "updated"}.`,
        link: `/orders/${input.orderId}`,
      });

      // Send email notification
      const { data: buyerProfile } = await adminClient
        .from("profiles")
        .select("id")
        .eq("id", fullOrder.buyer_id)
        .single();

      if (buyerProfile) {
        // Get buyer email from auth (via admin)
        const { data: { user: authUser } } = await adminClient.auth.admin.getUserById(fullOrder.buyer_id);
        if (authUser?.email) {
          sendOrderStatusUpdate({
            to: authUser.email,
            orderNumber: fullOrder.order_number,
            status: input.status,
            trackingNumber: input.trackingNumber,
            trackingUrl: input.trackingUrl,
          });
        }
      }
    }
  } catch {
    // Notifications are best-effort
  }

  revalidatePath("/seller/orders");
  revalidatePath("/seller/dashboard");

  return { success: true };
}

// --- Inventory ---

export async function updateStock(
  productId: string,
  quantity: number
): Promise<{ success?: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { error: "Service not configured" };

  const sellerId = await getCurrentSellerId();
  if (!sellerId) return { error: "Not authenticated as a seller" };

  if (quantity < 0) return { error: "Stock cannot be negative" };

  const supabase = (await createClient())!;

  const { error } = await supabase
    .from("products")
    .update({
      stock_quantity: quantity,
      updated_at: new Date().toISOString(),
    })
    .eq("id", productId)
    .eq("seller_id", sellerId);

  if (error) return { error: error.message };

  revalidatePath("/seller/inventory");
  revalidatePath("/seller/dashboard");

  return { success: true };
}

export async function bulkUpdateStock(
  updates: { productId: string; quantity: number }[]
): Promise<{ success?: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { error: "Service not configured" };

  const sellerId = await getCurrentSellerId();
  if (!sellerId) return { error: "Not authenticated as a seller" };

  const supabase = (await createClient())!;

  for (const { productId, quantity } of updates) {
    if (quantity < 0) continue;
    const { error } = await supabase
      .from("products")
      .update({
        stock_quantity: quantity,
        updated_at: new Date().toISOString(),
      })
      .eq("id", productId)
      .eq("seller_id", sellerId);

    if (error) return { error: `Failed to update ${productId}: ${error.message}` };
  }

  revalidatePath("/seller/inventory");
  revalidatePath("/seller/dashboard");

  return { success: true };
}

// --- Shop Settings ---

export async function updateShopSettings(input: {
  shopName: string;
  shopSlug: string;
  shopDescription?: string;
  country: string;
}): Promise<{ success?: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { error: "Service not configured" };

  const parsed = shopSettingsSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const sellerId = await getCurrentSellerId();
  if (!sellerId) return { error: "Not authenticated as a seller" };

  const supabase = (await createClient())!;

  const { error } = await supabase
    .from("sellers")
    .update({
      shop_name: input.shopName,
      shop_slug: input.shopSlug,
      shop_description: input.shopDescription ?? null,
      country: input.country,
      updated_at: new Date().toISOString(),
    })
    .eq("id", sellerId);

  if (error) {
    if (error.code === "23505") {
      return { error: "This shop URL is already taken" };
    }
    return { error: error.message };
  }

  revalidatePath("/seller/settings");
  revalidatePath("/seller/dashboard");

  return { success: true };
}
