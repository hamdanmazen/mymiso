"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Mail, CheckCircle } from "lucide-react";

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyContent />
    </Suspense>
  );
}

function VerifyContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const type = searchParams.get("type");

  if (type === "recovery") {
    return (
      <Card variant="featured" className="text-center">
        <div className="w-12 h-12 rounded-circle bg-success-subtle mx-auto mb-4 flex items-center justify-center">
          <CheckCircle className="text-success" size={24} />
        </div>
        <h1 className="text-[24px] font-semibold tracking-tight mb-2">
          Password Updated
        </h1>
        <p className="text-[14px] text-text-secondary mb-6">
          Your password has been successfully reset.
        </p>
        <Link href="/login">
          <Button fullWidth>Sign In</Button>
        </Link>
      </Card>
    );
  }

  return (
    <Card variant="featured" className="text-center">
      <div className="w-12 h-12 rounded-circle bg-mizo-teal-subtle mx-auto mb-4 flex items-center justify-center">
        <Mail className="text-mizo-teal" size={24} />
      </div>
      <h1 className="text-[24px] font-semibold tracking-tight mb-2">
        Verify your email
      </h1>
      <p className="text-[14px] text-text-secondary mb-6">
        We sent a verification link to{" "}
        {email ? (
          <span className="text-text-primary font-medium">{email}</span>
        ) : (
          "your email address"
        )}
        . Click the link to activate your account.
      </p>
      <Link href="/login">
        <Button variant="ghost" fullWidth>
          Back to Sign In
        </Button>
      </Link>
    </Card>
  );
}
