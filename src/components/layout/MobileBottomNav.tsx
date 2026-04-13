"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, ShoppingCart, User } from "lucide-react";
import { useTranslations } from "next-intl";

export function MobileBottomNav() {
  const pathname = usePathname();
  const t = useTranslations("nav");

  const navItems = [
    { href: "/", label: t("home"), icon: Home },
    { href: "/categories/electronics", label: t("categories"), icon: LayoutGrid },
    { href: "/cart", label: t("cart"), icon: ShoppingCart },
    { href: "/dashboard", label: t("account"), icon: User },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-surface-raised border-t border-border-subtle h-14" role="navigation" aria-label="Mobile navigation">
      <div className="flex items-center justify-around h-full">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/" || pathname === "/en" || pathname === "/ar" || pathname === "/fr"
              : pathname.includes(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center justify-center gap-0.5
                min-w-[44px] min-h-[44px]
                text-[11px] font-medium transition-colors
                ${isActive ? "text-mizo-red" : "text-text-muted"}
              `}
            >
              <Icon size={22} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
