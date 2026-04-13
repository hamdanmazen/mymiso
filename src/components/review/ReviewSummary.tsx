import { StarRating } from "@/components/ui/StarRating";
import type { ReviewSummary as ReviewSummaryType } from "@/types/product";

interface ReviewSummaryProps {
  summary: ReviewSummaryType;
}

export function ReviewSummary({ summary }: ReviewSummaryProps) {
  if (summary.total === 0) {
    return (
      <p className="text-[14px] text-text-muted py-4">No reviews yet</p>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-6 py-4">
      {/* Average */}
      <div className="text-center sm:text-left">
        <p className="text-[48px] font-bold text-text-primary font-tabular leading-none">
          {summary.average.toFixed(1)}
        </p>
        <StarRating rating={summary.average} size="lg" className="mt-2" />
        <p className="text-[14px] text-text-muted mt-1">
          {summary.total} {summary.total === 1 ? "review" : "reviews"}
        </p>
      </div>

      {/* Distribution bars */}
      <div className="flex-1 space-y-1.5">
        {([5, 4, 3, 2, 1] as const).map((star) => {
          const count = summary.distribution[star] || 0;
          const percentage = summary.total > 0 ? (count / summary.total) * 100 : 0;

          return (
            <div key={star} className="flex items-center gap-2">
              <span className="text-[13px] text-text-secondary w-4 text-right font-tabular">
                {star}
              </span>
              <StarRating rating={star} size="sm" />
              <div className="flex-1 h-2 bg-surface-subtle rounded-full overflow-hidden">
                <div
                  className="h-full bg-star-filled rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-[12px] text-text-muted w-8 text-right font-tabular">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
