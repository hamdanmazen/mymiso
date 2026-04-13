"use client";

import { Heart } from "lucide-react";
import { useWishlistStore } from "@/stores/wishlistStore";

interface WishlistButtonProps {
  productId: string;
  className?: string;
}

export function WishlistButton({ productId, className = "" }: WishlistButtonProps) {
  const { has, toggle } = useWishlistStore();
  const isWished = has(productId);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(productId);
      }}
      className={`
        flex items-center justify-center w-8 h-8 rounded-full
        transition-all duration-200
        ${isWished
          ? "bg-mizo-red text-white"
          : "bg-surface-overlay/80 text-text-secondary hover:text-mizo-red hover:bg-surface-overlay"
        }
        ${className}
      `}
      aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        size={16}
        fill={isWished ? "currentColor" : "none"}
        strokeWidth={2}
      />
    </button>
  );
}
