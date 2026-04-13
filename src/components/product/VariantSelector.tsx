"use client";

import type { Database } from "@/types/database";

type VariantRow = Database["public"]["Tables"]["product_variants"]["Row"];

interface VariantSelectorProps {
  variants: VariantRow[];
  selectedVariantId: string | null;
  onSelect: (variantId: string) => void;
}

export function VariantSelector({
  variants,
  selectedVariantId,
  onSelect,
}: VariantSelectorProps) {
  if (variants.length === 0) return null;

  const attributes = variants.reduce<Record<string, Set<string>>>(
    (acc, variant) => {
      const attrs = variant.attributes as Record<string, string>;
      for (const [key, value] of Object.entries(attrs)) {
        if (!acc[key]) acc[key] = new Set();
        acc[key].add(value);
      }
      return acc;
    },
    {}
  );

  return (
    <div className="space-y-4">
      {Object.entries(attributes).map(([attrName, values]) => (
        <div key={attrName}>
          <h4 className="text-[13px] font-medium text-text-secondary mb-2 capitalize">
            {attrName}
          </h4>
          <div className="flex flex-wrap gap-2">
            {[...values].map((value) => {
              const matchingVariant = variants.find((v) => {
                const attrs = v.attributes as Record<string, string>;
                return attrs[attrName] === value;
              });
              const isSelected = matchingVariant?.id === selectedVariantId;
              const isAvailable =
                matchingVariant && matchingVariant.stock_quantity > 0;

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => matchingVariant && onSelect(matchingVariant.id)}
                  disabled={!isAvailable}
                  className={`
                    px-4 py-2 text-[13px] font-medium rounded-comfortable
                    border transition-all duration-150 min-h-[44px]
                    ${isSelected
                      ? "border-border-active bg-mizo-red-subtle text-text-primary"
                      : isAvailable
                        ? "border-border-default text-text-secondary hover:border-text-muted"
                        : "border-border-subtle text-text-muted opacity-50 cursor-not-allowed line-through"
                    }
                  `}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
