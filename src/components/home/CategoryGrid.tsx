import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { getCategories } from "@/lib/queries/categories";
import {
  Smartphone,
  Shirt,
  Home,
  Sparkles,
  Dumbbell,
  BookOpen,
  Car,
  Baby,
  Gamepad2,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  smartphone: Smartphone,
  shirt: Shirt,
  home: Home,
  sparkles: Sparkles,
  dumbbell: Dumbbell,
  "book-open": BookOpen,
  car: Car,
  baby: Baby,
  gamepad: Gamepad2,
  utensils: UtensilsCrossed,
};

function getCategoryIcon(iconName: string | null): LucideIcon {
  if (iconName && iconMap[iconName]) return iconMap[iconName];
  return Smartphone;
}

export async function CategoryGrid() {
  const categories = await getCategories();

  const displayCategories = categories.length > 0
    ? categories.slice(0, 10)
    : fallbackCategories;

  return (
    <section>
      <h2 className="text-[24px] sm:text-[32px] font-semibold tracking-tight mb-4">
        Shop by Category
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {displayCategories.map((cat) => {
          const Icon = getCategoryIcon(cat.icon);
          return (
            <Link key={cat.id} href={`/categories/${cat.slug}`}>
              <Card hoverable variant="compact" className="text-center cursor-pointer">
                <div className="w-12 h-12 rounded-circle bg-surface-subtle mx-auto mb-2 flex items-center justify-center">
                  <Icon size={22} className="text-mizo-teal" />
                </div>
                <p className="text-[14px] font-medium text-text-primary">
                  {cat.name}
                </p>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

const fallbackCategories = [
  { id: "1", name: "Electronics", slug: "electronics", icon: "smartphone", parent_id: null, sort_order: 0, created_at: "" },
  { id: "2", name: "Fashion", slug: "fashion", icon: "shirt", parent_id: null, sort_order: 1, created_at: "" },
  { id: "3", name: "Home & Garden", slug: "home-garden", icon: "home", parent_id: null, sort_order: 2, created_at: "" },
  { id: "4", name: "Beauty", slug: "beauty", icon: "sparkles", parent_id: null, sort_order: 3, created_at: "" },
  { id: "5", name: "Sports", slug: "sports", icon: "dumbbell", parent_id: null, sort_order: 4, created_at: "" },
  { id: "6", name: "Books", slug: "books", icon: "book-open", parent_id: null, sort_order: 5, created_at: "" },
  { id: "7", name: "Automotive", slug: "automotive", icon: "car", parent_id: null, sort_order: 6, created_at: "" },
  { id: "8", name: "Baby & Kids", slug: "baby-kids", icon: "baby", parent_id: null, sort_order: 7, created_at: "" },
  { id: "9", name: "Gaming", slug: "gaming", icon: "gamepad", parent_id: null, sort_order: 8, created_at: "" },
  { id: "10", name: "Food", slug: "food", icon: "utensils", parent_id: null, sort_order: 9, created_at: "" },
];
