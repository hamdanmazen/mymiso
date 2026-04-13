import { ProductForm } from "@/components/seller/ProductForm";
import { getCategories } from "@/lib/queries/categories";

export default async function NewProductPage() {
  const categories = await getCategories();
  const categoryOptions = categories.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  return (
    <div>
      <h1 className="text-[24px] font-semibold tracking-tight mb-6">
        Add New Product
      </h1>
      <ProductForm categories={categoryOptions} />
    </div>
  );
}
