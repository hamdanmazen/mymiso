import { getDiscountPercentage } from "@/lib/utils/formatPrice";
import { Badge } from "@/components/ui/Badge";

interface DiscountBadgeProps {
  price: number;
  compareAtPrice: number;
  className?: string;
}

export function DiscountBadge({
  price,
  compareAtPrice,
  className = "",
}: DiscountBadgeProps) {
  const discount = getDiscountPercentage(price, compareAtPrice);
  if (discount <= 0) return null;

  return (
    <Badge variant="discount" className={className}>
      -{discount}%
    </Badge>
  );
}
