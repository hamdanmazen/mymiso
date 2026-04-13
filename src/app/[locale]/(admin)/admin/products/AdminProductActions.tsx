"use client";

import { useTransition } from "react";
import { toggleProductActive, toggleProductFeatured } from "@/lib/actions/admin";
import { Eye, EyeOff, Star, StarOff } from "lucide-react";

export function AdminProductActions({
  productId,
  isActive,
  isFeatured,
}: {
  productId: string;
  isActive: boolean;
  isFeatured: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-end gap-1">
      <button
        onClick={() =>
          startTransition(async () => { await toggleProductActive(productId, !isActive); })
        }
        disabled={isPending}
        title={isActive ? "Deactivate" : "Activate"}
        className={`
          p-1.5 rounded-standard transition-colors disabled:opacity-50
          ${isActive
            ? "text-error hover:bg-error-subtle"
            : "text-success hover:bg-success-subtle"
          }
        `}
      >
        {isActive ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
      <button
        onClick={() =>
          startTransition(async () => { await toggleProductFeatured(productId, !isFeatured); })
        }
        disabled={isPending}
        title={isFeatured ? "Unfeature" : "Feature"}
        className={`
          p-1.5 rounded-standard transition-colors disabled:opacity-50
          ${isFeatured
            ? "text-warning hover:bg-warning-subtle"
            : "text-text-muted hover:bg-surface-subtle"
          }
        `}
      >
        {isFeatured ? <StarOff size={16} /> : <Star size={16} />}
      </button>
    </div>
  );
}
