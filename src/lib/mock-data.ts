import { getProductImageUrl, getProductThumbnailUrl } from "@/lib/utils/images";
import type { ProductCardData } from "@/types/product";
import type { Database } from "@/types/database";

type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];

const sellerNames = [
  { id: "s1", shop_name: "TechHub Store", shop_slug: "techhub-store", is_verified: true },
  { id: "s2", shop_name: "Fashion Forward", shop_slug: "fashion-forward", is_verified: true },
  { id: "s3", shop_name: "HomeStyle Co.", shop_slug: "homestyle-co", is_verified: false },
  { id: "s4", shop_name: "BeautyBox", shop_slug: "beautybox", is_verified: true },
  { id: "s5", shop_name: "SportZone", shop_slug: "sportzone", is_verified: false },
];

const productTitles = [
  "Wireless Bluetooth Headphones Pro",
  "Slim Fit Cotton T-Shirt",
  "Modern Minimalist Desk Lamp",
  "Organic Face Serum Set",
  "Running Shoes Ultra Light",
  "Smart Watch Series X",
  "Vintage Leather Crossbody Bag",
  "Ceramic Plant Pot Set of 3",
  "Natural Lip Gloss Collection",
  "Yoga Mat Premium Non-Slip",
  "4K Ultra HD Webcam",
  "Oversized Knit Sweater",
  "Bamboo Cutting Board Set",
  "Vitamin C Brightening Cream",
  "Resistance Bands Set (5 Pack)",
  "Mechanical Keyboard RGB",
  "High-Waist Denim Jeans",
  "Scented Candle Gift Box",
  "Hair Growth Treatment Oil",
  "Stainless Steel Water Bottle",
  "Portable Bluetooth Speaker",
  "Silk Pajama Set",
  "Cast Iron Skillet 12-inch",
  "Hydrating Sheet Mask Pack",
  "Adjustable Dumbbell Set",
  "USB-C Hub Multiport Adapter",
  "Floral Maxi Dress",
  "Memory Foam Pillow",
  "Anti-Aging Eye Cream",
  "Jump Rope Speed Pro",
  "Noise Cancelling Earbuds",
  "Linen Button-Down Shirt",
  "Air Purifier HEPA Filter",
  "Sunscreen SPF 50 Invisible",
  "Foam Roller Massage",
  "Laptop Stand Adjustable",
  "Canvas Tote Bag Large",
  "Essential Oil Diffuser",
  "Collagen Peptides Powder",
  "Hiking Backpack 40L",
  "Wireless Charging Pad",
  "Wool Blend Coat",
  "Robot Vacuum Cleaner",
  "Retinol Night Serum",
  "Boxing Gloves Pro",
  "Gaming Mouse Wireless",
  "Pleated Midi Skirt",
  "French Press Coffee Maker",
  "Tea Tree Acne Treatment",
  "Compression Socks (3 Pack)",
];

const categoryMap = [0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3, 4];

function generateMockProduct(index: number): ProductCardData {
  const id = `mock-${index + 1}`;
  const sellerIndex = index % sellerNames.length;
  const basePrice = 9.99 + (index * 7.33) % 200;
  const price = Math.round(basePrice * 100) / 100;
  const hasDiscount = index % 3 === 0;
  const compareAtPrice = hasDiscount ? Math.round(price * 1.4 * 100) / 100 : null;

  return {
    id,
    title: productTitles[index % productTitles.length],
    slug: productTitles[index % productTitles.length]
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/-+$/, "") + `-${index + 1}`,
    price,
    compare_at_price: compareAtPrice,
    currency: "USD",
    thumbnail_url: getProductThumbnailUrl(id),
    images: Array.from({ length: 4 }, (_, i) => getProductImageUrl(id, i)),
    rating_average: Math.round((3 + (index * 0.37) % 2) * 10) / 10,
    rating_count: 5 + ((index * 13) % 200),
    total_sold: 10 + ((index * 37) % 500),
    is_flash_deal: index < 6,
    flash_deal_ends_at: index < 6
      ? new Date(Date.now() + (2 + index) * 3600000).toISOString()
      : null,
    shipping_free: index % 4 === 0,
    stock_quantity: 3 + ((index * 7) % 50),
    seller: sellerNames[sellerIndex],
  };
}

const allMockProducts: ProductCardData[] = Array.from(
  { length: 50 },
  (_, i) => generateMockProduct(i)
);

