import {
  ORDER_STATUS_STEPS,
  getOrderStatusStepIndex,
  getOrderStatusLabel,
} from "@/lib/utils/orderHelpers";
import { Check } from "lucide-react";

interface StatusTimelineProps {
  currentStatus: string;
  className?: string;
}

export function StatusTimeline({
  currentStatus,
  className = "",
}: StatusTimelineProps) {
  const currentIndex = getOrderStatusStepIndex(currentStatus);
  const isCancelled =
    currentStatus === "cancelled" || currentStatus === "refunded";

  return (
    <div className={`flex items-center gap-0 ${className}`}>
      {ORDER_STATUS_STEPS.map((step, index) => {
        const isComplete = !isCancelled && index <= currentIndex;
        const isCurrent = !isCancelled && index === currentIndex;

        return (
          <div key={step} className="flex items-center flex-1 last:flex-initial">
            {/* Step circle */}
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  transition-all text-[12px] font-semibold
                  ${
                    isCancelled
                      ? "bg-error-subtle text-error border border-error/30"
                      : isComplete
                        ? "bg-success text-white"
                        : "bg-surface-subtle text-text-muted border border-border-default"
                  }
                  ${isCurrent ? "ring-2 ring-success/30" : ""}
                `}
              >
                {isComplete && !isCurrent ? (
                  <Check size={14} />
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={`
                  text-[11px] mt-1.5 whitespace-nowrap
                  ${
                    isCancelled
                      ? "text-error"
                      : isComplete
                        ? "text-success font-medium"
                        : "text-text-muted"
                  }
                `}
              >
                {getOrderStatusLabel(step)}
              </span>
            </div>

            {/* Connector line */}
            {index < ORDER_STATUS_STEPS.length - 1 && (
              <div
                className={`
                  h-0.5 flex-1 mx-1 mt-[-18px]
                  ${
                    !isCancelled && index < currentIndex
                      ? "bg-success"
                      : "bg-border-default"
                  }
                `}
              />
            )}
          </div>
        );
      })}

      {isCancelled && (
        <div className="flex flex-col items-center ml-4">
          <div className="w-8 h-8 rounded-full bg-error text-white flex items-center justify-center">
            &times;
          </div>
          <span className="text-[11px] mt-1.5 text-error font-medium">
            {getOrderStatusLabel(currentStatus)}
          </span>
        </div>
      )}
    </div>
  );
}
