import { Suspense } from "react";
import { getProducts } from "@/lib/queries/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductFilters } from "@/components/product/ProductFilters";
import { ProductSort } from "@/components/product/ProductSort";
import { Pagination } from "@/components/ui/Pagination";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import type { ProductFilters as Filters, ProductSort as SortType } from "@/types/product";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function parseSearchParams(raw: Record<string, string | string[] | undefined>): Filters {
  const get = (key: string) => {
    const val = raw[key];
    return typeof val === "string" ? val : undefined;
  };

  return {
    minPrice: get("minPrice") ? Number(get("minPrice")) : undefined,
    maxPrice: get("maxPrice") ? Number(get("maxPrice")) : undefined,
    minRating: get("minRating") ? Number(get("minRating")) : undefined,
    shipping: get("shipping") === "free" ? "free" : undefined,
    sort: (get("sort") as SortType) || "newest",
    page: get("page") ? Number(get("page")) : 1,
    isFlashDeal: get("flash") === "true" ? true : undefined,
    search: get("q"),
  };
}

async function ProductsContent({ filters }: { filters: Filters }) {
  const result = await getProducts(filters);

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <p className="text-[14px] text-text-secondary">
          {result.total} {result.total === 1 ? "product" : "products"} found
        </p>
        <div className="hidden lg:block">
          <ProductSort />
        </div>
      </div>
      <ProductGrid products={result.data} />
      <Pagination
        currentPage={result.page}
        totalPages={result.totalPages}
        className="mt-8"
      />
    </>
  );
}

function ProductsGridSkeleton() {
  return (
    <div>
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
  );
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const rawParams = await searchParams;
  const filters = parseSearchParams(rawParams);

  const title = filters.isFlashDeal
    ? "Flash Deals"
    : filters.search
      ? `Results for "${filters.search}"`
      : "All Products";

  return (
    <div className="max-w-[1400px] mx-auto px-3 sm:px-6 py-6">
      <h1 className="text-[24px] sm:text-[32px] font-semibold tracking-tight mb-6">
        {title}
      </h1>

      <div className="flex gap-6">
        <ProductFilters />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-4 lg:hidden">
            <ProductSort />
          </div>

          <Suspense fallback={<ProductsGridSkeleton />}>
            <ProductsContent filters={filters} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
