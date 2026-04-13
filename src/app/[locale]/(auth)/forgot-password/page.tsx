"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      { redirectTo: `${window.location.origin}/verify?type=recovery` }
    );

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <Card variant="featured" className="text-center">
        <div className="w-12 h-12 rounded-circle bg-success-subtle mx-auto mb-4 flex items-center justify-center">
          <Mail className="text-success" size={24} />
        </div>
        <h1 className="text-[24px] font-semibold tracking-tight mb-2">
          Check your email
        </h1>
        <p className="text-[14px] text-text-secondary mb-6">
          We sent a password reset link to{" "}
          <span className="text-text-primary font-medium">{email}</span>
        </p>
        <Link href="/login">
          <Button variant="ghost" fullWidth>
            <ArrowLeft size={16} />
            Back to Sign In
          </Button>
        </Link>
      </Card>
    );
  }

  return (
    <Card variant="featured">
      <h1 className="text-[24px] font-semibold tracking-tight mb-1">
        Reset your password
      </h1>
      <p className="text-[14px] text-text-secondary mb-6">
        Enter your email and we&apos;ll send you a reset link
      </p>

      {error && (
        <div className="mb-4 p-3 rounded-comfortable bg-error-subtle text-error text-[13px]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          autoComplete="email"
        />
        <Button type="submit" fullWidth isLoading={loading}>
          Send Reset Link
        </Button>
      </form>

      <p className="mt-6 text-center">
        <Link
          href="/login"
          className="text-[13px] text-mizo-teal hover:underline font-medium inline-flex items-center gap-1"
        >
          <ArrowLeft size={14} />
          Back to Sign In
        </Link>
      </p>
    </Card>
  );
}
