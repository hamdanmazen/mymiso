"use server";

import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { reviewSchema, type ReviewInput } from "@/lib/utils/validators";
import { revalidatePath } from "next/cache";
import { sendNewReviewNotification } from "@/lib/email";

export async function submitReview(input: {
  orderId: string;
  productId: string;
  rating: number;
  title?: string;
  body?: string;
  images?: string[];
}) {
  if (!isSupabaseConfigured()) return { error: "Not configured" };
  const supabase = (await createClient())!;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Validate review content
  const parsed = reviewSchema.safeParse({
    rating: input.rating,
    title: input.title,
    body: input.body,
    images: input.images,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  // Verify the user actually purchased this product
  const { data: order } = await supabase
    .from("orders")
    .select("id, status")
    .eq("id", input.orderId)
    .eq("buyer_id", user.id)
    .eq("status", "delivered")
    .single();

  if (!order) {
    return { error: "You can only review delivered orders" };
  }

  // Check the order contains this product
  const { data: orderItem } = await supabase
    .from("order_items")
    .select("id")
    .eq("order_id", input.orderId)
    .eq("product_id", input.productId)
    .maybeSingle();

  if (!orderItem) {
    return { error: "Product not found in this order" };
  }

  // Check for existing review
  const { data: existing } = await supabase
    .from("reviews")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", input.productId)
    .eq("order_id", input.orderId)
    .maybeSingle();

  if (existing) {
    return { error: "You have already reviewed this product for this order" };
  }

  // Insert review
  const { error } = await supabase.from("reviews").insert({
    product_id: input.productId,
    user_id: user.id,
    order_id: input.orderId,
    rating: input.rating,
    title: input.title ?? null,
    body: input.body ?? null,
    images: input.images ?? [],
    is_verified_purchase: true,
  });

  if (error) return { error: error.message };

  // Update product rating
  const { data: reviews } = await supabase
    .from("reviews")
    .select("rating")
    .eq("product_id", input.productId);

  if (reviews && reviews.length > 0) {
    const avg =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await supabase
      .from("products")
      .update({
        rating_average: Math.round(avg * 100) / 100,
        rating_count: reviews.length,
      })
      .eq("id", input.productId);
  }

  // Notify seller about new review (best-effort)
  try {
    const adminClient = createAdminClient();

    // Get product + seller info
    const { data: product } = await adminClient
      .from("products")
      .select("title, seller_id")
      .eq("id", input.productId)
      .single();

    if (product?.seller_id) {
      const { data: seller } = await adminClient
        .from("sellers")
        .select("user_id")
        .eq("id", product.seller_id)
        .single();

      if (seller) {
        // Get reviewer name
        const { data: reviewer } = await adminClient
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();

        // Create in-app notification
        await adminClient.from("notifications").insert({
          user_id: seller.user_id,
          type: "new_review",
          title: `New ${input.rating}-star review`,
          body: `${reviewer?.full_name || "A buyer"} reviewed "${product.title}"`,
          link: `/seller/products`,
        });

        // Send email notification
        const { data: { user: sellerAuth } } = await adminClient.auth.admin.getUserById(seller.user_id);
        if (sellerAuth?.email) {
          sendNewReviewNotification({
            to: sellerAuth.email,
            productTitle: product.title,
            rating: input.rating,
            reviewerName: reviewer?.full_name || "A buyer",
            reviewBody: input.body,
          });
        }
      }
    }
  } catch {
    // Notifications are best-effort
  }

  revalidatePath(`/products`);
  revalidatePath("/reviews");
  return { success: true };
}

export async function toggleHelpfulVote(reviewId: string) {
  if (!isSupabaseConfigured()) return { error: "Not configured" };
  const supabase = (await createClient())!;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Check if already voted
  const { data: existing } = await supabase
    .from("review_helpful_votes")
    .select("id")
    .eq("review_id", reviewId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    // Remove vote
    const { error } = await supabase
      .from("review_helpful_votes")
      .delete()
      .eq("id", existing.id);
    if (error) return { error: error.message };
    revalidatePath("/products");
    return { success: true, voted: false };
  } else {
    // Add vote
    const { error } = await supabase
      .from("review_helpful_votes")
      .insert({ review_id: reviewId, user_id: user.id });
    if (error) return { error: error.message };
    revalidatePath("/products");
    return { success: true, voted: true };
  }
}

export async function submitSellerReply(input: {
  reviewId: string;
  body: string;
}) {
  if (!isSupabaseConfigured()) return { error: "Not configured" };
  const supabase = (await createClient())!;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const body = input.body.trim();
  if (!body) return { error: "Reply cannot be empty" };
  if (body.length > 2000) return { error: "Reply too long (max 2000 characters)" };

  // Get seller record for current user
  const { data: seller } = await supabase
    .from("sellers")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!seller) return { error: "You must be a seller to reply to reviews" };

  // Verify this review is on one of their products
  const { data: review } = await supabase
    .from("reviews")
    .select("id, product_id")
    .eq("id", input.reviewId)
    .single();

  if (!review) return { error: "Review not found" };

  const { data: product } = await supabase
    .from("products")
    .select("id")
    .eq("id", review.product_id)
    .eq("seller_id", seller.id)
    .single();

  if (!product) return { error: "You can only reply to reviews on your products" };

  // Check for existing reply
  const { data: existing } = await supabase
    .from("review_replies")
    .select("id")
    .eq("review_id", input.reviewId)
    .eq("seller_id", seller.id)
    .maybeSingle();

  if (existing) {
    // Update existing reply
    const { error } = await supabase
      .from("review_replies")
      .update({ body })
      .eq("id", existing.id);
    if (error) return { error: error.message };
  } else {
    // Create new reply
    const { error } = await supabase
      .from("review_replies")
      .insert({
        review_id: input.reviewId,
        seller_id: seller.id,
        body,
      });
    if (error) return { error: error.message };
  }

  revalidatePath("/products");
  return { success: true };
}

export async function deleteReview(reviewId: string) {
  if (!isSupabaseConfigured()) return { error: "Not configured" };
  const supabase = (await createClient())!;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Fetch the review to get product_id
  const { data: review } = await supabase
    .from("reviews")
    .select("id, product_id")
    .eq("id", reviewId)
    .eq("user_id", user.id)
    .single();

  if (!review) return { error: "Review not found" };

  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("id", reviewId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  // Recalculate product rating
  const { data: reviews } = await supabase
    .from("reviews")
    .select("rating")
    .eq("product_id", review.product_id);

  if (reviews) {
    const avg =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;
    await supabase
      .from("products")
      .update({
        rating_average: Math.round(avg * 100) / 100,
        rating_count: reviews.length,
      })
      .eq("id", review.product_id);
  }

  revalidatePath("/reviews");
  return { success: true };
}
