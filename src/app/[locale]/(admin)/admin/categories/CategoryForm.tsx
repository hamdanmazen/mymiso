"use client";

import { useTransition, useRef } from "react";
import { createCategory } from "@/lib/actions/admin";

export function CategoryForm({
  parentCategories,
}: {
  parentCategories: { id: string; name: string }[];
}) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(formData: FormData) {
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const icon = formData.get("icon") as string;
    const parentId = formData.get("parent_id") as string;
    const sortOrder = Number(formData.get("sort_order")) || 0;

    if (!name || !slug) return;

    startTransition(async () => {
      await createCategory({
        name,
        slug,
        icon: icon || undefined,
        parent_id: parentId || null,
        sort_order: sortOrder,
      });
      formRef.current?.reset();
    });
  }

  return (
    <form ref={formRef} action={handleSubmit} className="flex flex-wrap items-end gap-3">
      <div className="flex-1 min-w-[150px]">
        <label className="block text-[13px] text-text-secondary mb-1">Name</label>
        <input
          type="text"
          name="name"
          required
          placeholder="Electronics"
          className="w-full px-3 py-2 text-[14px] bg-surface-input border border-border-default rounded-standard focus:outline-none focus:border-border-focus"
        />
      </div>
      <div className="flex-1 min-w-[150px]">
        <label className="block text-[13px] text-text-secondary mb-1">Slug</label>
        <input
          type="text"
          name="slug"
          required
          placeholder="electronics"
          className="w-full px-3 py-2 text-[14px] bg-surface-input border border-border-default rounded-standard focus:outline-none focus:border-border-focus"
        />
      </div>
      <div className="w-[100px]">
        <label className="block text-[13px] text-text-secondary mb-1">Icon</label>
        <input
          type="text"
          name="icon"
          placeholder="laptop"
          className="w-full px-3 py-2 text-[14px] bg-surface-input border border-border-default rounded-standard focus:outline-none focus:border-border-focus"
        />
      </div>
      <div className="w-[160px]">
        <label className="block text-[13px] text-text-secondary mb-1">Parent</label>
        <select
          name="parent_id"
          className="w-full px-3 py-2 text-[14px] bg-surface-input border border-border-default rounded-standard"
        >
          <option value="">None (top-level)</option>
          {parentCategories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div className="w-[80px]">
        <label className="block text-[13px] text-text-secondary mb-1">Order</label>
        <input
          type="number"
          name="sort_order"
          defaultValue={0}
          className="w-full px-3 py-2 text-[14px] bg-surface-input border border-border-default rounded-standard focus:outline-none focus:border-border-focus"
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="px-4 py-2 text-[14px] font-medium bg-mizo-red text-white rounded-standard hover:bg-mizo-red-hover transition-colors disabled:opacity-50"
      >
        {isPending ? "Adding..." : "Add"}
      </button>
    </form>
  );
}
