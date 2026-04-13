import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { StarRating } from "@/components/ui/StarRating";
import { PriceDisplay } from "./PriceDisplay";
import { WishlistButton } from "./WishlistButton";
import { getProductThumbnailUrl } from "@/lib/utils/images";
import type { ProductCardData } from "@/types/product";

interface ProductCardProps {
  product: ProductCardData;
  className?: string;
}

export function ProductCard({ product, className = "" }: ProductCardProps) {
  const thumbnailUrl =
    product.thumbnail_url || getProductThumbnailUrl(product.id);

  return (
    <Link
      href={`/products/${product.slug}`}
      className={`
        group block bg-surface-raised border border-border-default
        rounded-spacious overflow-hidden
        shadow-subtle hover:shadow-elevated
        transition-all duration-300 hover:-translate-y-0.5
        ${className}
      `}
    >
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden rounded-t-spacious">
        <Image
          src={thumbnailUrl}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1400px) 25vw, 20vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.is_flash_deal && (
            <Badge variant="flash" pulse>
              FLASH DEAL
            </Badge>
          )}
          {product.shipping_free && (
            <Badge variant="freeShipping">Free Shipping</Badge>
          )}
        </div>

        {/* Discount badge top-right */}
        {product.compare_at_price && product.compare_at_price > product.price && (
          <div className="absolute top-2 right-2">
            <Badge variant="discount">
              -
              {Math.round(
                ((product.compare_at_price - product.price) /
                  product.compare_at_price) *
                  100
              )}
              %
            </Badge>
          </div>
        )}

        {/* Wishlist button */}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <WishlistButton productId={product.id} />
        </div>
      </div>

      {/* Content */}
      <div className="p-3 space-y-1.5">
        {/* Title */}
        <h3 className="text-[14px] sm:text-[15px] font-semibold text-text-primary leading-tight line-clamp-2">
          {product.title}
        </h3>

        {/* Price */}
        <PriceDisplay
          price={product.price}
          compareAtPrice={product.compare_at_price}
          currency={product.currency}
          size="sm"
          showDiscount={false}
        />

        {/* Rating */}
        {product.rating_count > 0 && (
          <StarRating
            rating={product.rating_average}
            size="sm"
            reviewCount={product.rating_count}
          />
        )}

        {/* Seller */}
        {product.seller && (
          <p className="text-[12px] text-mizo-teal font-medium truncate">
            {product.seller.shop_name}
          </p>
        )}
      </div>
    </Link>
  );
}
