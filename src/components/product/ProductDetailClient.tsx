"use client";

import { useState } from "react";
import { ProductGallery } from "./ProductGallery";
import { VariantSelector } from "./VariantSelector";
import { QuantityPicker } from "./QuantityPicker";
import { AddToCartButton } from "./AddToCartButton";
import { WishlistButton } from "./WishlistButton";
import { PriceDisplay } from "./PriceDisplay";
import { Badge } from "@/components/ui/Badge";
import { StarRating } from "@/components/ui/StarRating";
import { Truck, Shield, Store, MessageSquare } from "lucide-react";
import { getProductThumbnailUrl } from "@/lib/utils/images";
import type { ProductWithDetails } from "@/types/product";
import Link from "next/link";

interface ProductDetailClientProps {
  product: ProductWithDetails;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    product.variants.length > 0 ? product.variants[0].id : null
  );
  const [quantity, setQuantity] = useState(1);

  const selectedVariant = product.variants.find(
    (v) => v.id === selectedVariantId
  );
  const effectivePrice = selectedVariant
    ? product.price + selectedVariant.price_modifier
    : product.price;
  const effectiveStock = selectedVariant
    ? selectedVariant.stock_quantity
    : product.stock_quantity;

  const inStock = effectiveStock > 0;
  const lowStock =
    inStock && effectiveStock <= product.low_stock_threshold;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Gallery */}
      <ProductGallery
        productId={product.id}
        images={product.images}
        title={product.title}
      />

      {/* Product Info */}
      <div className="space-y-5">
        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          {product.is_flash_deal && (
            <Badge variant="flash" pulse>FLASH DEAL</Badge>
          )}
          {product.shipping_free && (
            <Badge variant="freeShipping">Free Shipping</Badge>
          )}
          {inStock ? (
            lowStock ? (
              <Badge variant="warning">Only {effectiveStock} left</Badge>
            ) : (
              <Badge variant="success">In Stock</Badge>
            )
          ) : (
            <Badge variant="error">Out of Stock</Badge>
          )}
        </div>

        {/* Title */}
        <h1 className="text-[24px] sm:text-[32px] font-bold tracking-tight text-text-primary leading-tight">
          {product.title}
        </h1>

        {/* Rating */}
        {product.rating_count > 0 && (
          <StarRating
            rating={product.rating_average}
            size="md"
            showValue
            reviewCount={product.rating_count}
          />
        )}

        {/* Price */}
        <PriceDisplay
          price={effectivePrice}
          compareAtPrice={product.compare_at_price}
          currency={product.currency}
          size="lg"
        />

        {/* Seller */}
        {product.seller && (
          <Link
            href={`/sellers/${product.seller.id}`}
            className="inline-flex items-center gap-2 text-[14px] text-mizo-teal hover:underline"
          >
            <Store size={16} />
            {product.seller.shop_name}
            {product.seller.is_verified && (
              <Badge variant="verified">Verified</Badge>
            )}
          </Link>
        )}

        {/* Variants */}
        {product.variants.length > 0 && (
          <VariantSelector
            variants={product.variants}
            selectedVariantId={selectedVariantId}
            onSelect={setSelectedVariantId}
          />
        )}

        {/* Quantity + Add to Cart */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-4">
            <span className="text-[14px] text-text-secondary">Quantity</span>
            <QuantityPicker
              quantity={quantity}
              onChange={setQuantity}
              max={effectiveStock}
            />
          </div>

          <div className="flex gap-3">
            <AddToCartButton
              product={{
                id: product.id,
                title: product.title,
                slug: product.slug,
                price: effectivePrice,
                compare_at_price: product.compare_at_price,
                currency: product.currency,
                thumbnail_url:
                  product.thumbnail_url ||
                  getProductThumbnailUrl(product.id),
                stock_quantity: effectiveStock,
                sellerId: product.seller?.id ?? "",
                sellerName: product.seller?.shop_name ?? "Unknown Seller",
              }}
              variantId={selectedVariantId}
              variantName={selectedVariant?.name}
              quantity={quantity}
            />
            <WishlistButton
              productId={product.id}
              className="w-11 h-11 shrink-0"
            />
          </div>
        </div>

        {/* Trust signals */}
        <div className="flex flex-col gap-2 pt-2 border-t border-border-subtle">
          <div className="flex items-center gap-2 text-[13px] text-text-secondary">
            <Truck size={16} className="text-mizo-teal" />
            {product.shipping_free
              ? "Free shipping on this item"
              : "Shipping calculated at checkout"}
          </div>
          <div className="flex items-center gap-2 text-[13px] text-text-secondary">
            <Shield size={16} className="text-mizo-teal" />
            Buyer protection guaranteed
          </div>
        </div>

        {/* Contact Seller */}
        {product.seller && (
          <Link
            href={`/messages?seller=${product.seller.id}&product=${product.id}`}
            className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 text-[15px] font-semibold tracking-[0.01em] leading-none rounded-comfortable bg-mizo-teal-subtle text-mizo-teal border border-mizo-teal/30 hover:bg-mizo-teal/20 transition-all"
          >
            <MessageSquare size={18} />
            Contact Seller
          </Link>
        )}
      </div>
    </div>
  );
}
