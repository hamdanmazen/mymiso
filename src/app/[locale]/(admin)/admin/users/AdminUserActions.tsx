"use client";

import { useState, useTransition } from "react";
import { updateUserRole } from "@/lib/actions/admin";

export function AdminUserActions({
  userId,
  currentRole,
}: {
  userId: string;
  currentRole: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [role, setRole] = useState(currentRole);

  function handleChange(newRole: string) {
    setRole(newRole);
    startTransition(async () => {
      await updateUserRole(userId, newRole);
    });
  }

  return (
    <select
      value={role}
      onChange={(e) => handleChange(e.target.value)}
      disabled={isPending}
      className="px-2 py-1 text-[13px] bg-surface-input border border-border-default rounded-standard disabled:opacity-50"
    >
      <option value="buyer">Buyer</option>
      <option value="seller">Seller</option>
      <option value="both">Both</option>
      <option value="admin">Admin</option>
    </select>
  );
}
