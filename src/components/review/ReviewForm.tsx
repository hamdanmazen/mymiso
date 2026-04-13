"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { submitReview } from "@/lib/actions/review";
import { Star } from "lucide-react";

interface ReviewFormProps {
  productId: string;
  orderId: string;
  productTitle: string;
  onSuccess: () => void;
}

export function ReviewForm({
  productId,
  orderId,
  productTitle,
  onSuccess,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const result = await submitReview({
      orderId,
      productId,
      rating,
      title: title || undefined,
      body: body || undefined,
    });

    setIsSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-[14px] text-text-secondary">
        Review: <span className="text-text-primary font-medium">{productTitle}</span>
      </p>

      {/* Star rating */}
      <div>
        <label className="text-[13px] text-text-secondary block mb-2">
          Rating
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              onMouseEnter={() => setHoverRating(value)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-0.5 transition-transform hover:scale-110"
            >
              <Star
                size={28}
                className={
                  value <= (hoverRating || rating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-border-default"
                }
              />
            </button>
          ))}
        </div>
      </div>

      <Input
        label="Title (optional)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Summarize your experience"
      />

      <div>
        <label className="text-[13px] text-text-secondary block mb-1.5">
          Review (optional)
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Tell others about your experience..."
          rows={4}
          maxLength={2000}
          className="w-full bg-surface-input border border-border-default rounded-comfortable px-4 py-3 text-[14px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-mizo-teal focus:ring-[3px] focus:ring-mizo-teal/20 transition-all resize-none"
        />
      </div>

      {error && (
        <p className="text-[13px] text-error">{error}</p>
      )}

      <Button type="submit" isLoading={isSubmitting} className="w-full">
        Submit Review
      </Button>
    </form>
  );
}
