import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { getProductThumbnailUrl } from "@/lib/utils/images";
import { getMockProducts, getMockProductDetail } from "@/lib/mock-data";
import type {
  ProductCardData,
  ProductFilters,
  ProductWithDetails,
  PaginatedResult,
} from "@/types/product";

const DEFAULT_LIMIT = 20;

function mapToCardData(
  product: Record<string, unknown>,
  seller: Record<string, unknown> | null
): ProductCardData {
  return {
    id: product.id as string,
    title: product.title as string,
    slug: product.slug as string,
    price: product.price as number,
    compare_at_price: product.compare_at_price as number | null,
    currency: product.currency as string,
    thumbnail_url:
      (product.thumbnail_url as string | null) ||
      getProductThumbnailUrl(product.id as string),
    images: (product.images as string[]) || [],
    rating_average: product.rating_average as number,
    rating_count: product.rating_count as number,
    total_sold: product.total_sold as number,
    is_flash_deal: product.is_flash_deal as boolean,
    flash_deal_ends_at: product.flash_deal_ends_at as string | null,
    shipping_free: product.shipping_free as boolean,
    stock_quantity: product.stock_quantity as number,
    seller: seller
      ? {
          id: seller.id as string,
          shop_name: seller.shop_name as string,
          shop_slug: seller.shop_slug as string,
          is_verified: seller.is_verified as boolean,
        }
      : null,
  };
}

