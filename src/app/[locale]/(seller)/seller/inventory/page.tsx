import { Card } from "@/components/ui/Card";
import { getSellerInventory } from "@/lib/queries/seller-dashboard";
import { InventoryTable } from "@/components/seller/InventoryTable";
import { Pagination } from "@/components/ui/Pagination";
import { Warehouse } from "lucide-react";
import Link from "next/link";

interface InventoryPageProps {
  searchParams: Promise<{ page?: string; filter?: string }>;
}

const FILTER_TABS = [
  { value: "all", label: "All Products" },
  { value: "low", label: "Low Stock" },
  { value: "out", label: "Out of Stock" },
];

export default async function SellerInventoryPage({
  searchParams,
}: InventoryPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page ?? "1", 10);
  const filter = (params.filter as "all" | "low" | "out") ?? "all";

  const inventory = await getSellerInventory(page, 20, filter);

  return (
    <div>
      <h1 className="text-[24px] font-semibold tracking-tight mb-6">
        Inventory
      </h1>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-6">
        {FILTER_TABS.map((tab) => (
          <Link
            key={tab.value}
            href={`/seller/inventory?filter=${tab.value}`}
            className={`
              px-3 py-1.5 rounded-pill text-[13px] font-medium whitespace-nowrap transition-colors
              ${
                filter === tab.value
                  ? "bg-mizo-red text-white"
                  : "bg-surface-subtle text-text-secondary hover:text-text-primary"
              }
            `}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {inventory.data.length > 0 ? (
        <>
          <Card className="overflow-hidden p-0">
            <InventoryTable items={inventory.data} />
          </Card>

          {inventory.totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={inventory.totalPages}
              className="mt-6"
            />
          )}
        </>
      ) : (
        <Card className="text-center py-12">
          <Warehouse size={40} className="text-text-muted mx-auto mb-3" />
          <p className="text-[16px] text-text-secondary">
            {filter !== "all"
              ? `No ${filter === "low" ? "low stock" : "out of stock"} products`
              : "No products in inventory"}
          </p>
          <p className="text-[13px] text-text-muted mt-1">
            {filter !== "all"
              ? "All your products are well-stocked"
              : "Add products to start tracking inventory"}
          </p>
        </Card>
      )}
    </div>
  );
}
