"use server";

import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { addressSchema, type AddressInput } from "@/lib/utils/validators";
import { revalidatePath } from "next/cache";

export async function getAddresses() {
  if (!isSupabaseConfigured()) return { data: [], error: null };
  const supabase = (await createClient())!;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { data: [], error: "Not authenticated" };

  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  return { data: data ?? [], error: error?.message ?? null };
}

export async function addAddress(input: AddressInput) {
  if (!isSupabaseConfigured()) return { error: "Not configured" };
  const supabase = (await createClient())!;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const parsed = addressSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const d = parsed.data;

  // If setting as default, un-default all others first
  if (d.isDefault) {
    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", user.id);
  }

  const { data, error } = await supabase
    .from("addresses")
    .insert({
      user_id: user.id,
      label: d.label,
      full_name: d.fullName,
      phone: d.phone ?? null,
      street_address: d.streetAddress,
      apartment: d.apartment ?? null,
      city: d.city,
      state: d.state ?? null,
      postal_code: d.postalCode,
      country: d.country,
      is_default: d.isDefault,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/addresses");
  revalidatePath("/checkout");
  return { success: true, addressId: data.id };
}

export async function updateAddress(id: string, input: AddressInput) {
  if (!isSupabaseConfigured()) return { error: "Not configured" };
  const supabase = (await createClient())!;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const parsed = addressSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const d = parsed.data;

  if (d.isDefault) {
    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", user.id);
  }

  const { error } = await supabase
    .from("addresses")
    .update({
      label: d.label,
      full_name: d.fullName,
      phone: d.phone ?? null,
      street_address: d.streetAddress,
      apartment: d.apartment ?? null,
      city: d.city,
      state: d.state ?? null,
      postal_code: d.postalCode,
      country: d.country,
      is_default: d.isDefault,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/addresses");
  revalidatePath("/checkout");
  return { success: true };
}

export async function deleteAddress(id: string) {
  if (!isSupabaseConfigured()) return { error: "Not configured" };
  const supabase = (await createClient())!;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("addresses")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/addresses");
  revalidatePath("/checkout");
  return { success: true };
}

export async function setDefaultAddress(id: string) {
  if (!isSupabaseConfigured()) return { error: "Not configured" };
  const supabase = (await createClient())!;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Un-default all
  await supabase
    .from("addresses")
    .update({ is_default: false })
    .eq("user_id", user.id);

  // Set this one as default
  const { error } = await supabase
    .from("addresses")
    .update({ is_default: true })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/addresses");
  revalidatePath("/checkout");
  return { success: true };
}
