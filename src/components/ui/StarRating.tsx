import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  reviewCount?: number;
  className?: string;
}

const sizeMap = {
  sm: 12,
  md: 14,
  lg: 18,
};

export function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  showValue = false,
  reviewCount,
  className = "",
}: StarRatingProps) {
  const pixelSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      <div className="flex">
        {Array.from({ length: maxRating }, (_, i) => {
          const filled = i < Math.floor(rating);
          const half = !filled && i < rating;

          return (
            <span key={i} className="relative">
              {/* Empty star */}
              <Star
                size={pixelSize}
                className="text-star-empty"
                fill="currentColor"
                strokeWidth={0}
              />
              {/* Filled or half star overlay */}
              {(filled || half) && (
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: half ? "50%" : "100%" }}
                >
                  <Star
                    size={pixelSize}
                    className="text-star-filled"
                    fill="currentColor"
                    strokeWidth={0}
                  />
                </span>
              )}
            </span>
          );
        })}
      </div>
      {showValue && (
        <span className="text-text-primary font-semibold text-[13px] font-tabular">
          {rating.toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && (
        <span className="text-text-muted text-[12px]">
          ({reviewCount})
        </span>
      )}
    </div>
  );
}
