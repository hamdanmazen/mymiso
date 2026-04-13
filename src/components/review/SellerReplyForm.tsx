"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { submitSellerReply } from "@/lib/actions/review";

interface SellerReplyFormProps {
  reviewId: string;
  existingBody?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function SellerReplyForm({
  reviewId,
  existingBody,
  onSuccess,
  onCancel,
}: SellerReplyFormProps) {
  const [body, setBody] = useState(existingBody || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) {
      setError("Reply cannot be empty");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const result = await submitSellerReply({ reviewId, body: body.trim() });
    setIsSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit} className="ml-2 pl-3 border-l-2 border-mizo-teal/30 py-2 mt-2">
      <label className="text-[12px] font-semibold text-mizo-teal block mb-1.5">
        Your reply as seller
      </label>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Reply to this review..."
        rows={3}
        maxLength={2000}
        className="w-full bg-surface-input border border-border-default rounded-comfortable px-3 py-2 text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-mizo-teal focus:ring-[3px] focus:ring-mizo-teal/20 transition-all resize-none"
      />

      {error && <p className="text-[12px] text-error mt-1">{error}</p>}

      <div className="flex items-center gap-2 mt-2">
        <Button type="submit" size="sm" isLoading={isSubmitting}>
          {existingBody ? "Update Reply" : "Post Reply"}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
