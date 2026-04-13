import type { ProductWithDetails } from "@/types/product";
import { getProductThumbnailUrl } from "@/lib/utils/images";

// Organization schema for the whole site
export function OrganizationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Mymiso",
    url: "https://mymiso.com",
    logo: "https://mymiso.com/logo.png",
    description:
      "Multi-vendor marketplace. Discover products from thousands of sellers.",
    sameAs: [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Product schema for product detail pages
export function ProductJsonLd({ product }: { product: ProductWithDetails }) {
  const imageUrl =
    product.thumbnail_url || getProductThumbnailUrl(product.id);

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description || product.title,
    image: imageUrl,
    sku: product.sku || product.id,
    brand: {
      "@type": "Brand",
      name: product.seller?.shop_name || "Mymiso",
    },
    offers: {
      "@type": "Offer",
      url: `https://mymiso.com/products/${product.slug}`,
      priceCurrency: product.currency,
      price: product.price,
      availability:
        product.stock_quantity > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: product.seller
        ? {
            "@type": "Organization",
            name: product.seller.shop_name,
          }
        : undefined,
    },
  };

  // Add aggregate rating if reviews exist
  if (product.rating_count > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.rating_average,
      reviewCount: product.rating_count,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Breadcrumb schema
export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
