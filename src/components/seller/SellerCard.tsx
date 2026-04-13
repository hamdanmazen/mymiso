import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { StarRating } from "@/components/ui/StarRating";
import { getSellerAvatarUrl } from "@/lib/utils/images";
import { formatDate } from "@/lib/utils/formatDate";
import { MapPin } from "lucide-react";
import type { SellerWithProfile } from "@/lib/queries/sellers";

interface SellerCardProps {
  seller: SellerWithProfile;
  className?: string;
}

export function SellerCard({ seller, className = "" }: SellerCardProps) {
  return (
    <div
      className={`bg-surface-raised border border-border-default rounded-spacious p-6 ${className}`}
    >
      <div className="flex items-start gap-4">
        <Avatar
          src={seller.shop_logo_url || getSellerAvatarUrl(seller.id)}
          alt={seller.shop_name}
          size="lg"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-[20px] font-bold text-text-primary">
              {seller.shop_name}
            </h2>
            {seller.is_verified && (
              <Badge variant="verified">Verified Seller</Badge>
            )}
          </div>

          {seller.rating_count > 0 && (
            <StarRating
              rating={seller.rating_average}
              size="sm"
              showValue
              reviewCount={seller.rating_count}
              className="mt-1"
            />
          )}

          <div className="flex flex-wrap gap-4 mt-2 text-[13px] text-text-muted">
            <span className="font-tabular">
              {seller.total_sales.toLocaleString()} sales
            </span>
            <span>Joined {formatDate(seller.created_at)}</span>
            {seller.country && (
              <span className="flex items-center gap-1">
                <MapPin size={12} />
                {seller.country}
              </span>
            )}
          </div>

          {seller.shop_description && (
            <p className="text-[14px] text-text-secondary mt-3 leading-relaxed line-clamp-3">
              {seller.shop_description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
