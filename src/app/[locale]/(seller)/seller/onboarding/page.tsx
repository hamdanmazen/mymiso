"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/client";
import {
  sellerOnboardingSchema,
  type SellerOnboardingInput,
} from "@/lib/utils/validators";
import { slugify } from "@/lib/utils/slugify";
import { Store } from "lucide-react";

export default function SellerOnboardingPage() {
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState<SellerOnboardingInput>({
    shopName: "",
    shopSlug: "",
    shopDescription: "",
    country: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  function updateField(field: keyof SellerOnboardingInput, value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "shopName" ? { shopSlug: slugify(value) } : {}),
    }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setAuthError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setAuthError("");

    const result = sellerOnboardingSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as string;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setAuthError("You must be logged in to create a seller account.");
      setLoading(false);
      return;
    }

    // Create seller profile
    const { error: sellerError } = await supabase.from("sellers").insert({
      user_id: user.id,
      shop_name: form.shopName,
      shop_slug: form.shopSlug,
      shop_description: form.shopDescription || null,
      country: form.country,
    });

    if (sellerError) {
      if (sellerError.code === "23505") {
        setAuthError("This shop name or URL is already taken. Please choose another.");
      } else {
        setAuthError(sellerError.message);
      }
      setLoading(false);
      return;
    }

    // Update user role to 'both' or 'seller'
    await supabase
      .from("profiles")
      .update({ role: "both", updated_at: new Date().toISOString() })
      .eq("id", user.id);

    router.push("/seller/dashboard");
    router.refresh();
  }

  return (
    <div className="max-w-xl mx-auto py-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-circle bg-mizo-teal-subtle mx-auto mb-4 flex items-center justify-center">
          <Store className="text-mizo-teal" size={28} />
        </div>
        <h1 className="text-[32px] font-semibold tracking-tight mb-2">
          Become a Seller
        </h1>
        <p className="text-[16px] text-text-secondary">
          Set up your shop and start selling on Mymiso
        </p>
      </div>

      <Card variant="featured">
        {authError && (
          <div className="mb-4 p-3 rounded-comfortable bg-error-subtle text-error text-[13px]">
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Shop Name"
            placeholder="My Awesome Store"
            value={form.shopName}
            onChange={(e) => updateField("shopName", e.target.value)}
            error={errors.shopName}
          />
          <Input
            label="Shop URL"
            placeholder="my-awesome-store"
            value={form.shopSlug}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, shopSlug: e.target.value }))
            }
            error={errors.shopSlug}
            hint={`mymiso.com/sellers/${form.shopSlug || "your-shop"}`}
          />
          <Input
            label="Shop Description"
            placeholder="Tell buyers what you sell..."
            value={form.shopDescription || ""}
            onChange={(e) => updateField("shopDescription", e.target.value)}
            error={errors.shopDescription}
          />
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

          <Button type="submit" fullWidth isLoading={loading} className="mt-2">
            Create My Shop
          </Button>
        </form>
      </Card>
    </div>
  );
}
