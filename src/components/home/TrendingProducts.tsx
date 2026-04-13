import Link from "next/link";
import { getTrendingProducts } from "@/lib/queries/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { TrendingUp } from "lucide-react";

export async function TrendingProducts() {
  const products = await getTrendingProducts(10);

  if (products.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[24px] sm:text-[32px] font-semibold tracking-tight flex items-center gap-2">
          <TrendingUp size={24} className="text-mizo-teal" />
          Trending Now
        </h2>
        <Link
          href="/products?sort=popular"
          className="text-mizo-teal text-[14px] font-medium hover:underline"
        >
          View All
        </Link>
      </div>
      <ProductGrid products={products} />
    </section>
  );
}
