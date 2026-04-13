import { Badge } from "@/components/ui/Badge";
import { ShieldCheck } from "lucide-react";

interface SellerBadgeProps {
  isVerified: boolean;
  className?: string;
}

export function SellerBadge({ isVerified, className = "" }: SellerBadgeProps) {
  if (!isVerified) return null;

  return (
    <Badge variant="verified" className={className}>
      <ShieldCheck size={12} />
      Verified Seller
    </Badge>
  );
}
