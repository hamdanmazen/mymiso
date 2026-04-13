import { getCurrentSellerId } from "@/lib/queries/seller-dashboard";
import { getSellerById } from "@/lib/queries/sellers";
import { Card } from "@/components/ui/Card";
import { ShopSettingsForm } from "@/components/seller/ShopSettingsForm";
import { AlertTriangle } from "lucide-react";

export default async function SellerSettingsPage() {
  const sellerId = await getCurrentSellerId();

  if (!sellerId) {
    return (
      <Card className="text-center py-12">
        <AlertTriangle size={40} className="text-warning mx-auto mb-3" />
        <p className="text-[16px] text-text-secondary">
          Seller account not found
        </p>
      </Card>
    );
  }

  const seller = await getSellerById(sellerId);

  if (!seller) {
    return (
      <Card className="text-center py-12">
        <AlertTriangle size={40} className="text-warning mx-auto mb-3" />
        <p className="text-[16px] text-text-secondary">
          Could not load shop settings
        </p>
      </Card>
    );
  }

  return (
    <div>
      <h1 className="text-[24px] font-semibold tracking-tight mb-6">
        Shop Settings
      </h1>
      <ShopSettingsForm
        seller={{
          shopName: seller.shop_name,
          shopSlug: seller.shop_slug,
          shopDescription: seller.shop_description ?? "",
          country: seller.country ?? "",
          shopLogoUrl: seller.shop_logo_url,
          shopBannerUrl: seller.shop_banner_url,
          isVerified: seller.is_verified,
        }}
      />
    </div>
  );
}
