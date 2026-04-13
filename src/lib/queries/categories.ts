import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { mockCategories, getMockProducts } from "@/lib/mock-data";
import type { Database } from "@/types/database";
import type { ProductCardData, ProductFilters, PaginatedResult } from "@/types/product";
import { getProducts } from "./products";

type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];

export async function getCategories(): Promise<CategoryRow[]> {
  if (!isSupabaseConfigured()) {
    return mockCategories;
  }

  const supabase = (await createClient())!;

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("getCategories error:", error);
    return [];
  }

  return data || [];
}

export async function getCategoryBySlug(
  slug: string
): Promise<CategoryRow | null> {
  if (!isSupabaseConfigured()) {
    return mockCategories.find((c) => c.slug === slug) || null;
  }

  const supabase = (await createClient())!;

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return data;
}

export async function getSubcategories(
  parentId: string
): Promise<CategoryRow[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = (await createClient())!;

  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("parent_id", parentId)
    .order("sort_order", { ascending: true });

  return data || [];
}

export async function getCategoryWithProducts(
  slug: string,
  filters: ProductFilters = {}
): Promise<{
  category: CategoryRow | null;
  subcategories: CategoryRow[];
  products: PaginatedResult<ProductCardData>;
}> {
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      category: null,
      subcategories: [],
      products: { data: [], total: 0, page: 1, limit: 20, totalPages: 0 },
    };
  }

  if (!isSupabaseConfigured()) {
    return {
      category,
      subcategories: [],
      products: getMockProducts({ ...filters, categorySlug: slug }),
    };
  }

  const [subcategories, products] = await Promise.all([
    getSubcategories(category.id),
    getProducts({ ...filters, categoryId: category.id }),
  ]);

  return { category, subcategories, products };
}
