import Link from "next/link";
import { getBestSellers } from "@/lib/queries/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Award } from "lucide-react";

export async function BestSellers() {
  const products = await getBestSellers(10);

  if (products.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[24px] sm:text-[32px] font-semibold tracking-tight flex items-center gap-2">
          <Award size={24} className="text-mizo-cream" />
          Best Sellers
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
