import type { ReactNode, HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "default" | "compact" | "featured";
  hoverable?: boolean;
}

const paddingMap = {
  default: "p-5",
  compact: "p-4",
  featured: "p-6",
};

const radiusMap = {
  default: "rounded-spacious",
  compact: "rounded-comfortable",
  featured: "rounded-large",
};

export function Card({
  children,
  variant = "default",
  hoverable = false,
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={`
        bg-surface-raised border border-border-default
        shadow-standard
        ${radiusMap[variant]}
        ${paddingMap[variant]}
        ${
          hoverable
            ? "transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-elevated"
            : ""
        }
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
