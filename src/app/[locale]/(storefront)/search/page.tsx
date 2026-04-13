import { Suspense } from "react";
import { searchProducts } from "@/lib/queries/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductSort } from "@/components/product/ProductSort";
import { Pagination } from "@/components/ui/Pagination";
import { SearchBar } from "@/components/layout/SearchBar";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import { Search } from "lucide-react";
import type { ProductSort as SortType } from "@/types/product";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

async function SearchResults({
  query,
  sort,
  page,
}: {
  query: string;
  sort: SortType;
  page: number;
}) {
  const result = await searchProducts(query, { sort, page });

  if (result.total === 0) {
    return (
      <div className="text-center py-12">
        <Search size={48} className="text-text-muted mx-auto mb-4" />
        <p className="text-[18px] text-text-secondary mb-2">
          No results for &ldquo;{query}&rdquo;
        </p>
        <p className="text-[14px] text-text-muted">
          Try different keywords or check your spelling
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <p className="text-[14px] text-text-secondary">
          {result.total} {result.total === 1 ? "result" : "results"} for
          &ldquo;{query}&rdquo;
        </p>
        <ProductSort />
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

export default async function SearchPage({ searchParams }: PageProps) {
  const rawParams = await searchParams;
  const q = typeof rawParams.q === "string" ? rawParams.q : "";
  const sort = (typeof rawParams.sort === "string" ? rawParams.sort : "newest") as SortType;
  const page = typeof rawParams.page === "string" ? Number(rawParams.page) : 1;

  return (
    <div className="max-w-[1400px] mx-auto px-3 sm:px-6 py-6">
      <div className="mb-6 max-w-xl">
        <SearchBar />
      </div>

      {q ? (
        <Suspense
          fallback={
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="h-5 w-48 bg-surface-subtle rounded animate-pulse" />
                <div className="h-9 w-40 bg-surface-subtle rounded animate-pulse" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {Array.from({ length: 10 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            </div>
          }
        >
          <SearchResults query={q} sort={sort} page={page} />
        </Suspense>
      ) : (
        <div className="text-center py-12">
          <Search size={48} className="text-text-muted mx-auto mb-4" />
          <p className="text-[16px] text-text-secondary">
            Enter a search term to find products
          </p>
        </div>
      )}
    </div>
  );
}
