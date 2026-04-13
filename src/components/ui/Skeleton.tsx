interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className = "",
  variant = "rectangular",
  width,
  height,
}: SkeletonProps) {
  const variantStyles = {
    text: "rounded-compact h-4",
    circular: "rounded-circle",
    rectangular: "rounded-comfortable",
  };

  return (
    <div
      className={`animate-skeleton ${variantStyles[variant]} ${className}`}
      style={{ width, height }}
      role="status"
      aria-label="Loading"
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-surface-raised border border-border-default rounded-spacious overflow-hidden">
      <Skeleton className="w-full aspect-square" />
      <div className="p-3 flex flex-col gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex items-center gap-2 mt-1">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-4 w-14" />
        </div>
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}
