import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getSellerById, getSellerProducts } from "@/lib/queries/sellers";
import { SellerCard } from "@/components/seller/SellerCard";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductSort } from "@/components/product/ProductSort";
import { Pagination } from "@/components/ui/Pagination";
import { Tabs } from "@/components/ui/Tabs";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import type { ProductSort as SortType } from "@/types/product";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const seller = await getSellerById(id);
  if (!seller) return { title: "Seller Not Found" };
  return {
    title: `${seller.shop_name} | Mymiso`,
    description: seller.shop_description || `Shop at ${seller.shop_name} on Mymiso`,
  };
}

async function SellerProducts({
  sellerId,
  sort,
  page,
}: {
  sellerId: string;
  sort: SortType;
  page: number;
}) {
  const result = await getSellerProducts(sellerId, { sort, page });

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <p className="text-[14px] text-text-secondary">
          {result.total} {result.total === 1 ? "product" : "products"}
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

export default async function SellerStorefrontPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const rawParams = await searchParams;
  const seller = await getSellerById(id);

  if (!seller) notFound();

  const sort = (typeof rawParams.sort === "string"
    ? rawParams.sort
    : "newest") as SortType;
  const page = typeof rawParams.page === "string" ? Number(rawParams.page) : 1;

  return (
    <div className="max-w-[1400px] mx-auto px-3 sm:px-6 py-6">
      <SellerCard seller={seller} className="mb-8" />

      <Tabs
        tabs={[
          {
            id: "products",
            label: "Products",
            content: (
              <Suspense
                fallback={
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mt-4">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <ProductCardSkeleton key={i} />
                    ))}
                  </div>
                }
              >
                <SellerProducts
                  sellerId={seller.id}
                  sort={sort}
                  page={page}
                />
              </Suspense>
            ),
          },
          {
            id: "about",
            label: "About",
            content: (
              <div className="py-4 space-y-4">
                {seller.shop_description ? (
                  <p className="text-[15px] text-text-secondary leading-relaxed whitespace-pre-wrap">
                    {seller.shop_description}
                  </p>
                ) : (
                  <p className="text-[14px] text-text-muted">
                    This seller has not added a description yet.
                  </p>
                )}
                <div className="flex flex-wrap gap-4 text-[13px] text-text-muted pt-2 border-t border-border-subtle">
                  <span>
                    Rating: {seller.rating_average}/5 ({seller.rating_count}{" "}
                    reviews)
                  </span>
                  <span>{seller.total_sales.toLocaleString()} total sales</span>
                  {seller.country && <span>Ships from {seller.country}</span>}
                </div>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
