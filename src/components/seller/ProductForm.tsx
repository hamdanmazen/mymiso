"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
import { createProduct, updateProduct } from "@/lib/actions/seller";
import {
  productFormSchema,
  type ProductFormInput,
} from "@/lib/utils/validators";
import { ImagePlus, X, GripVertical } from "lucide-react";

type CategoryOption = { value: string; label: string };

interface ProductFormProps {
  product?: {
    id: string;
    title: string;
    description: string | null;
    price: number;
    compare_at_price: number | null;
    category_id: string | null;
    sku: string | null;
    stock_quantity: number;
    low_stock_threshold: number;
    tags: string[];
    is_active: boolean;
    shipping_weight: number | null;
    shipping_free: boolean;
    shipping_origin_country: string | null;
    images: string[];
  };
  categories: CategoryOption[];
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();
  const isEditing = !!product;

  const [form, setForm] = useState({
    title: product?.title ?? "",
    description: product?.description ?? "",
    price: product?.price ?? 0,
    compareAtPrice: product?.compare_at_price ?? undefined,
    categoryId: product?.category_id ?? "",
    sku: product?.sku ?? "",
    stockQuantity: product?.stock_quantity ?? 0,
    lowStockThreshold: product?.low_stock_threshold ?? 5,
    tags: product?.tags?.join(", ") ?? "",
    isActive: product?.is_active ?? true,
    shippingWeight: product?.shipping_weight ?? undefined,
    shippingFree: product?.shipping_free ?? false,
    shippingOriginCountry: product?.shipping_origin_country ?? "",
  });

  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField(field: string, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setSubmitError("");
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  function handleImageUrlAdd() {
    // Simplified: add placeholder image URL
    // In production, this would use Supabase Storage upload
    const url = prompt("Enter image URL:");
    if (url) {
      setImages((prev) => [...prev, url]);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setSubmitError("");

    const tagsArray = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const input: ProductFormInput = {
      title: form.title,
      description: form.description || undefined,
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : undefined,
      categoryId: form.categoryId || undefined,
      sku: form.sku || undefined,
      stockQuantity: Number(form.stockQuantity),
      lowStockThreshold: Number(form.lowStockThreshold),
      tags: tagsArray.length > 0 ? tagsArray : undefined,
      isActive: form.isActive,
      shippingWeight: form.shippingWeight ? Number(form.shippingWeight) : undefined,
      shippingFree: form.shippingFree,
      shippingOriginCountry: form.shippingOriginCountry || undefined,
    };

    const parsed = productFormSchema.safeParse(input);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as string;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    let result;
    if (isEditing) {
      result = await updateProduct(product.id, { ...input, images });
    } else {
      result = await createProduct({ ...input, images });
    }

    if (result.error) {
      setSubmitError(result.error);
      setLoading(false);
      return;
    }

    router.push("/seller/products");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {submitError && (
        <div className="p-3 rounded-comfortable bg-error-subtle text-error text-[13px]">
          {submitError}
        </div>
      )}

      {/* Basic info */}
      <Card>
        <h2 className="text-[16px] font-semibold mb-4">Basic Information</h2>
        <div className="space-y-4">
          <Input
            label="Product Title"
            placeholder="e.g. Wireless Bluetooth Headphones"
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
            error={errors.title}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-text-secondary">
              Description
            </label>
            <textarea
              placeholder="Describe your product..."
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              rows={4}
              className="w-full bg-surface-input border border-border-default rounded-comfortable px-4 py-3 text-[14px] text-text-primary placeholder:text-text-muted focus-ring transition-all duration-150 resize-y"
            />
          </div>
          <Select
            label="Category"
            value={form.categoryId}
            onChange={(e) => updateField("categoryId", e.target.value)}
            options={categories}
            placeholder="Select a category"
          />
          <Input
            label="Tags"
            placeholder="tag1, tag2, tag3"
            value={form.tags}
            onChange={(e) => updateField("tags", e.target.value)}
            hint="Comma-separated tags for search"
          />
        </div>
      </Card>

      {/* Images */}
      <Card>
        <h2 className="text-[16px] font-semibold mb-4">Images</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
          {images.map((url, i) => (
            <div
              key={i}
              className="relative group aspect-square bg-surface-subtle rounded-comfortable overflow-hidden border border-border-default"
            >
              <img
                src={url}
                alt={`Product ${i + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="p-1.5 rounded-comfortable bg-white/90 text-error hover:bg-white transition-colors"
                >
                  <X size={14} />
                </button>
                <span className="p-1.5 rounded-comfortable bg-white/90 text-text-muted">
                  <GripVertical size={14} />
                </span>
              </div>
              {i === 0 && (
                <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 text-[10px] font-bold bg-mizo-teal text-white rounded-compact">
                  Main
                </span>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleImageUrlAdd}
            className="aspect-square border-2 border-dashed border-border-default rounded-comfortable flex flex-col items-center justify-center gap-1 text-text-muted hover:border-mizo-teal hover:text-mizo-teal transition-colors"
          >
            <ImagePlus size={20} />
            <span className="text-[11px] font-medium">Add Image</span>
          </button>
        </div>
        <p className="text-[12px] text-text-muted">
          First image is used as thumbnail. Drag to reorder.
        </p>
      </Card>

      {/* Pricing */}
      <Card>
        <h2 className="text-[16px] font-semibold mb-4">Pricing</h2>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Price (USD)"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={form.price || ""}
            onChange={(e) => updateField("price", parseFloat(e.target.value) || 0)}
            error={errors.price}
          />
          <Input
            label="Compare at Price"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={form.compareAtPrice ?? ""}
            onChange={(e) =>
              updateField(
                "compareAtPrice",
                e.target.value ? parseFloat(e.target.value) : undefined
              )
            }
            hint="Original price to show discount"
          />
        </div>
      </Card>

      {/* Inventory */}
      <Card>
        <h2 className="text-[16px] font-semibold mb-4">Inventory</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Input
            label="SKU"
            placeholder="SKU-001"
            value={form.sku}
            onChange={(e) => updateField("sku", e.target.value)}
          />
          <Input
            label="Stock Quantity"
            type="number"
            min="0"
            value={form.stockQuantity}
            onChange={(e) =>
              updateField("stockQuantity", parseInt(e.target.value) || 0)
            }
            error={errors.stockQuantity}
          />
          <Input
            label="Low Stock Alert"
            type="number"
            min="0"
            value={form.lowStockThreshold}
            onChange={(e) =>
              updateField("lowStockThreshold", parseInt(e.target.value) || 0)
            }
            hint="Alert when stock falls below"
          />
        </div>
      </Card>

      {/* Shipping */}
      <Card>
        <h2 className="text-[16px] font-semibold mb-4">Shipping</h2>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Weight (kg)"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.5"
            value={form.shippingWeight ?? ""}
            onChange={(e) =>
              updateField(
                "shippingWeight",
                e.target.value ? parseFloat(e.target.value) : undefined
              )
            }
          />
          <Select
            label="Origin Country"
            value={form.shippingOriginCountry}
            onChange={(e) => updateField("shippingOriginCountry", e.target.value)}
            placeholder="Select country"
            options={[
              { value: "Lebanon", label: "Lebanon" },
              { value: "UAE", label: "UAE" },
              { value: "Saudi Arabia", label: "Saudi Arabia" },
              { value: "Jordan", label: "Jordan" },
              { value: "Egypt", label: "Egypt" },
            ]}
          />
        </div>
        <label className="flex items-center gap-2 mt-4 cursor-pointer">
          <input
            type="checkbox"
            checked={form.shippingFree}
            onChange={(e) => updateField("shippingFree", e.target.checked)}
            className="w-4 h-4 rounded accent-mizo-teal"
          />
          <span className="text-[14px] text-text-secondary">
            Free shipping
          </span>
        </label>
      </Card>

      {/* Status */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[16px] font-semibold">Product Status</h2>
            <p className="text-[13px] text-text-muted mt-1">
              {form.isActive
                ? "This product is visible to buyers"
                : "This product is hidden from the storefront"}
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => updateField("isActive", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-surface-overlay peer-focus:outline-none rounded-pill peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-circle after:h-5 after:w-5 after:transition-all peer-checked:bg-mizo-teal" />
          </label>
        </div>
      </Card>

      {/* Submit */}
      <div className="flex items-center gap-3">
        <Button type="submit" isLoading={loading}>
          {isEditing ? "Save Changes" : "Create Product"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/seller/products")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
