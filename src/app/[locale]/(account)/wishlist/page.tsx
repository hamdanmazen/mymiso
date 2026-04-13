"use client";

import { useWishlistStore } from "@/stores/wishlistStore";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getProductThumbnailUrl } from "@/lib/utils/images";

export default function WishlistPage() {
  const { items, remove } = useWishlistStore();

  return (
    <div>
      <h1 className="text-[24px] font-semibold tracking-tight mb-6">
        Wishlist
      </h1>

      {items.length === 0 ? (
        <Card className="text-center py-12">
          <Heart size={40} className="text-text-muted mx-auto mb-3" />
          <p className="text-[16px] text-text-secondary">
            Your wishlist is empty
          </p>
          <p className="text-[13px] text-text-muted mt-1 mb-6">
            Save items you love to find them later
          </p>
          <Link href="/products">
            <Button variant="secondary">Browse Products</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {items.map((item) => (
            <div
              key={item.productId}
              className="bg-surface-raised border border-border-default rounded-spacious overflow-hidden group"
            >
              <Link href={`/products/${item.productId}`}>
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={getProductThumbnailUrl(item.productId)}
                    alt="Product"
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </Link>
              <div className="p-3">
                <p className="text-[13px] text-text-muted mb-2">
                  Saved {new Date(item.addedAt).toLocaleDateString()}
                </p>
                <div className="flex gap-2">
                  <Link href={`/products/${item.productId}`} className="flex-1">
                    <Button variant="secondary" size="sm" className="w-full">
                      View
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => remove(item.productId)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
