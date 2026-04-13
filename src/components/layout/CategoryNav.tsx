"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Smartphone,
  Shirt,
  Home as HomeIcon,
  Heart,
  Dumbbell,
  BookOpen,
  Car,
  Baby,
  Gamepad2,
  Utensils,
} from "lucide-react";
import type { ComponentType } from "react";

interface CategoryLink {
  name: string;
  slug: string;
  icon: ComponentType<{ size?: number }>;
}

const categories: CategoryLink[] = [
  { name: "Electronics", slug: "electronics", icon: Smartphone },
  { name: "Fashion", slug: "fashion", icon: Shirt },
  { name: "Home & Garden", slug: "home-garden", icon: HomeIcon },
  { name: "Beauty", slug: "beauty", icon: Heart },
  { name: "Sports", slug: "sports", icon: Dumbbell },
  { name: "Books", slug: "books", icon: BookOpen },
  { name: "Automotive", slug: "automotive", icon: Car },
  { name: "Baby & Kids", slug: "baby-kids", icon: Baby },
  { name: "Gaming", slug: "gaming", icon: Gamepad2 },
  { name: "Food", slug: "food", icon: Utensils },
];

export function CategoryNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-surface-raised border-b border-border-subtle">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center h-12 gap-0 overflow-x-auto scrollbar-none px-4 sm:px-6">
          {categories.map((cat) => {
            const isActive = pathname === `/categories/${cat.slug}`;
            const Icon = cat.icon;

            return (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className={`
                  flex items-center gap-1.5 shrink-0
                  px-3 h-full text-[13px] font-medium
                  border-b-2 transition-colors
                  ${
                    isActive
                      ? "text-text-primary border-mizo-red"
                      : "text-text-secondary border-transparent hover:text-text-primary"
                  }
                `}
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{cat.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
