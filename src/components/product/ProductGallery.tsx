"use client";

import { useState } from "react";
import Image from "next/image";
import { getProductImages } from "@/lib/utils/images";

interface ProductGalleryProps {
  productId: string;
  images: string[];
  title: string;
}

export function ProductGallery({ productId, images, title }: ProductGalleryProps) {
  const allImages = getProductImages(productId, images, 5);
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-square overflow-hidden rounded-large bg-surface-raised border border-border-default group cursor-zoom-in">
        <Image
          src={allImages[selectedIndex]}
          alt={`${title} - Image ${selectedIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          priority
        />
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {allImages.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedIndex(i)}
              className={`
                relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-comfortable overflow-hidden
                border-2 transition-all duration-150
                ${i === selectedIndex
                  ? "border-mizo-teal"
                  : "border-border-default hover:border-border-subtle"
                }
              `}
              aria-label={`View image ${i + 1}`}
            >
              <Image
                src={src}
                alt={`${title} thumbnail ${i + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
