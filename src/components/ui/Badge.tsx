import type { ReactNode } from "react";

type BadgeVariant =
  | "flash"
  | "discount"
  | "verified"
  | "freeShipping"
  | "category"
  | "success"
  | "warning"
  | "error"
  | "info";

interface BadgeProps {
  variant: BadgeVariant;
  children: ReactNode;
  className?: string;
  pulse?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  flash:
    "bg-mizo-red text-white text-[11px] font-bold uppercase tracking-[0.05em] px-2.5 py-1 rounded-standard",
  discount:
    "bg-mizo-red text-white text-[13px] font-bold px-2 py-0.5 rounded-compact",
  verified:
    "bg-mizo-teal-subtle text-mizo-teal text-[11px] font-semibold px-2 py-[3px] rounded-standard",
  freeShipping:
    "bg-success-subtle text-success text-[11px] font-semibold px-2 py-[3px] rounded-standard",
  category:
    "bg-mizo-cream-subtle text-mizo-cream text-[12px] font-medium px-3 py-1 rounded-pill",
  success:
    "bg-success-subtle text-success text-[11px] font-semibold px-2 py-[3px] rounded-standard",
  warning:
    "bg-warning-subtle text-warning text-[11px] font-semibold px-2 py-[3px] rounded-standard",
  error:
    "bg-error-subtle text-error text-[11px] font-semibold px-2 py-[3px] rounded-standard",
  info: "bg-mizo-teal-subtle text-mizo-teal text-[11px] font-semibold px-2 py-[3px] rounded-standard",
};

export function Badge({ variant, children, className = "", pulse }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 leading-none whitespace-nowrap
        ${variantStyles[variant]}
        ${pulse ? "animate-flash" : ""}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
