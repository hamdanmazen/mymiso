import { ProductCardSkeleton } from "@/components/ui/Skeleton";

export default function ProductsLoading() {
  return (
    <div className="max-w-[1400px] mx-auto px-3 sm:px-6 py-6">
      <div className="h-9 w-48 bg-surface-subtle rounded animate-pulse mb-6" />
      <div className="flex gap-6">
        {/* Desktop sidebar skeleton */}
        <div className="hidden lg:block w-[280px] shrink-0">
          <div className="bg-surface-raised border border-border-default rounded-spacious p-5 space-y-4">
            <div className="h-5 w-16 bg-surface-subtle rounded animate-pulse" />
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-10 bg-surface-subtle rounded animate-pulse" />
            ))}
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <div className="h-5 w-32 bg-surface-subtle rounded animate-pulse" />
            <div className="h-9 w-40 bg-surface-subtle rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {Array.from({ length: 20 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
