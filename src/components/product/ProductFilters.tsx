"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { StarRating } from "@/components/ui/StarRating";
import { SlidersHorizontal, X } from "lucide-react";

interface ProductFiltersProps {
  showCategoryFilter?: boolean;
  className?: string;
}

export function ProductFilters({
  showCategoryFilter: _showCategoryFilter = true,
  className = "",
}: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [minRating, setMinRating] = useState(searchParams.get("minRating") || "");
  const [freeShipping, setFreeShipping] = useState(
    searchParams.get("shipping") === "free"
  );

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");

    if (minPrice) params.set("minPrice", minPrice);
    else params.delete("minPrice");

    if (maxPrice) params.set("maxPrice", maxPrice);
    else params.delete("maxPrice");

    if (minRating) params.set("minRating", minRating);
    else params.delete("minRating");

    if (freeShipping) params.set("shipping", "free");
    else params.delete("shipping");

    router.push(`${pathname}?${params.toString()}`);
    setIsOpen(false);
  }, [router, pathname, searchParams, minPrice, maxPrice, minRating, freeShipping]);

  const clearFilters = useCallback(() => {
    const params = new URLSearchParams();
    const sort = searchParams.get("sort");
    const q = searchParams.get("q");
    if (sort) params.set("sort", sort);
    if (q) params.set("q", q);
    setMinPrice("");
    setMaxPrice("");
    setMinRating("");
    setFreeShipping(false);
    router.push(`${pathname}?${params.toString()}`);
    setIsOpen(false);
  }, [router, pathname, searchParams]);

  const hasActiveFilters =
    searchParams.has("minPrice") ||
    searchParams.has("maxPrice") ||
    searchParams.has("minRating") ||
    searchParams.has("shipping");

  const filterContent = (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <h4 className="text-[14px] font-semibold text-text-primary mb-3">
          Price Range
        </h4>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            min={0}
            className="w-full bg-surface-input border border-border-default rounded-comfortable px-3 py-2 text-[13px] text-text-primary placeholder:text-text-muted focus-ring"
          />
          <span className="text-text-muted text-[13px]">–</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            min={0}
            className="w-full bg-surface-input border border-border-default rounded-comfortable px-3 py-2 text-[13px] text-text-primary placeholder:text-text-muted focus-ring"
          />
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="text-[14px] font-semibold text-text-primary mb-3">
          Minimum Rating
        </h4>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() =>
                setMinRating(minRating === String(rating) ? "" : String(rating))
              }
              className={`
                flex items-center gap-2 w-full py-2 px-3 rounded-comfortable text-left
                transition-colors duration-150
                ${minRating === String(rating)
                  ? "bg-mizo-red-subtle border border-border-active"
                  : "hover:bg-surface-subtle"
                }
              `}
            >
              <StarRating rating={rating} size="sm" />
              <span className="text-[13px] text-text-secondary">& up</span>
            </button>
          ))}
        </div>
      </div>

      {/* Free Shipping */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer py-2">
          <input
            type="checkbox"
            checked={freeShipping}
            onChange={(e) => setFreeShipping(e.target.checked)}
            className="w-4 h-4 accent-mizo-red rounded"
          />
          <span className="text-[14px] text-text-primary">
            Free Shipping Only
          </span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button onClick={applyFilters} className="flex-1">
          Apply Filters
        </Button>
        {hasActiveFilters && (
          <Button variant="ghost" onClick={clearFilters}>
            Clear
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile: filter toggle button */}
      <div className="lg:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="relative"
        >
          <SlidersHorizontal size={16} />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-mizo-red rounded-circle" />
          )}
        </Button>
      </div>

      {/* Mobile: slide-out drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-[300px] bg-surface-overlay p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[18px] font-semibold text-text-primary">
                Filters
              </h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-surface-subtle rounded-comfortable"
                aria-label="Close filters"
              >
                <X size={20} className="text-text-secondary" />
              </button>
            </div>
            {filterContent}
          </div>
        </div>
      )}

      {/* Desktop: sidebar */}
      <div
        className={`hidden lg:block w-[280px] shrink-0 ${className}`}
      >
        <div className="sticky top-24 bg-surface-raised border border-border-default rounded-spacious p-5">
          <h3 className="text-[16px] font-semibold text-text-primary mb-5">
            Filters
          </h3>
          {filterContent}
        </div>
      </div>
    </>
  );
}
