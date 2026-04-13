"use server";

import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addToCart(
  productId: string,
  quantity: number = 1,
  variantId?: string | null
) {
  if (!isSupabaseConfigured()) {
    return { error: "Not authenticated" };
  }

  const supabase = (await createClient())!;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  let existingQuery = supabase
    .from("cart_items")
    .select("id, quantity")
    .eq("user_id", user.id)
    .eq("product_id", productId);

  if (variantId) {
    existingQuery = existingQuery.eq("variant_id", variantId);
  } else {
    existingQuery = existingQuery.is("variant_id", null);
  }

  const { data: existing } = await existingQuery.maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("cart_items")
      .update({ quantity: existing.quantity + quantity })
      .eq("id", existing.id);

    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("cart_items").insert({
      user_id: user.id,
      product_id: productId,
      variant_id: variantId || null,
      quantity,
    });

    if (error) return { error: error.message };
  }

  revalidatePath("/cart");
  return { success: true };
}

export async function updateCartQuantity(itemId: string, quantity: number) {
  if (!isSupabaseConfigured()) return { error: "Not authenticated" };
  const supabase = (await createClient())!;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  if (quantity <= 0) {
    return removeFromCart(itemId);
  }

  const { error } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("id", itemId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/cart");
  return { success: true };
}

export async function removeFromCart(itemId: string) {
  if (!isSupabaseConfigured()) return { error: "Not authenticated" };
  const supabase = (await createClient())!;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("id", itemId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/cart");
  return { success: true };
}

export async function clearCart() {
  if (!isSupabaseConfigured()) return { error: "Not authenticated" };
  const supabase = (await createClient())!;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/cart");
  return { success: true };
}
