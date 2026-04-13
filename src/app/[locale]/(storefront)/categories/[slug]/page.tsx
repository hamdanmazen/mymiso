import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCategoryWithProducts } from "@/lib/queries/categories";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductFilters } from "@/components/product/ProductFilters";
import { ProductSort } from "@/components/product/ProductSort";
import { Pagination } from "@/components/ui/Pagination";
import { Badge } from "@/components/ui/Badge";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import type { ProductFilters as Filters, ProductSort as SortType } from "@/types/product";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const name = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `${name} | Mymiso`,
    description: `Shop ${name} products on Mymiso`,
  };
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
  };
}

async function CategoryContent({
  slug,
  filters,
}: {
  slug: string;
  filters: Filters;
}) {
  const { category, subcategories, products } =
    await getCategoryWithProducts(slug, filters);

  if (!category) notFound();

  return (
    <>
      {/* Subcategories */}
      {subcategories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {subcategories.map((sub) => (
            <Link key={sub.id} href={`/categories/${sub.slug}`}>
              <Badge variant="category">{sub.name}</Badge>
            </Link>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <p className="text-[14px] text-text-secondary">
          {products.total} {products.total === 1 ? "product" : "products"}
        </p>
        <div className="hidden lg:block">
          <ProductSort />
        </div>
      </div>

      <ProductGrid products={products.data} />
      <Pagination
        currentPage={products.page}
        totalPages={products.totalPages}
        className="mt-8"
      />
    </>
  );
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const rawParams = await searchParams;
  const filters = parseSearchParams(rawParams);
  const name = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="max-w-[1400px] mx-auto px-3 sm:px-6 py-6">
      <h1 className="text-[24px] sm:text-[32px] font-semibold tracking-tight mb-6">
        {name}
      </h1>

      <div className="flex gap-6">
        <ProductFilters showCategoryFilter={false} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-4 lg:hidden">
            <ProductSort />
          </div>

          <Suspense
            fallback={
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {Array.from({ length: 15 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            }
          >
            <CategoryContent slug={slug} filters={filters} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
