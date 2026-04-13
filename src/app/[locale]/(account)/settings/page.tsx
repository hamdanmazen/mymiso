"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { createClient } from "@/lib/supabase/client";
import { profileSchema, type ProfileInput } from "@/lib/utils/validators";
import Link from "next/link";

export default function SettingsPage() {
  const supabase = createClient();

  const [form, setForm] = useState<ProfileInput>({
    fullName: "",
    phone: "",
    preferredLanguage: "en",
    preferredCurrency: "USD",
  });
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isSeller, setIsSeller] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        const profile = data as {
          full_name: string | null;
          phone: string | null;
          preferred_language: string;
          preferred_currency: string;
          avatar_url: string | null;
          role: string;
        };
        setForm({
          fullName: profile.full_name || "",
          phone: profile.phone || "",
          preferredLanguage: profile.preferred_language,
          preferredCurrency: profile.preferred_currency,
        });
        setAvatarUrl(profile.avatar_url);
        setIsSeller(profile.role === "seller" || profile.role === "both");
      }
    }
    loadProfile();
  }, [supabase]);

  function updateField(field: keyof ProfileInput, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setSaved(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const result = profileSchema.safeParse(form);
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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: form.fullName,
        phone: form.phone || null,
        preferred_language: form.preferredLanguage,
        preferred_currency: form.preferredCurrency,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    setLoading(false);
    if (!error) setSaved(true);
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const ext = file.name.split(".").pop();
    const path = `avatars/${user.id}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });

    if (uploadError) return;

    const { data: { publicUrl } } = supabase.storage
      .from("avatars")
      .getPublicUrl(path);

    await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl })
      .eq("id", user.id);

    setAvatarUrl(publicUrl);
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-[24px] font-semibold tracking-tight mb-6">
        Account Settings
      </h1>

      <Card variant="featured" className="mb-6">
        <div className="flex items-center gap-4 mb-6">
          <Avatar src={avatarUrl} size="lg" />
          <div>
            <label className="cursor-pointer">
              <span className="text-[13px] text-mizo-teal hover:underline font-medium">
                Change avatar
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </label>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            value={form.fullName}
            onChange={(e) => updateField("fullName", e.target.value)}
            error={errors.fullName}
          />
          <Input
            label="Phone"
            type="tel"
            value={form.phone || ""}
            onChange={(e) => updateField("phone", e.target.value)}
            error={errors.phone}
            hint="Optional — used for order notifications"
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Language"
              value={form.preferredLanguage}
              onChange={(e) => updateField("preferredLanguage", e.target.value)}
              options={[
                { value: "en", label: "English" },
                { value: "ar", label: "Arabic" },
              ]}
            />
            <Select
              label="Currency"
              value={form.preferredCurrency}
              onChange={(e) => updateField("preferredCurrency", e.target.value)}
              options={[
                { value: "USD", label: "USD ($)" },
                { value: "LBP", label: "LBP (L.L.)" },
              ]}
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" isLoading={loading}>
              Save Changes
            </Button>
            {saved && (
              <span className="text-[13px] text-success font-medium">
                Saved!
              </span>
            )}
          </div>
        </form>
      </Card>

      {!isSeller && (
        <Card variant="featured">
          <h2 className="text-[18px] font-semibold mb-2">Start Selling</h2>
          <p className="text-[14px] text-text-secondary mb-4">
            Turn your account into a seller account and start listing products on Mymiso.
          </p>
          <Link href="/seller/onboarding">
            <Button variant="secondary">Become a Seller</Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
