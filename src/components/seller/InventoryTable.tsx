"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { updateStock, bulkUpdateStock } from "@/lib/actions/seller";
import { formatPrice } from "@/lib/utils/formatPrice";
import type { InventoryItem } from "@/lib/queries/seller-dashboard";
import { Save, RotateCcw } from "lucide-react";

interface InventoryTableProps {
  items: InventoryItem[];
}

export function InventoryTable({ items }: InventoryTableProps) {
  const router = useRouter();
  const [edits, setEdits] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const hasChanges = Object.keys(edits).length > 0;

  function handleStockChange(id: string, original: number, value: string) {
    const num = parseInt(value) || 0;
    if (num === original) {
      setEdits((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    } else {
      setEdits((prev) => ({ ...prev, [id]: num }));
    }
  }

  function resetEdits() {
    setEdits({});
    setError("");
  }

  async function saveAll() {
    setSaving(true);
    setError("");

    const updates = Object.entries(edits).map(([productId, quantity]) => ({
      productId,
      quantity,
    }));

    const result = await bulkUpdateStock(updates);
    if (result.error) {
      setError(result.error);
    } else {
      setEdits({});
      router.refresh();
    }
    setSaving(false);
  }

  function getStockStatus(item: InventoryItem): {
    variant: "success" | "warning" | "error";
    label: string;
  } {
    const qty = edits[item.id] ?? item.stock_quantity;
    if (qty === 0) return { variant: "error", label: "Out of stock" };
    if (qty <= item.low_stock_threshold)
      return { variant: "warning", label: "Low stock" };
    return { variant: "success", label: "In stock" };
  }

  return (
    <div>
      {/* Bulk actions bar */}
      {hasChanges && (
        <div className="flex items-center justify-between p-3 mb-4 rounded-comfortable bg-mizo-teal-subtle border border-mizo-teal/20">
          <span className="text-[13px] font-medium text-mizo-teal">
            {Object.keys(edits).length} product{Object.keys(edits).length > 1 ? "s" : ""} modified
          </span>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={resetEdits}>
              <RotateCcw size={14} /> Reset
            </Button>
            <Button size="sm" onClick={saveAll} isLoading={saving}>
              <Save size={14} /> Save All
            </Button>
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 mb-4 rounded-comfortable bg-error-subtle text-error text-[13px]">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-subtle bg-surface-subtle">
              <th className="text-left text-[12px] font-semibold text-text-muted uppercase tracking-wider px-4 py-3">
                Product
              </th>
              <th className="text-left text-[12px] font-semibold text-text-muted uppercase tracking-wider px-4 py-3 hidden sm:table-cell">
                SKU
              </th>
              <th className="text-left text-[12px] font-semibold text-text-muted uppercase tracking-wider px-4 py-3">
                Status
              </th>
              <th className="text-center text-[12px] font-semibold text-text-muted uppercase tracking-wider px-4 py-3">
                Stock
              </th>
              <th className="text-right text-[12px] font-semibold text-text-muted uppercase tracking-wider px-4 py-3 hidden md:table-cell">
                Price
              </th>
              <th className="text-right text-[12px] font-semibold text-text-muted uppercase tracking-wider px-4 py-3 hidden lg:table-cell">
                Sold
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const status = getStockStatus(item);
              const currentQty = edits[item.id] ?? item.stock_quantity;
              const isEdited = item.id in edits;

              return (
                <tr
                  key={item.id}
                  className={`border-b border-border-subtle last:border-0 transition-colors ${
                    isEdited ? "bg-mizo-teal-subtle/30" : "hover:bg-surface-subtle/50"
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {item.thumbnail_url && (
                        <div className="w-8 h-8 rounded bg-surface-subtle overflow-hidden shrink-0">
                          <img
                            src={item.thumbnail_url}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <span className="text-[14px] font-medium truncate max-w-[200px]">
                        {item.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="text-[13px] text-text-muted font-mono">
                      {item.sku ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center">
                      <input
                        type="number"
                        min="0"
                        value={currentQty}
                        onChange={(e) =>
                          handleStockChange(
                            item.id,
                            item.stock_quantity,
                            e.target.value
                          )
                        }
                        className={`w-20 text-center bg-surface-input border rounded-comfortable px-2 py-1.5 text-[14px] font-tabular focus-ring ${
                          isEdited
                            ? "border-mizo-teal"
                            : "border-border-default"
                        }`}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right hidden md:table-cell">
                    <span className="text-[14px] font-tabular">
                      {formatPrice(item.price)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right hidden lg:table-cell">
                    <span className="text-[14px] text-text-secondary font-tabular">
                      {item.total_sold}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
