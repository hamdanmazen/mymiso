import { Card } from "@/components/ui/Card";
import { ShoppingBag, Heart, MapPin, Star, Bell, MessageSquare } from "lucide-react";
import Link from "next/link";

const quickLinks = [
  { href: "/orders", label: "My Orders", icon: ShoppingBag, description: "Track and manage your orders" },
  { href: "/wishlist", label: "Wishlist", icon: Heart, description: "Items you've saved" },
  { href: "/addresses", label: "Addresses", icon: MapPin, description: "Manage delivery addresses" },
  { href: "/reviews", label: "My Reviews", icon: Star, description: "Reviews you've written" },
  { href: "/messages", label: "Messages", icon: MessageSquare, description: "Chat with sellers" },
  { href: "/notifications", label: "Notifications", icon: Bell, description: "Order updates and alerts" },
];

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-[24px] font-semibold tracking-tight mb-6">
        My Account
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link key={link.href} href={link.href}>
              <Card hoverable className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-comfortable bg-mizo-teal-subtle flex items-center justify-center shrink-0">
                  <Icon size={20} className="text-mizo-teal" />
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-text-primary">
                    {link.label}
                  </p>
                  <p className="text-[13px] text-text-secondary">
                    {link.description}
                  </p>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
