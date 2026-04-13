"use client";

import { useState, useTransition } from "react";
import { adminUpdateOrderStatus } from "@/lib/actions/admin";

export function AdminOrderActions({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState(currentStatus);

  function handleChange(newStatus: string) {
    setStatus(newStatus);
    startTransition(async () => {
      await adminUpdateOrderStatus(orderId, newStatus);
    });
  }

  return (
    <select
      value={status}
      onChange={(e) => handleChange(e.target.value)}
      disabled={isPending}
      className="px-2 py-1 text-[13px] bg-surface-input border border-border-default rounded-standard disabled:opacity-50"
    >
      <option value="pending">Pending</option>
      <option value="confirmed">Confirmed</option>
      <option value="processing">Processing</option>
      <option value="shipped">Shipped</option>
      <option value="delivered">Delivered</option>
      <option value="cancelled">Cancelled</option>
      <option value="refunded">Refunded</option>
    </select>
  );
}
