import { Card } from "@/components/ui/Card";
import { getAdminReviews } from "@/lib/queries/admin";
import { AdminReviewActions } from "./AdminReviewActions";
import { Star } from "lucide-react";

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const { data: reviews, total } = await getAdminReviews(
    page,
    20,
    params.search
  );
  const totalPages = Math.ceil(total / 20);

  return (
    <div>
      <h1 className="text-[24px] font-semibold tracking-tight mb-6">
        Review Moderation
      </h1>

      {/* Search */}
      <Card variant="compact" className="mb-6">
        <form className="flex items-center gap-3">
          <input
            type="text"
            name="search"
            placeholder="Search reviews by title or content..."
            defaultValue={params.search ?? ""}
            className="flex-1 min-w-[200px] px-3 py-2 text-[14px] bg-surface-input border border-border-default rounded-standard focus:outline-none focus:border-border-focus"
          />
          <button
            type="submit"
            className="px-4 py-2 text-[14px] font-medium bg-mizo-red text-white rounded-standard hover:bg-mizo-red-hover transition-colors"
          >
            Search
          </button>
        </form>
      </Card>

      {/* Reviews */}
      <Card>
        <h2 className="text-[18px] font-semibold mb-4">Reviews ({total})</h2>

        {reviews.length === 0 ? (
          <p className="text-[14px] text-text-muted py-8 text-center">No reviews found</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="flex gap-4 p-4 border border-border-subtle rounded-comfortable hover:bg-surface-subtle transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < review.rating ? "text-warning fill-warning" : "text-text-muted"}
                        />
                      ))}
                    </div>
                    <span className="text-[13px] font-medium">{review.reviewer_name ?? "Anonymous"}</span>
                    <span className="text-[12px] text-text-muted">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-[12px] text-text-muted mb-1">
                    Product: {review.product_title ?? "Unknown"}
                  </p>
                  {review.title && (
                    <p className="text-[14px] font-medium mb-1">{review.title}</p>
                  )}
                  {review.body && (
                    <p className="text-[14px] text-text-secondary line-clamp-2">{review.body}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[12px] text-text-muted">
                      {review.helpful_count} helpful votes
                    </span>
                    {review.is_verified_purchase && (
                      <span className="text-[12px] text-success font-medium">Verified Purchase</span>
                    )}
                  </div>
                </div>
                <AdminReviewActions reviewId={review.id} />
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-border-subtle">
            {Array.from({ length: totalPages }, (_, i) => (
              <a
                key={i + 1}
                href={`?page=${i + 1}&search=${params.search ?? ""}`}
                className={`
                  px-3 py-1.5 text-[13px] font-medium rounded-standard transition-colors
                  ${page === i + 1
                    ? "bg-mizo-red text-white"
                    : "text-text-secondary hover:bg-surface-subtle"
                  }
                `}
              >
                {i + 1}
              </a>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
