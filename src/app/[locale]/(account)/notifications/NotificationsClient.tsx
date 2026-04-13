"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { markAsRead, markAllAsRead } from "@/lib/actions/notification";
import { timeAgo } from "@/lib/utils/formatDate";
import { Bell, Check, CheckCheck, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { Database } from "@/types/database";

type NotificationRow = Database["public"]["Tables"]["notifications"]["Row"];

interface NotificationsClientProps {
  initialNotifications: NotificationRow[];
  total: number;
}

const typeIcons: Record<string, string> = {
  new_message: "💬",
  new_review: "⭐",
  order_confirmed: "✅",
  order_shipped: "📦",
  order_delivered: "🎉",
  low_stock: "⚠️",
};

export function NotificationsClient({
  initialNotifications,
  total,
}: NotificationsClientProps) {
  const [notifications, setNotifications] =
    useState<NotificationRow[]>(initialNotifications);

  const hasUnread = notifications.some((n) => !n.is_read);

  async function handleMarkRead(id: string) {
    await markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  }

  async function handleMarkAllRead() {
    await markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  }

  if (notifications.length === 0) {
    return (
      <Card className="text-center py-12">
        <Bell size={40} className="text-text-muted mx-auto mb-3" />
        <p className="text-[16px] text-text-secondary">No notifications yet</p>
        <p className="text-[13px] text-text-muted mt-1">
          You&apos;ll see order updates, messages, and more here
        </p>
      </Card>
    );
  }

  return (
    <div>
      {hasUnread && (
        <div className="flex justify-end mb-4">
          <Button variant="secondary" size="sm" onClick={handleMarkAllRead}>
            <CheckCheck size={14} />
            Mark all as read
          </Button>
        </div>
      )}

      <Card variant="compact" className="divide-y divide-border-subtle p-0">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`
              flex items-start gap-3 px-4 py-3.5 transition-colors
              ${!n.is_read ? "bg-mizo-teal/5" : ""}
            `}
          >
            <span className="text-[18px] mt-0.5 shrink-0">
              {typeIcons[n.type] || "🔔"}
            </span>
            <div className="flex-1 min-w-0">
              <p
                className={`text-[14px] ${
                  !n.is_read
                    ? "font-semibold text-text-primary"
                    : "font-medium text-text-secondary"
                }`}
              >
                {n.title}
              </p>
              {n.body && (
                <p className="text-[13px] text-text-secondary mt-0.5">
                  {n.body}
                </p>
              )}
              <p className="text-[11px] text-text-muted mt-1">
                {timeAgo(n.created_at)}
              </p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 mt-1">
              {n.link && (
                <Link
                  href={n.link}
                  onClick={() => {
                    if (!n.is_read) handleMarkRead(n.id);
                  }}
                  className="p-1.5 text-text-muted hover:text-mizo-teal transition-colors rounded-comfortable hover:bg-surface-subtle"
                  aria-label="View"
                >
                  <ExternalLink size={15} />
                </Link>
              )}
              {!n.is_read && (
                <button
                  type="button"
                  onClick={() => handleMarkRead(n.id)}
                  className="p-1.5 text-text-muted hover:text-mizo-teal transition-colors rounded-comfortable hover:bg-surface-subtle"
                  aria-label="Mark as read"
                >
                  <Check size={15} />
                </button>
              )}
            </div>
          </div>
        ))}
      </Card>

      {total > notifications.length && (
        <p className="text-[13px] text-text-muted text-center mt-4">
          Showing {notifications.length} of {total} notifications
        </p>
      )}
    </div>
  );
}
