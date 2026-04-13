import { ProductCard } from "./ProductCard";
import type { ProductCardData } from "@/types/product";

interface ProductGridProps {
  products: ProductCardData[];
  className?: string;
}

export function ProductGrid({ products, className = "" }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[18px] text-text-secondary mb-2">
          No products found
        </p>
        <p className="text-[14px] text-text-muted">
          Try adjusting your filters or search terms
        </p>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 ${className}`}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
