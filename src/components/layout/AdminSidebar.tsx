"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Store,
  Package,
  ShoppingBag,
  FolderTree,
  MessageSquareWarning,
} from "lucide-react";

const adminLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/sellers", label: "Sellers", icon: Store },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/reviews", label: "Reviews", icon: MessageSquareWarning },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-60 shrink-0 bg-surface-raised border-r border-border-default h-[calc(100dvh-64px)] sticky top-16">
      <div className="px-4 py-3 border-b border-border-subtle">
        <span className="text-[12px] font-semibold uppercase tracking-wider text-mizo-red">
          Admin Panel
        </span>
      </div>
      <nav className="flex flex-col gap-1 p-3 mt-1">
        {adminLinks.map((link) => {
          const isActive = pathname.includes(link.href);
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
