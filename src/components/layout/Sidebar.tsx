"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  BarChart3,
  Warehouse,
  Wallet,
  MessageSquare,
  Settings,
} from "lucide-react";

const sellerLinks = [
  { href: "/seller/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/seller/products", label: "Products", icon: Package },
  { href: "/seller/orders", label: "Orders", icon: ShoppingBag },
  { href: "/seller/inventory", label: "Inventory", icon: Warehouse },
  { href: "/seller/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/seller/payouts", label: "Payouts", icon: Wallet },
  { href: "/seller/messages", label: "Messages", icon: MessageSquare },
  { href: "/seller/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-60 shrink-0 bg-surface-raised border-r border-border-default h-[calc(100dvh-64px)] sticky top-16">
      <nav className="flex flex-col gap-1 p-3 mt-2">
        {sellerLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`
                flex items-center gap-3 px-3 py-2.5
                text-[14px] font-medium rounded-comfortable
                transition-colors
                ${
                  isActive
                    ? "bg-mizo-red-subtle text-mizo-red"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-subtle"
                }
              `}
            >
              <Icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
