"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { updateShopSettings } from "@/lib/actions/seller";
import {
  shopSettingsSchema,
  type ShopSettingsInput,
} from "@/lib/utils/validators";
import { slugify } from "@/lib/utils/slugify";
import { ShieldCheck, Store } from "lucide-react";

interface ShopSettingsFormProps {
  seller: {
    shopName: string;
    shopSlug: string;
    shopDescription: string;
    country: string;
    shopLogoUrl: string | null;
    shopBannerUrl: string | null;
    isVerified: boolean;
  };
}

export function ShopSettingsForm({ seller }: ShopSettingsFormProps) {
  const router = useRouter();

  const [form, setForm] = useState<ShopSettingsInput>({
    shopName: seller.shopName,
    shopSlug: seller.shopSlug,
    shopDescription: seller.shopDescription,
    country: seller.country,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function updateField(field: keyof ShopSettingsInput, value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "shopName" ? { shopSlug: slugify(value) } : {}),
    }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setSubmitError("");
    setSuccess(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setSubmitError("");
    setSuccess(false);

    const parsed = shopSettingsSchema.safeParse(form);
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
    const result = await updateShopSettings(form);

    if (result.error) {
      setSubmitError(result.error);
    } else {
      setSuccess(true);
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {submitError && (
        <div className="p-3 rounded-comfortable bg-error-subtle text-error text-[13px]">
          {submitError}
        </div>
      )}
      {success && (
        <div className="p-3 rounded-comfortable bg-success-subtle text-success text-[13px]">
          Settings saved successfully!
        </div>
      )}

      {/* Shop identity */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[16px] font-semibold">Shop Identity</h2>
          {seller.isVerified && (
            <Badge variant="verified">
              <ShieldCheck size={12} /> Verified
            </Badge>
          )}
        </div>

        {/* Logo preview */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-comfortable bg-surface-subtle border border-border-default flex items-center justify-center overflow-hidden">
            {seller.shopLogoUrl ? (
              <img
                src={seller.shopLogoUrl}
                alt="Shop logo"
                className="w-full h-full object-cover"
              />
            ) : (
              <Store size={24} className="text-text-muted" />
            )}
          </div>
          <div>
            <p className="text-[14px] font-medium">{seller.shopName}</p>
            <p className="text-[12px] text-text-muted">
              mymiso.com/sellers/{seller.shopSlug}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Input
            label="Shop Name"
            value={form.shopName}
            onChange={(e) => updateField("shopName", e.target.value)}
            error={errors.shopName}
          />
          <Input
            label="Shop URL"
            value={form.shopSlug}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, shopSlug: e.target.value }))
            }
            error={errors.shopSlug}
            hint={`mymiso.com/sellers/${form.shopSlug || "your-shop"}`}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-text-secondary">
              Shop Description
            </label>
            <textarea
              value={form.shopDescription}
              onChange={(e) => updateField("shopDescription", e.target.value)}
              rows={3}
              placeholder="Tell buyers about your shop..."
              className="w-full bg-surface-input border border-border-default rounded-comfortable px-4 py-3 text-[14px] text-text-primary placeholder:text-text-muted focus-ring transition-all duration-150 resize-y"
            />
          </div>
          <Select
            label="Country"
            value={form.country}
            onChange={(e) => updateField("country", e.target.value)}
            error={errors.country}
            placeholder="Select your country"
            options={[
              { value: "LB", label: "Lebanon" },
              { value: "AE", label: "UAE" },
              { value: "SA", label: "Saudi Arabia" },
              { value: "JO", label: "Jordan" },
              { value: "EG", label: "Egypt" },
              { value: "KW", label: "Kuwait" },
              { value: "QA", label: "Qatar" },
              { value: "BH", label: "Bahrain" },
              { value: "OM", label: "Oman" },
              { value: "OTHER", label: "Other" },
            ]}
          />
        </div>
      </Card>

      {/* Shop branding */}
      <Card>
        <h2 className="text-[16px] font-semibold mb-4">Shop Branding</h2>
        <div className="space-y-4">
          <div>
            <label className="text-[13px] font-medium text-text-secondary mb-1.5 block">
              Shop Logo
            </label>
            <div className="flex items-center gap-3">
              <div className="w-20 h-20 rounded-comfortable bg-surface-subtle border-2 border-dashed border-border-default flex items-center justify-center">
                {seller.shopLogoUrl ? (
                  <img
                    src={seller.shopLogoUrl}
                    alt="Logo"
                    className="w-full h-full object-cover rounded-comfortable"
                  />
                ) : (
                  <Store size={24} className="text-text-muted" />
                )}
              </div>
              <div>
                <p className="text-[13px] text-text-muted">
                  Upload a square image (recommended 256x256px)
                </p>
                <p className="text-[12px] text-text-muted mt-0.5">
                  Image upload via Supabase Storage (coming soon)
                </p>
              </div>
            </div>
          </div>
          <div>
            <label className="text-[13px] font-medium text-text-secondary mb-1.5 block">
              Shop Banner
            </label>
            <div className="w-full h-32 rounded-comfortable bg-surface-subtle border-2 border-dashed border-border-default flex items-center justify-center">
              {seller.shopBannerUrl ? (
                <img
                  src={seller.shopBannerUrl}
                  alt="Banner"
                  className="w-full h-full object-cover rounded-comfortable"
                />
              ) : (
                <p className="text-[13px] text-text-muted">
                  Banner image (recommended 1200x300px)
                </p>
              )}
            </div>
          </div>
        </div>
      </Card>

      <Button type="submit" isLoading={loading}>
        Save Settings
      </Button>
    </form>
  );
}
