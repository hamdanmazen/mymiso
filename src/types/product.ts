import type { Database } from "./database";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];
type SellerRow = Database["public"]["Tables"]["sellers"]["Row"];
type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];
type VariantRow = Database["public"]["Tables"]["product_variants"]["Row"];
type ReviewRow = Database["public"]["Tables"]["reviews"]["Row"];

export type ProductCardData = {
  id: string;
  title: string;
  slug: string;
  price: number;
  compare_at_price: number | null;
  currency: string;
  thumbnail_url: string | null;
  images: string[];
  rating_average: number;
  rating_count: number;
  total_sold: number;
  is_flash_deal: boolean;
  flash_deal_ends_at: string | null;
  shipping_free: boolean;
  stock_quantity: number;
  seller: {
    id: string;
    shop_name: string;
    shop_slug: string;
    is_verified: boolean;
  } | null;
};

export type ProductWithDetails = ProductRow & {
  seller: SellerRow | null;
  category: CategoryRow | null;
  variants: VariantRow[];
};

export type ProductWithReviews = ProductWithDetails & {
  reviews: (ReviewRow & {
    profile: { full_name: string | null; avatar_url: string | null } | null;
  })[];
};

export type ProductFilters = {
  categorySlug?: string;
  categoryId?: string;
  sellerId?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  shipping?: "free" | "all";
  search?: string;
  sort?: ProductSort;
  page?: number;
  limit?: number;
  isFlashDeal?: boolean;
  isFeatured?: boolean;
};

export type ProductSort =
  | "newest"
  | "price_asc"
  | "price_desc"
  | "popular"
  | "rating";

export type PaginatedResult<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type ReviewSummary = {
  average: number;
  total: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
};

export type CartItemData = {
  id: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  title: string;
  slug: string;
  price: number;
  compare_at_price: number | null;
  currency: string;
  thumbnail_url: string | null;
  stock_quantity: number;
  variantName: string | null;
  sellerId: string;
  sellerName: string;
};

export type WishlistItemData = {
  productId: string;
  addedAt: string;
};
