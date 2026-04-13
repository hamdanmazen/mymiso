"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ReviewForm } from "@/components/review/ReviewForm";
import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";

interface PendingItem {
  orderId: string;
  orderNumber: string;
  productId: string;
  productTitle: string;
  productThumbnail: string | null;
}

interface ReviewsClientProps {
  pendingItems: PendingItem[];
}

export function ReviewsClient({ pendingItems }: ReviewsClientProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const router = useRouter();

  function getKey(item: PendingItem) {
    return `${item.orderId}-${item.productId}`;
  }

  return (
    <div className="space-y-3">
      {pendingItems.map((item) => {
        const key = getKey(item);
        const isExpanded = expandedId === key;

        return (
          <Card key={key}>
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-comfortable overflow-hidden bg-surface-subtle shrink-0">
                {item.productThumbnail ? (
                  <Image
                    src={item.productThumbnail}
                    alt={item.productTitle}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                ) : (
                  <div className="w-full h-full bg-surface-subtle" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-medium text-text-primary truncate">
                  {item.productTitle}
                </p>
                <p className="text-[12px] text-text-muted">
                  Order {item.orderNumber}
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  setExpandedId(isExpanded ? null : key)
                }
              >
                {isExpanded ? (
                  <>
                    <ChevronUp size={14} />
                    Close
                  </>
                ) : (
                  <>
                    <ChevronDown size={14} />
                    Write Review
                  </>
                )}
              </Button>
            </div>

            {isExpanded && (
              <div className="mt-4 pt-4 border-t border-border-subtle">
                <ReviewForm
                  productId={item.productId}
                  orderId={item.orderId}
                  productTitle={item.productTitle}
                  onSuccess={() => {
                    setExpandedId(null);
                    router.refresh();
                  }}
                />
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
