import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { mockReviews } from "@/lib/mock-data";
import type { Database } from "@/types/database";
import type { ReviewSummary } from "@/types/product";

type ReviewRow = Database["public"]["Tables"]["reviews"]["Row"];
type ReviewReplyRow = Database["public"]["Tables"]["review_replies"]["Row"];

export type ReviewReplyWithSeller = ReviewReplyRow & {
  seller: { shop_name: string; shop_logo_url: string | null } | null;
};

export type ReviewWithProfile = ReviewRow & {
  profile: { full_name: string | null; avatar_url: string | null } | null;
  replies?: ReviewReplyWithSeller[];
  user_voted?: boolean;
};

export async function getProductReviews(
  productId: string,
  page: number = 1,
  limit: number = 10
): Promise<{ reviews: ReviewWithProfile[]; total: number }> {
  if (!isSupabaseConfigured()) {
    const reviews = mockReviews.map((r) => ({
      ...r,
      product_id: productId,
    })) as unknown as ReviewWithProfile[];
    return { reviews, total: reviews.length };
  }

  const supabase = (await createClient())!;
  const offset = (page - 1) * limit;

  // Fetch reviews with profile join
  const { data, count, error } = await supabase
    .from("reviews")
    .select(
      "*, profile:profiles!reviews_user_id_fkey(full_name, avatar_url)",
      { count: "exact" }
    )
    .eq("product_id", productId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("getProductReviews error:", error);
    return { reviews: [], total: 0 };
  }

  if (!data || data.length === 0) {
    return { reviews: [], total: count || 0 };
  }

  const reviewIds = (data as Array<{ id: string }>).map((r) => r.id);

  // Fetch replies for these reviews
  const { data: repliesData } = await supabase
    .from("review_replies")
    .select("*")
    .in("review_id", reviewIds);

  // Fetch seller info for replies
  const sellerIds = [...new Set((repliesData || []).map((r) => r.seller_id))];
  const sellersMap = new Map<string, { shop_name: string; shop_logo_url: string | null }>();
  if (sellerIds.length > 0) {
    const { data: sellers } = await supabase
      .from("sellers")
      .select("id, shop_name, shop_logo_url")
      .in("id", sellerIds);
    for (const s of sellers || []) {
      sellersMap.set(s.id, { shop_name: s.shop_name, shop_logo_url: s.shop_logo_url });
    }
  }

  // Group replies by review_id
  const repliesByReview = new Map<string, ReviewReplyWithSeller[]>();
  for (const reply of repliesData || []) {
    const list = repliesByReview.get(reply.review_id) || [];
    list.push({
      ...reply,
      seller: sellersMap.get(reply.seller_id) || null,
    });
    repliesByReview.set(reply.review_id, list);
  }

  // Check which reviews the current user has voted helpful
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let userVotes = new Set<string>();
  if (user) {
    const { data: votes } = await supabase
      .from("review_helpful_votes")
      .select("review_id")
      .eq("user_id", user.id)
      .in("review_id", reviewIds);
    if (votes) {
      userVotes = new Set(votes.map((v) => v.review_id));
    }
  }

  const reviews = (data as Array<ReviewRow & { profile: { full_name: string | null; avatar_url: string | null } | null }>).map((r) => ({
    ...r,
    replies: repliesByReview.get(r.id) || [],
    user_voted: userVotes.has(r.id),
  })) as ReviewWithProfile[];

  return {
    reviews,
    total: count || 0,
  };
}

export async function getReviewSummary(
  productId: string
): Promise<ReviewSummary> {
  if (!isSupabaseConfigured()) {
    const reviews = mockReviews;
    const distribution: Record<1 | 2 | 3 | 4 | 5, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let sum = 0;
    for (const r of reviews) {
      distribution[r.rating as 1 | 2 | 3 | 4 | 5]++;
      sum += r.rating;
    }
    return {
      average: Math.round((sum / reviews.length) * 100) / 100,
      total: reviews.length,
      distribution,
    };
  }

  const supabase = (await createClient())!;

  const { data, error } = await supabase
    .from("reviews")
    .select("rating")
    .eq("product_id", productId);

  if (error || !data || data.length === 0) {
    return {
      average: 0,
      total: 0,
      distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    };
  }

  const distribution: Record<1 | 2 | 3 | 4 | 5, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };
  let sum = 0;
  for (const review of data) {
    const r = review.rating as 1 | 2 | 3 | 4 | 5;
    distribution[r] = (distribution[r] || 0) + 1;
    sum += review.rating;
  }

  return {
    average: Math.round((sum / data.length) * 100) / 100,
    total: data.length,
    distribution,
  };
}
