import { Suspense } from "react";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import { HeroBanner } from "@/components/home/HeroBanner";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FlashDeals } from "@/components/home/FlashDeals";
import { TrendingProducts } from "@/components/home/TrendingProducts";
import { BestSellers } from "@/components/home/BestSellers";
import { RecommendedForYou } from "@/components/home/RecommendedForYou";

function ProductGridSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

function SectionSkeleton({ title, count = 5 }: { title: string; count?: number }) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[24px] sm:text-[32px] font-semibold tracking-tight">
          {title}
        </h2>
      </div>
      <ProductGridSkeleton count={count} />
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="max-w-[1400px] mx-auto px-3 sm:px-6">
      <HeroBanner />

      <div className="mt-12">
        <Suspense fallback={<SectionSkeleton title="Flash Deals" />}>
          <FlashDeals />
        </Suspense>
      </div>

      <div className="mt-12">
        <Suspense fallback={<SectionSkeleton title="Trending Now" />}>
          <TrendingProducts />
        </Suspense>
      </div>

      <div className="mt-12">
        <Suspense fallback={<SectionSkeleton title="Shop by Category" count={10} />}>
          <CategoryGrid />
        </Suspense>
      </div>

      <div className="mt-12">
        <Suspense fallback={<SectionSkeleton title="Best Sellers" />}>
          <BestSellers />
        </Suspense>
      </div>

      <div className="mt-12 mb-16">
        <Suspense fallback={<SectionSkeleton title="Recommended for You" />}>
          <RecommendedForYou />
        </Suspense>
      </div>
    </div>
  );
}
