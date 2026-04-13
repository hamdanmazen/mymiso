import { ProductForm } from "@/components/seller/ProductForm";
import { getSellerProductById } from "@/lib/queries/seller-dashboard";
import { getCategories } from "@/lib/queries/categories";
import { Card } from "@/components/ui/Card";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getSellerProductById(id),
    getCategories(),
  ]);

  if (!product) {
    return (
      <Card className="text-center py-12">
        <AlertTriangle size={40} className="text-warning mx-auto mb-3" />
        <p className="text-[16px] text-text-secondary">Product not found</p>
        <p className="text-[13px] text-text-muted mt-1">
          This product may have been deleted or you don&apos;t have access.
        </p>
        <Link href="/seller/products" className="inline-block mt-4">
          <Button size="sm" variant="ghost">
            Back to Products
          </Button>
        </Link>
      </Card>
    );
  }

  const categoryOptions = categories.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  return (
    <div>
      <h1 className="text-[24px] font-semibold tracking-tight mb-6">
        Edit Product
      </h1>
      <ProductForm product={product} categories={categoryOptions} />
    </div>
  );
}
