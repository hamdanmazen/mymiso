import Link from "next/link";
import { getFlashDeals } from "@/lib/queries/products";
import { ProductCard } from "@/components/product/ProductCard";
import { FlashDealTimer } from "@/components/product/FlashDealTimer";
import { Zap } from "lucide-react";

export async function FlashDeals() {
  const products = await getFlashDeals(10);

  if (products.length === 0) return null;

  const earliestEnd = products[0]?.flash_deal_ends_at;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-[24px] sm:text-[32px] font-semibold tracking-tight flex items-center gap-2">
            <Zap size={24} className="text-mizo-red" />
            Flash Deals
          </h2>
          {earliestEnd && <FlashDealTimer endsAt={earliestEnd} />}
        </div>
        <Link
          href="/products?flash=true"
          className="text-mizo-teal text-[14px] font-medium hover:underline"
        >
          View All
        </Link>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide sm:grid sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 sm:overflow-x-visible">
        {products.map((product) => (
          <div key={product.id} className="min-w-[160px] sm:min-w-0">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
