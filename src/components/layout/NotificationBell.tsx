"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Check, CheckCheck, ExternalLink } from "lucide-react";
import { useNotificationStore } from "@/stores/notificationStore";
import { markAsRead, markAllAsRead } from "@/lib/actions/notification";
import { createClient } from "@/lib/supabase/client";
import { timeAgo } from "@/lib/utils/formatDate";
import Link from "next/link";
import type { Database } from "@/types/database";

type NotificationRow = Database["public"]["Tables"]["notifications"]["Row"];

interface NotificationBellProps {
  initialCount: number;
  initialNotifications: NotificationRow[];
  userId: string;
}

export function NotificationBell({
  initialCount,
  initialNotifications,
  userId,
}: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] =
    useState<NotificationRow[]>(initialNotifications);
  const { unreadCount, setUnreadCount, decrementUnread, clearUnread } =
    useNotificationStore();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize count from server
  useEffect(() => {
    setUnreadCount(initialCount);
  }, [initialCount, setUnreadCount]);

  // Subscribe to realtime notifications
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newNotification = payload.new as NotificationRow;
          setNotifications((prev) => [newNotification, ...prev].slice(0, 10));
          setUnreadCount(unreadCount + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, unreadCount, setUnreadCount]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [open]);

  async function handleMarkRead(id: string) {
    await markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    decrementUnread();
  }

  async function handleMarkAllRead() {
    await markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    clearUnread();
  }

  const typeIcons: Record<string, string> = {
    new_message: "💬",
    new_review: "⭐",
    order_confirmed: "✅",
    order_shipped: "📦",
    order_delivered: "🎉",
    low_stock: "⚠️",
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative p-2 text-text-secondary hover:text-text-primary transition-colors"
        aria-label="Notifications"
      >
        <Bell size={22} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-mizo-red rounded-full font-tabular">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-surface-overlay border border-border-default rounded-large shadow-floating z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
            <h3 className="text-[14px] font-semibold text-text-primary">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-[12px] text-mizo-teal hover:underline flex items-center gap-1"
              >
                <CheckCheck size={14} />
                Mark all read
              </button>
            )}
          </div>

          {/* Notification list */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-10 text-center">
                <Bell size={32} className="text-text-muted mx-auto mb-2" />
                <p className="text-[14px] text-text-muted">
                  No notifications yet
                </p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`
                    flex items-start gap-3 px-4 py-3 border-b border-border-subtle last:border-0
                    transition-colors hover:bg-surface-subtle
                    ${!n.is_read ? "bg-mizo-teal/5" : ""}
                  `}
                >
                  <span className="text-[16px] mt-0.5 shrink-0">
                    {typeIcons[n.type] || "🔔"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-text-primary truncate">
                      {n.title}
                    </p>
                    {n.body && (
                      <p className="text-[12px] text-text-secondary mt-0.5 line-clamp-2">
                        {n.body}
                      </p>
                    )}
                    <p className="text-[11px] text-text-muted mt-1">
                      {timeAgo(n.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 mt-0.5">
                    {n.link && (
                      <Link
                        href={n.link}
                        onClick={() => {
                          if (!n.is_read) handleMarkRead(n.id);
                          setOpen(false);
                        }}
                        className="p-1 text-text-muted hover:text-mizo-teal transition-colors"
                        aria-label="Go to notification"
                      >
                        <ExternalLink size={14} />
                      </Link>
                    )}
                    {!n.is_read && (
                      <button
                        type="button"
                        onClick={() => handleMarkRead(n.id)}
                        className="p-1 text-text-muted hover:text-mizo-teal transition-colors"
                        aria-label="Mark as read"
                      >
                        <Check size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <Link
            href="/notifications"
            onClick={() => setOpen(false)}
            className="block text-center text-[13px] text-mizo-teal hover:underline py-3 border-t border-border-subtle"
          >
            View all notifications
          </Link>
        </div>
      )}
    </div>
  );
}
