"use client";

import { useTransition } from "react";
import { verifySeller } from "@/lib/actions/admin";
import { ShieldCheck, ShieldX } from "lucide-react";

export function AdminSellerActions({
  sellerId,
  isVerified,
}: {
  sellerId: string;
  isVerified: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      await verifySeller(sellerId, !isVerified);
    });
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`
        inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium rounded-standard transition-colors
        disabled:opacity-50
        ${isVerified
          ? "text-error hover:bg-error-subtle"
          : "text-success hover:bg-success-subtle"
        }
      `}
    >
      {isVerified ? <ShieldX size={14} /> : <ShieldCheck size={14} />}
      {isPending ? "..." : isVerified ? "Revoke" : "Verify"}
    </button>
  );
}
