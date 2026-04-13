import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { StarRating } from "@/components/ui/StarRating";
import { Badge } from "@/components/ui/Badge";
import { Star, MessageSquare } from "lucide-react";
import { formatDate } from "@/lib/utils/formatDate";
import { ReviewsClient } from "./ReviewsClient";

export default async function ReviewsPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div>
        <h1 className="text-[24px] font-semibold tracking-tight mb-6">
          My Reviews
        </h1>
        <Card className="text-center py-12">
          <Star size={40} className="text-text-muted mx-auto mb-3" />
          <p className="text-[16px] text-text-secondary">No reviews yet</p>
        </Card>
      </div>
    );
  }

  const supabase = (await createClient())!;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div>
        <h1 className="text-[24px] font-semibold tracking-tight mb-6">
          My Reviews
        </h1>
        <Card className="text-center py-12">
          <p className="text-text-secondary">Please log in to see your reviews</p>
        </Card>
      </div>
    );
  }

  // Get delivered orders with items (for pending reviews)
  const { data: deliveredOrders } = await supabase
    .from("orders")
    .select("id, order_number")
    .eq("buyer_id", user.id)
    .eq("status", "delivered");

  // Get order items for delivered orders
  const orderIds = (deliveredOrders ?? []).map((o) => o.id);
  let pendingReviewItems: {
    orderId: string;
    orderNumber: string;
    productId: string;
    productTitle: string;
    productThumbnail: string | null;
  }[] = [];

  if (orderIds.length > 0) {
    const { data: orderItems } = await supabase
      .from("order_items")
      .select("order_id, product_id, product_snapshot")
      .in("order_id", orderIds);

    // Get existing reviews to filter them out
    const { data: existingReviews } = await supabase
      .from("reviews")
      .select("product_id, order_id")
      .eq("user_id", user.id);

    const reviewedSet = new Set(
      (existingReviews ?? []).map((r) => `${r.product_id}-${r.order_id}`)
    );

    const orderNumberMap = new Map(
      (deliveredOrders ?? []).map((o) => [o.id, o.order_number])
    );

    pendingReviewItems = (orderItems ?? [])
      .filter(
        (item) =>
          !reviewedSet.has(`${item.product_id}-${item.order_id}`)
      )
      .map((item) => {
        const snapshot = item.product_snapshot as Record<string, unknown> | null;
        return {
          orderId: item.order_id,
          orderNumber: orderNumberMap.get(item.order_id) ?? "",
          productId: item.product_id ?? "",
          productTitle: (snapshot?.title as string) ?? "Product",
          productThumbnail: (snapshot?.thumbnail_url as string) ?? null,
        };
      });
  }

  // Get user's existing reviews
  const { data: myReviews } = await supabase
    .from("reviews")
    .select("id, product_id, rating, title, body, created_at, is_verified_purchase")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Get product info for existing reviews
  const reviewProductIds = (myReviews ?? [])
    .map((r) => r.product_id)
    .filter(Boolean);
  let reviewProducts = new Map<string, { title: string; thumbnail_url: string | null }>();

  if (reviewProductIds.length > 0) {
    const { data: products } = await supabase
      .from("products")
      .select("id, title, thumbnail_url")
      .in("id", reviewProductIds);

    reviewProducts = new Map(
      (products ?? []).map((p) => [p.id, { title: p.title, thumbnail_url: p.thumbnail_url }])
    );
  }

  return (
    <div>
      <h1 className="text-[24px] font-semibold tracking-tight mb-6">
        My Reviews
      </h1>

      {/* Pending Reviews */}
      {pendingReviewItems.length > 0 && (
        <section className="mb-8">
          <h2 className="text-[16px] font-semibold text-text-primary mb-3 flex items-center gap-2">
            <MessageSquare size={18} className="text-mizo-teal" />
            Pending Reviews ({pendingReviewItems.length})
          </h2>
          <ReviewsClient pendingItems={pendingReviewItems} />
        </section>
      )}

      {/* Existing Reviews */}
      <section>
        <h2 className="text-[16px] font-semibold text-text-primary mb-3 flex items-center gap-2">
          <Star size={18} className="text-amber-400" />
          My Reviews ({(myReviews ?? []).length})
        </h2>

        {(myReviews ?? []).length > 0 ? (
          <div className="space-y-3">
            {(myReviews ?? []).map((review) => {
              const product = reviewProducts.get(review.product_id);
              return (
                <Card key={review.id}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[14px] font-medium text-text-primary mb-1">
                        {product?.title ?? "Product"}
                      </p>
                      <StarRating rating={review.rating} size="sm" />
                      {review.title && (
                        <p className="text-[14px] font-medium text-text-primary mt-2">
                          {review.title}
                        </p>
                      )}
                      {review.body && (
                        <p className="text-[13px] text-text-secondary mt-1">
                          {review.body}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[12px] text-text-muted">
                          {formatDate(review.created_at)}
                        </span>
                        {review.is_verified_purchase && (
                          <Badge variant="verified">Verified Purchase</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="text-center py-8">
            <Star size={32} className="text-text-muted mx-auto mb-2" />
            <p className="text-[14px] text-text-secondary">
              No reviews written yet
            </p>
          </Card>
        )}
      </section>
    </div>
  );
}
