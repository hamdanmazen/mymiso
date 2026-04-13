import { formatPrice, getDiscountPercentage } from "@/lib/utils/formatPrice";
import { Badge } from "@/components/ui/Badge";

interface PriceDisplayProps {
  price: number;
  compareAtPrice?: number | null;
  currency?: string;
  size?: "sm" | "md" | "lg";
  showDiscount?: boolean;
  className?: string;
}

const sizeStyles = {
  sm: {
    price: "text-[16px] font-bold",
    original: "text-[13px]",
  },
  md: {
    price: "text-[20px] font-bold",
    original: "text-[14px]",
  },
  lg: {
    price: "text-[28px] font-bold",
    original: "text-[16px]",
  },
};

export function PriceDisplay({
  price,
  compareAtPrice,
  currency = "USD",
  size = "sm",
  showDiscount = true,
  className = "",
}: PriceDisplayProps) {
  const styles = sizeStyles[size];
  const hasDiscount = compareAtPrice && compareAtPrice > price;
  const discount = hasDiscount
    ? getDiscountPercentage(price, compareAtPrice)
    : 0;

  return (
    <div className={`flex items-center gap-2 flex-wrap ${className}`}>
      <span
        className={`font-tabular ${styles.price} ${
          hasDiscount ? "text-mizo-red" : "text-text-primary"
        }`}
      >
        {formatPrice(price, currency)}
      </span>
      {hasDiscount && (
        <>
          <span
            className={`font-tabular ${styles.original} text-text-muted line-through`}
          >
            {formatPrice(compareAtPrice, currency)}
          </span>
          {showDiscount && discount > 0 && (
            <Badge variant="discount">-{discount}%</Badge>
          )}
        </>
      )}
    </div>
  );
}
