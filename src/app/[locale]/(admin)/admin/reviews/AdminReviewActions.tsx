"use client";

import { useTransition } from "react";
import { deleteReview } from "@/lib/actions/admin";
import { Trash2 } from "lucide-react";

export function AdminReviewActions({ reviewId }: { reviewId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Delete this review? This cannot be undone.")) return;
    startTransition(async () => {
      await deleteReview(reviewId);
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="p-2 text-text-muted hover:text-error hover:bg-error-subtle rounded-standard transition-colors disabled:opacity-50 shrink-0 self-start"
      title="Delete review"
    >
      <Trash2 size={16} />
    </button>
  );
}
