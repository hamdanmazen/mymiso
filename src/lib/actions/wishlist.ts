"use server";

import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleWishlist(productId: string) {
  if (!isSupabaseConfigured()) {
    return { error: "Not authenticated", added: false };
  }

  const supabase = (await createClient())!;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated", added: false };
  }

  const { data: existing } = await supabase
    .from("wishlist_items")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("wishlist_items")
      .delete()
      .eq("id", existing.id);

    if (error) return { error: error.message, added: false };

    revalidatePath("/wishlist");
    return { success: true, added: false };
  } else {
    const { error } = await supabase.from("wishlist_items").insert({
      user_id: user.id,
      product_id: productId,
    });

    if (error) return { error: error.message, added: false };

    revalidatePath("/wishlist");
    return { success: true, added: true };
  }
}

export async function removeFromWishlist(productId: string) {
  if (!isSupabaseConfigured()) return { error: "Not authenticated" };

  const supabase = (await createClient())!;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("wishlist_items")
    .delete()
    .eq("user_id", user.id)
    .eq("product_id", productId);

  if (error) return { error: error.message };

  revalidatePath("/wishlist");
  return { success: true };
}