export function getMockProducts(options: {
  page?: number;
  limit?: number;
  sort?: string;
  isFlashDeal?: boolean;
  isFeatured?: boolean;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  shipping?: string;
  categorySlug?: string;
  sellerId?: string;
} = {}) {
  let filtered = [...allMockProducts];

  if (options.isFlashDeal) {
    filtered = filtered.filter((p) => p.is_flash_deal);
  }
  if (options.isFeatured) {
    filtered = filtered.filter((_, i) => i % 5 === 0);
  }
  if (options.search) {
    const q = options.search.toLowerCase();
    filtered = filtered.filter((p) => p.title.toLowerCase().includes(q));
  }
  if (options.minPrice !== undefined) {
    filtered = filtered.filter((p) => p.price >= options.minPrice!);
  }
  if (options.maxPrice !== undefined) {
    filtered = filtered.filter((p) => p.price <= options.maxPrice!);
  }
  if (options.minRating !== undefined) {
    filtered = filtered.filter((p) => p.rating_average >= options.minRating!);
  }
  if (options.shipping === "free") {
    filtered = filtered.filter((p) => p.shipping_free);
  }
  if (options.sellerId) {
    filtered = filtered.filter((p) => p.seller?.id === options.sellerId);
  }

  switch (options.sort) {
    case "price_asc":
      filtered.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      filtered.sort((a, b) => b.price - a.price);
      break;
    case "popular":
      filtered.sort((a, b) => b.total_sold - a.total_sold);
      break;
    case "rating":
      filtered.sort((a, b) => b.rating_average - a.rating_average);
      break;
  }

  const page = options.page || 1;
  const limit = options.limit || 20;
  const total = filtered.length;
  const start = (page - 1) * limit;
  const data = filtered.slice(start, start + limit);

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export function getMockProductBySlug(slug: string) {
  const product = allMockProducts.find((p) => p.slug === slug);
  if (!product) return allMockProducts[0];
  return product;
}

export function getMockProductDetail(slug: string) {
  const card = getMockProductBySlug(slug);
  return {
    id: card.id,
    seller_id: card.seller?.id || "s1",
    category_id: "cat-1",
    title: card.title,
    slug: card.slug,
    description: `This is a high-quality ${card.title.toLowerCase()}. Made with premium materials and designed for everyday use. Our customers love the attention to detail and exceptional build quality.\n\nFeatures:\n- Premium quality materials\n- Ergonomic design\n- Durable construction\n- 30-day money-back guarantee\n- Free returns within 14 days`,
    price: card.price,
    compare_at_price: card.compare_at_price,
    currency: card.currency,
    sku: `SKU-${card.id}`,
    stock_quantity: card.stock_quantity,
    low_stock_threshold: 5,
    images: card.images,
    thumbnail_url: card.thumbnail_url,
    tags: ["bestseller", "new arrival", "trending"],
    is_active: true,
    is_featured: true,
    is_flash_deal: card.is_flash_deal,
    flash_deal_ends_at: card.flash_deal_ends_at,
    rating_average: card.rating_average,
    rating_count: card.rating_count,
    total_sold: card.total_sold,
    shipping_weight: 0.5,
    shipping_free: card.shipping_free,
    shipping_origin_country: "Lebanon",
    metadata: {},
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
    seller: card.seller ? {
      id: card.seller.id,
      user_id: "user-1",
      shop_name: card.seller.shop_name,
      shop_slug: card.seller.shop_slug,
      shop_description: `Welcome to ${card.seller.shop_name}! We offer high-quality products at competitive prices. Customer satisfaction is our top priority.`,
      shop_logo_url: null,
      shop_banner_url: null,
      tap_destination_id: null,
      tap_business_id: null,
      tap_onboarding_complete: false,
      rating_average: 4.5,
      rating_count: 120,
      total_sales: 1500,
      is_verified: card.seller.is_verified,
      country: "Lebanon",
      created_at: new Date(Date.now() - 180 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
    } : null,
    category: {
      id: "cat-1",
      name: "Electronics",
      slug: "electronics",
      icon: "smartphone",
      parent_id: null,
      sort_order: 0,
      created_at: new Date().toISOString(),
    },
    variants: [],
  };
}

export const mockCategories: CategoryRow[] = [
  { id: "cat-1", name: "Electronics", slug: "electronics", icon: "smartphone", parent_id: null, sort_order: 0, created_at: new Date().toISOString() },
  { id: "cat-2", name: "Fashion", slug: "fashion", icon: "shirt", parent_id: null, sort_order: 1, created_at: new Date().toISOString() },
  { id: "cat-3", name: "Home & Garden", slug: "home-garden", icon: "home", parent_id: null, sort_order: 2, created_at: new Date().toISOString() },
  { id: "cat-4", name: "Beauty", slug: "beauty", icon: "sparkles", parent_id: null, sort_order: 3, created_at: new Date().toISOString() },
  { id: "cat-5", name: "Sports", slug: "sports", icon: "dumbbell", parent_id: null, sort_order: 4, created_at: new Date().toISOString() },
  { id: "cat-6", name: "Books", slug: "books", icon: "book-open", parent_id: null, sort_order: 5, created_at: new Date().toISOString() },
  { id: "cat-7", name: "Automotive", slug: "automotive", icon: "car", parent_id: null, sort_order: 6, created_at: new Date().toISOString() },
  { id: "cat-8", name: "Baby & Kids", slug: "baby-kids", icon: "baby", parent_id: null, sort_order: 7, created_at: new Date().toISOString() },
  { id: "cat-9", name: "Gaming", slug: "gaming", icon: "gamepad", parent_id: null, sort_order: 8, created_at: new Date().toISOString() },
  { id: "cat-10", name: "Food", slug: "food", icon: "utensils", parent_id: null, sort_order: 9, created_at: new Date().toISOString() },
];

export const mockReviews = [
  {
    id: "rev-1", product_id: "", user_id: "u1", order_id: null,
    rating: 5, title: "Excellent product!", body: "Exceeded my expectations. Great quality and fast shipping.", images: [],
    is_verified_purchase: true, helpful_count: 12, created_at: new Date(Date.now() - 3 * 86400000).toISOString(), updated_at: new Date().toISOString(),
    profile: { full_name: "Sarah M.", avatar_url: null },
  },
  {
    id: "rev-2", product_id: "", user_id: "u2", order_id: null,
    rating: 4, title: "Very good", body: "Good quality for the price. Would recommend to others.", images: [],
    is_verified_purchase: true, helpful_count: 5, created_at: new Date(Date.now() - 7 * 86400000).toISOString(), updated_at: new Date().toISOString(),
    profile: { full_name: "Ahmad K.", avatar_url: null },
  },
  {
    id: "rev-3", product_id: "", user_id: "u3", order_id: null,
    rating: 5, title: "Love it!", body: "Best purchase I've made this year. Highly recommended.", images: [],
    is_verified_purchase: false, helpful_count: 3, created_at: new Date(Date.now() - 14 * 86400000).toISOString(), updated_at: new Date().toISOString(),
    profile: { full_name: "Layla R.", avatar_url: null },
  },
  {
    id: "rev-4", product_id: "", user_id: "u4", order_id: null,
    rating: 3, title: "Decent", body: "It's okay. Does the job but nothing special. Shipping was a bit slow.", images: [],
    is_verified_purchase: true, helpful_count: 1, created_at: new Date(Date.now() - 21 * 86400000).toISOString(), updated_at: new Date().toISOString(),
    profile: { full_name: "Omar H.", avatar_url: null },
  },
  {
    id: "rev-5", product_id: "", user_id: "u5", order_id: null,
    rating: 5, title: "Perfect!", body: "Exactly as described. Fast delivery and great packaging.", images: [],
    is_verified_purchase: true, helpful_count: 8, created_at: new Date(Date.now() - 28 * 86400000).toISOString(), updated_at: new Date().toISOString(),
    profile: { full_name: "Nadia B.", avatar_url: null },
  },
];

export function getMockSeller(id: string) {
  const seller = sellerNames.find((s) => s.id === id) || sellerNames[0];
  return {
    id: seller.id,
    user_id: "user-1",
    shop_name: seller.shop_name,
    shop_slug: seller.shop_slug,
    shop_description: `Welcome to ${seller.shop_name}! We're a trusted seller on Mymiso offering top-quality products. Browse our collection and enjoy fast shipping across Lebanon and the region.`,
    shop_logo_url: null,
    shop_banner_url: null,
    tap_destination_id: null,
    tap_business_id: null,
    tap_onboarding_complete: false,
    rating_average: 4.5,
    rating_count: 120,
    total_sales: 1500,
    is_verified: seller.is_verified,
    country: "Lebanon",
    created_at: new Date(Date.now() - 180 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
    profile: { full_name: seller.shop_name, avatar_url: null },
  };
}
