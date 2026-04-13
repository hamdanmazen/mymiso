"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/queries/admin";
import { revalidatePath } from "next/cache";

// --- User Management ---

export async function updateUserRole(userId: string, role: string) {
  await requireAdmin();
  const supabase = (await createClient())!;

  const { error } = await supabase
    .from("profiles")
    .update({ role: role as any })
    .eq("id", userId);

  if (error) return { error: error.message };
  revalidatePath("/admin/users");
  return { success: true };
}

// --- Seller Management ---

export async function verifySeller(sellerId: string, verified: boolean) {
  await requireAdmin();
  const supabase = (await createClient())!;

  const { error } = await supabase
    .from("sellers")
    .update({ is_verified: verified })
    .eq("id", sellerId);

  if (error) return { error: error.message };
  revalidatePath("/admin/sellers");
  return { success: true };
}

// --- Product Moderation ---

export async function toggleProductActive(productId: string, active: boolean) {
  await requireAdmin();
  const supabase = (await createClient())!;

  const { error } = await supabase
    .from("products")
    .update({ is_active: active })
    .eq("id", productId);

  if (error) return { error: error.message };
  revalidatePath("/admin/products");
  return { success: true };
}

export async function toggleProductFeatured(productId: string, featured: boolean) {
  await requireAdmin();
  const supabase = (await createClient())!;

  const { error } = await supabase
    .from("products")
    .update({ is_featured: featured })
    .eq("id", productId);

  if (error) return { error: error.message };
  revalidatePath("/admin/products");
  return { success: true };
}

// --- Category Management ---

export async function createCategory(input: {
  name: string;
  slug: string;
  icon?: string;
  parent_id?: string | null;
  sort_order?: number;
}) {
  await requireAdmin();
  const supabase = (await createClient())!;

  const { error } = await supabase.from("categories").insert({
    name: input.name,
    slug: input.slug,
    icon: input.icon || null,
    parent_id: input.parent_id || null,
    sort_order: input.sort_order ?? 0,
  });

  if (error) return { error: error.message };
  revalidatePath("/admin/categories");
  return { success: true };
}

export async function updateCategory(
  categoryId: string,
  input: {
    name?: string;
    slug?: string;
    icon?: string;
    parent_id?: string | null;
    sort_order?: number;
  }
) {
  await requireAdmin();
  const supabase = (await createClient())!;

  const { error } = await supabase
    .from("categories")
    .update(input)
    .eq("id", categoryId);

  if (error) return { error: error.message };
  revalidatePath("/admin/categories");
  return { success: true };
}

export async function deleteCategory(categoryId: string) {
  await requireAdmin();
  const supabase = (await createClient())!;

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", categoryId);

  if (error) return { error: error.message };
  revalidatePath("/admin/categories");
  return { success: true };
}

// --- Order Management ---

export async function adminUpdateOrderStatus(
  orderId: string,
  status: string
) {
  await requireAdmin();
  const supabase = (await createClient())!;

  const { error } = await supabase
    .from("orders")
    .update({ status: status as any })
    .eq("id", orderId);

  if (error) return { error: error.message };
  revalidatePath("/admin/orders");
  return { success: true };
}

// --- Review Moderation ---

export async function deleteReview(reviewId: string) {
  await requireAdmin();
  const supabase = (await createClient())!;

  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("id", reviewId);

  if (error) return { error: error.message };
  revalidatePath("/admin/reviews");
  return { success: true };
}
