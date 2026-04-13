"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/client";
import { signupSchema, type SignupInput } from "@/lib/utils/validators";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState<SignupInput>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  function updateField(field: keyof SignupInput, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setAuthError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setAuthError("");

    const result = signupSchema.safeParse(form);
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
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.fullName,
        },
      },
    });

    if (error) {
      setAuthError(error.message);
      setLoading(false);
      return;
    }

    router.push("/verify?email=" + encodeURIComponent(form.email));
  }

  return (
    <Card variant="featured">
      <h1 className="text-[24px] font-semibold tracking-tight mb-1">
        Create your account
      </h1>
      <p className="text-[14px] text-text-secondary mb-6">
        Join Mymiso to shop or sell
      </p>

      {authError && (
        <div className="mb-4 p-3 rounded-comfortable bg-error-subtle text-error text-[13px]">
          {authError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          placeholder="John Doe"
          value={form.fullName}
          onChange={(e) => updateField("fullName", e.target.value)}
          error={errors.fullName}
          autoComplete="name"
        />
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => updateField("email", e.target.value)}
          error={errors.email}
          autoComplete="email"
        />
        <Input
          label="Password"
          type="password"
          placeholder="At least 8 characters"
          value={form.password}
          onChange={(e) => updateField("password", e.target.value)}
          error={errors.password}
          autoComplete="new-password"
        />
        <Input
          label="Confirm Password"
          type="password"
          placeholder="Repeat your password"
          value={form.confirmPassword}
          onChange={(e) => updateField("confirmPassword", e.target.value)}
          error={errors.confirmPassword}
          autoComplete="new-password"
        />

        <Button type="submit" fullWidth isLoading={loading}>
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-[13px] text-text-secondary">
        Already have an account?{" "}
        <Link href="/login" className="text-mizo-teal hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </Card>
  );
}
