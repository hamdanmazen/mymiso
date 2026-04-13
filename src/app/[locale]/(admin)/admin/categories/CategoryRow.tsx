"use client";

import { useState, useTransition } from "react";
import { updateCategory, deleteCategory } from "@/lib/actions/admin";
import { Pencil, Trash2, Check, X, ChevronRight } from "lucide-react";
import type { Database } from "@/types/database";

type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];

export function CategoryRow({
  category,
  parentCategories,
  isChild,
}: {
  category: CategoryRow;
  parentCategories: { id: string; name: string }[];
  isChild?: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(category.name);
  const [slug, setSlug] = useState(category.slug);
  const [icon, setIcon] = useState(category.icon ?? "");
  const [sortOrder, setSortOrder] = useState(category.sort_order ?? 0);

  function handleSave() {
    startTransition(async () => {
      await updateCategory(category.id, { name, slug, icon: icon || undefined, sort_order: sortOrder });
      setEditing(false);
    });
  }

  function handleDelete() {
    if (!confirm(`Delete category "${category.name}"?`)) return;
    startTransition(async () => {
      await deleteCategory(category.id);
    });
  }

  if (editing) {
    return (
      <div className="flex items-center gap-2 py-2 px-3 bg-surface-subtle rounded-standard">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 px-2 py-1 text-[14px] bg-surface-input border border-border-default rounded-standard"
          placeholder="Name"
        />
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-[120px] px-2 py-1 text-[14px] bg-surface-input border border-border-default rounded-standard"
          placeholder="Slug"
        />
        <input
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
          className="w-[80px] px-2 py-1 text-[14px] bg-surface-input border border-border-default rounded-standard"
          placeholder="Icon"
        />
        <input
          type="number"
          value={sortOrder}
          onChange={(e) => setSortOrder(Number(e.target.value))}
          className="w-[60px] px-2 py-1 text-[14px] bg-surface-input border border-border-default rounded-standard"
        />
        <button
          onClick={handleSave}
          disabled={isPending}
          className="p-1.5 text-success hover:bg-success-subtle rounded-standard disabled:opacity-50"
        >
          <Check size={16} />
        </button>
        <button
          onClick={() => setEditing(false)}
          className="p-1.5 text-text-muted hover:bg-surface-subtle rounded-standard"
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 py-2.5 px-3 hover:bg-surface-subtle rounded-standard transition-colors group">
      {isChild && <ChevronRight size={14} className="text-text-muted" />}
      <span className="text-[14px] font-medium flex-1">{category.name}</span>
      <span className="text-[12px] text-text-muted">/{category.slug}</span>
      {category.icon && (
        <span className="text-[12px] text-text-muted">{category.icon}</span>
      )}
      <span className="text-[12px] text-text-muted font-tabular w-8 text-center">
        #{category.sort_order}
      </span>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setEditing(true)}
          className="p-1.5 text-text-muted hover:text-text-primary hover:bg-surface-subtle rounded-standard"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="p-1.5 text-text-muted hover:text-error hover:bg-error-subtle rounded-standard disabled:opacity-50"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