export async function getProducts(
  filters: ProductFilters = {}
): Promise<PaginatedResult<ProductCardData>> {
  if (!isSupabaseConfigured()) {
    return getMockProducts(filters);
  }

  const supabase = (await createClient())!;
  const page = filters.page || 1;
  const limit = filters.limit || DEFAULT_LIMIT;
  const offset = (page - 1) * limit;

  let query = supabase
    .from("products")
    .select("*, seller:sellers!inner(id, shop_name, shop_slug, is_verified)", {
      count: "exact",
    })
    .eq("is_active", true);

  if (filters.categoryId) {
    query = query.eq("category_id", filters.categoryId);
  }
  if (filters.sellerId) {
    query = query.eq("seller_id", filters.sellerId);
  }
  if (filters.minPrice !== undefined) {
    query = query.gte("price", filters.minPrice);
  }
  if (filters.maxPrice !== undefined) {
    query = query.lte("price", filters.maxPrice);
  }
  if (filters.minRating !== undefined) {
    query = query.gte("rating_average", filters.minRating);
  }
  if (filters.shipping === "free") {
    query = query.eq("shipping_free", true);
  }
  if (filters.isFlashDeal) {
    query = query
      .eq("is_flash_deal", true)
      .gt("flash_deal_ends_at", new Date().toISOString());
  }
  if (filters.isFeatured) {
    query = query.eq("is_featured", true);
  }
  if (filters.search) {
    query = query.textSearch("title", filters.search, {
      type: "websearch",
      config: "english",
    });
  }

  switch (filters.sort) {
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    case "popular":
      query = query.order("total_sold", { ascending: false });
      break;
    case "rating":
      query = query.order("rating_average", { ascending: false });
      break;
    case "newest":
    default:
      query = query.order("created_at", { ascending: false });
      break;
  }

  query = query.range(offset, offset + limit - 1);

  const { data, count, error } = await query;

  if (error) {
    console.error("getProducts error:", error);
    return { data: [], total: 0, page, limit, totalPages: 0 };
  }

  const products = (data || []).map((row: Record<string, unknown>) => {
    const seller = row.seller as Record<string, unknown> | null;
    return mapToCardData(row, seller);
  });

  const total = count || 0;
  return {
    data: products,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getProductBySlug(
  slug: string
): Promise<ProductWithDetails | null> {
  if (!isSupabaseConfigured()) {
    return getMockProductDetail(slug) as unknown as ProductWithDetails;
  }

  const supabase = (await createClient())!;

  const { data, error } = await supabase
    .from("products")
    .select("*, seller:sellers(*), category:categories(*)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error || !data) return null;

  const product = data as Record<string, unknown>;

  const { data: variants } = await supabase
    .from("product_variants")
    .select("*")
    .eq("product_id", product.id as string)
    .eq("is_active", true)
    .order("created_at");

  return {
    ...(data as unknown as ProductWithDetails),
    seller: product.seller as ProductWithDetails["seller"],
    category: product.category as ProductWithDetails["category"],
    variants: variants || [],
  };
}

export async function getFlashDeals(
  limit: number = 10
): Promise<ProductCardData[]> {
  if (!isSupabaseConfigured()) {
    return getMockProducts({ isFlashDeal: true, limit }).data;
  }

  const supabase = (await createClient())!;

  const { data } = await supabase
    .from("products")
    .select("*, seller:sellers!inner(id, shop_name, shop_slug, is_verified)")
    .eq("is_active", true)
    .eq("is_flash_deal", true)
    .gt("flash_deal_ends_at", new Date().toISOString())
    .order("flash_deal_ends_at", { ascending: true })
    .limit(limit);

  return (data || []).map((row: Record<string, unknown>) =>
    mapToCardData(row, row.seller as Record<string, unknown> | null)
  );
}

export async function getTrendingProducts(
  limit: number = 10
): Promise<ProductCardData[]> {
  if (!isSupabaseConfigured()) {
    return getMockProducts({ sort: "popular", limit }).data;
  }

  const supabase = (await createClient())!;

  const { data } = await supabase
    .from("products")
    .select("*, seller:sellers!inner(id, shop_name, shop_slug, is_verified)")
    .eq("is_active", true)
    .order("total_sold", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data || []).map((row: Record<string, unknown>) =>
    mapToCardData(row, row.seller as Record<string, unknown> | null)
  );
}

export async function getBestSellers(
  limit: number = 10
): Promise<ProductCardData[]> {
  if (!isSupabaseConfigured()) {
    return getMockProducts({ sort: "popular", limit, page: 2 }).data;
  }

  const supabase = (await createClient())!;

  const { data } = await supabase
    .from("products")
    .select("*, seller:sellers!inner(id, shop_name, shop_slug, is_verified)")
    .eq("is_active", true)
    .order("total_sold", { ascending: false })
    .limit(limit);

  return (data || []).map((row: Record<string, unknown>) =>
    mapToCardData(row, row.seller as Record<string, unknown> | null)
  );
}

export async function getFeaturedProducts(
  limit: number = 10
): Promise<ProductCardData[]> {
  if (!isSupabaseConfigured()) {
    return getMockProducts({ isFeatured: true, limit }).data;
  }

  const supabase = (await createClient())!;

  const { data } = await supabase
    .from("products")
    .select("*, seller:sellers!inner(id, shop_name, shop_slug, is_verified)")
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data || []).map((row: Record<string, unknown>) =>
    mapToCardData(row, row.seller as Record<string, unknown> | null)
  );
}

export async function searchProducts(
  query: string,
  filters: ProductFilters = {}
): Promise<PaginatedResult<ProductCardData>> {
  return getProducts({ ...filters, search: query });
}

export async function getRelatedProducts(
  productId: string,
  categoryId: string | null,
  limit: number = 5
): Promise<ProductCardData[]> {
  if (!isSupabaseConfigured()) {
    return getMockProducts({ limit, sort: "rating" }).data.filter(
      (p) => p.id !== productId
    ).slice(0, limit);
  }

  const supabase = (await createClient())!;

  let query = supabase
    .from("products")
    .select("*, seller:sellers!inner(id, shop_name, shop_slug, is_verified)")
    .eq("is_active", true)
    .neq("id", productId);

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  const { data } = await query
    .order("rating_average", { ascending: false })
    .limit(limit);

  return (data || []).map((row: Record<string, unknown>) =>
    mapToCardData(row, row.seller as Record<string, unknown> | null)
  );
}
