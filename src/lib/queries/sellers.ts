import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { getMockSeller, getMockProducts } from "@/lib/mock-data";
import type { Database } from "@/types/database";
import type { ProductCardData, ProductFilters, PaginatedResult } from "@/types/product";
import { getProducts } from "./products";

type SellerRow = Database["public"]["Tables"]["sellers"]["Row"];

export type SellerWithProfile = SellerRow & {
  profile: { full_name: string | null; avatar_url: string | null } | null;
};

export async function getSellerById(
  id: string
): Promise<SellerWithProfile | null> {
  if (!isSupabaseConfigured()) {
    return getMockSeller(id) as unknown as SellerWithProfile;
  }

  const supabase = (await createClient())!;

  const { data, error } = await supabase
    .from("sellers")
    .select("*, profile:profiles!sellers_user_id_fkey(full_name, avatar_url)")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data as SellerWithProfile;
}

export async function getSellerBySlug(
  slug: string
): Promise<SellerWithProfile | null> {
  if (!isSupabaseConfigured()) {
    return getMockSeller(slug) as unknown as SellerWithProfile;
  }

  const supabase = (await createClient())!;

  const { data, error } = await supabase
    .from("sellers")
    .select("*, profile:profiles!sellers_user_id_fkey(full_name, avatar_url)")
    .eq("shop_slug", slug)
    .single();

  if (error || !data) return null;
  return data as SellerWithProfile;
}

export async function getSellerProducts(
  sellerId: string,
  filters: ProductFilters = {}
): Promise<PaginatedResult<ProductCardData>> {
  if (!isSupabaseConfigured()) {
    return getMockProducts({ ...filters, sellerId });
  }
  return getProducts({ ...filters, sellerId });
}
