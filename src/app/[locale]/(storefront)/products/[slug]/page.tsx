import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getProductBySlug, getRelatedProducts } from "@/lib/queries/products";
import { getProductReviews, getReviewSummary } from "@/lib/queries/reviews";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ReviewSummary } from "@/components/review/ReviewSummary";
import { ReviewCard } from "@/components/review/ReviewCard";
import { Tabs } from "@/components/ui/Tabs";
import { Skeleton } from "@/components/ui/Skeleton";
import { ProductJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getProductThumbnailUrl } from "@/lib/utils/images";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: `${product.title} | Mymiso`,
    description: product.description?.slice(0, 160) || product.title,
    openGraph: {
      title: product.title,
      description: product.description || product.title,
      images: [
        product.thumbnail_url || getProductThumbnailUrl(product.id),
      ],
    },
  };
}

async function ProductReviews({ productId }: { productId: string }) {
  const [summary, { reviews }] = await Promise.all([
    getReviewSummary(productId),
    getProductReviews(productId),
  ]);

  return (
    <div>
      <ReviewSummary summary={summary} />
      {reviews.length > 0 && (
        <div className="mt-4">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}

async function RelatedProducts({
  productId,
  categoryId,
}: {
  productId: string;
  categoryId: string | null;
}) {
  const products = await getRelatedProducts(productId, categoryId);
  if (products.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-[24px] font-semibold tracking-tight mb-4">
        You Might Also Like
      </h2>
      <ProductGrid products={products} />
    </section>
  );
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-[1400px] mx-auto px-3 sm:px-6 py-6">
      <ProductJsonLd product={product} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://mymiso.com" },
          { name: "Products", url: "https://mymiso.com/products" },
          { name: product.title, url: `https://mymiso.com/products/${product.slug}` },
        ]}
      />
      <ProductDetailClient product={product} />

      {/* Tabs: Description, Reviews, Seller Info */}
      <div className="mt-10">
        <Tabs
          tabs={[
            {
              id: "description",
              label: "Description",
              content: (
                <div className="prose prose-invert max-w-none">
                  <p className="text-[15px] text-text-secondary leading-relaxed whitespace-pre-wrap">
                    {product.description || "No description available."}
                  </p>
                  {product.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {product.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 text-[12px] font-medium text-mizo-cream bg-mizo-cream-subtle rounded-pill"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ),
            },
            {
              id: "reviews",
              label: `Reviews (${product.rating_count})`,
              content: (
                <Suspense
                  fallback={
                    <div className="space-y-4 py-4">
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                  }
                >
                  <ProductReviews productId={product.id} />
                </Suspense>
              ),
            },
            {
              id: "seller",
              label: "Seller Info",
              content: product.seller ? (
                <div className="py-4 space-y-3">
                  <h3 className="text-[18px] font-semibold text-text-primary">
                    {product.seller.shop_name}
                  </h3>
                  {product.seller.shop_description && (
                    <p className="text-[14px] text-text-secondary leading-relaxed">
                      {product.seller.shop_description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-4 text-[13px] text-text-muted">
                    <span>Rating: {product.seller.rating_average}/5</span>
                    <span>{product.seller.total_sales} sales</span>
                    {product.seller.country && (
                      <span>Ships from {product.seller.country}</span>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-[14px] text-text-muted py-4">
                  Seller information not available.
                </p>
              ),
            },
          ]}
        />
      </div>

      {/* Related Products */}
      <Suspense fallback={null}>
        <RelatedProducts
          productId={product.id}
          categoryId={product.category_id}
        />
      </Suspense>
    </div>
  );
}
