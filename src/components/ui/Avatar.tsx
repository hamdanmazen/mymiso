import Image from "next/image";
import { User } from "lucide-react";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: 32,
  md: 40,
  lg: 56,
};

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-14 w-14",
};

export function Avatar({ src, alt = "User", size = "md", className = "" }: AvatarProps) {
  const pixels = sizeMap[size];

  return (
    <div
      className={`
        relative overflow-hidden rounded-circle
        bg-surface-subtle flex items-center justify-center
        ${sizeClasses[size]} ${className}
      `}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={pixels}
          height={pixels}
          className="object-cover w-full h-full"
        />
      ) : (
        <User className="text-text-muted" size={pixels * 0.5} />
      )}
    </div>
  );
}
