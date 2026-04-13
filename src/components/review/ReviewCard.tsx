"use client";

import { useState } from "react";
import { StarRating } from "@/components/ui/StarRating";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { timeAgo } from "@/lib/utils/formatDate";
import { toggleHelpfulVote } from "@/lib/actions/review";
import { ThumbsUp, Store, MessageSquare } from "lucide-react";
import type { ReviewWithProfile } from "@/lib/queries/reviews";

interface ReviewCardProps {
  review: ReviewWithProfile;
  showReplyForm?: boolean;
  onReply?: (reviewId: string) => void;
}

export function ReviewCard({ review, showReplyForm, onReply }: ReviewCardProps) {
  const [helpfulCount, setHelpfulCount] = useState(review.helpful_count);
  const [hasVoted, setHasVoted] = useState(review.user_voted ?? false);
  const [voting, setVoting] = useState(false);

  async function handleHelpfulVote() {
    setVoting(true);
    const result = await toggleHelpfulVote(review.id);
    setVoting(false);

    if (result.success) {
      setHasVoted(result.voted!);
      setHelpfulCount((prev) => prev + (result.voted ? 1 : -1));
    }
  }

  return (
    <div className="py-4 border-b border-border-subtle last:border-0">
      <div className="flex items-start gap-3">
        <Avatar
          src={review.profile?.avatar_url || undefined}
          alt={review.profile?.full_name || "User"}
          size="sm"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[14px] font-medium text-text-primary">
              {review.profile?.full_name || "Anonymous"}
            </span>
            {review.is_verified_purchase && (
              <Badge variant="verified">Verified Purchase</Badge>
            )}
            <span className="text-[12px] text-text-muted">
              {timeAgo(review.created_at)}
            </span>
          </div>

          <StarRating rating={review.rating} size="sm" className="mt-1" />

          {review.title && (
            <p className="text-[14px] font-semibold text-text-primary mt-2">
              {review.title}
            </p>
          )}

          {review.body && (
            <p className="text-[14px] text-text-secondary mt-1 leading-relaxed">
              {review.body}
            </p>
          )}

          {/* Helpful vote button */}
          <div className="flex items-center gap-3 mt-3">
            <button
              type="button"
              onClick={handleHelpfulVote}
              disabled={voting}
              className={`
                inline-flex items-center gap-1.5 text-[12px] py-1 px-2.5 rounded-standard
                transition-all border
                ${
                  hasVoted
                    ? "bg-mizo-teal-subtle text-mizo-teal border-mizo-teal/30"
                    : "bg-transparent text-text-muted border-border-default hover:text-text-secondary hover:border-border-default"
                }
                disabled:opacity-50
              `}
            >
              <ThumbsUp size={13} className={hasVoted ? "fill-current" : ""} />
              Helpful
              {helpfulCount > 0 && (
                <span className="font-tabular">({helpfulCount})</span>
              )}
            </button>

            {onReply && (
              <button
                type="button"
                onClick={() => onReply(review.id)}
                className="inline-flex items-center gap-1.5 text-[12px] py-1 px-2.5 rounded-standard text-text-muted border border-border-default hover:text-text-secondary transition-all"
              >
                <MessageSquare size={13} />
                Reply
              </button>
            )}
          </div>

          {/* Seller replies */}
          {review.replies && review.replies.length > 0 && (
            <div className="mt-3 space-y-2">
              {review.replies.map((reply) => (
                <div
                  key={reply.id}
                  className="ml-2 pl-3 border-l-2 border-mizo-teal/30 py-2"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Store size={13} className="text-mizo-teal" />
                    <span className="text-[12px] font-semibold text-mizo-teal">
                      {reply.seller?.shop_name || "Seller"}
                    </span>
                    <span className="text-[11px] text-text-muted">
                      {timeAgo(reply.created_at)}
                    </span>
                  </div>
                  <p className="text-[13px] text-text-secondary leading-relaxed">
                    {reply.body}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
