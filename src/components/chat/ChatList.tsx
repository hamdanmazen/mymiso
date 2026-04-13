"use client";

import { Avatar } from "@/components/ui/Avatar";
import { timeAgo } from "@/lib/utils/formatDate";
import type { ConversationWithDetails } from "@/lib/queries/conversations";

interface ChatListProps {
  conversations: ConversationWithDetails[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

export function ChatList({ conversations, activeId, onSelect }: ChatListProps) {
  if (conversations.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <p className="text-[14px] text-text-muted text-center">
          No conversations yet
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.map((conv) => (
        <button
          key={conv.id}
          type="button"
          onClick={() => onSelect(conv.id)}
          className={`
            w-full flex items-start gap-3 px-4 py-3 text-left
            border-b border-border-subtle transition-colors
            hover:bg-surface-subtle
            ${activeId === conv.id ? "bg-surface-subtle" : ""}
          `}
        >
          <Avatar
            src={conv.other_avatar}
            alt={conv.other_name}
            size="md"
            className="shrink-0 mt-0.5"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[14px] font-medium text-text-primary truncate">
                {conv.other_name}
              </span>
              <span className="text-[11px] text-text-muted shrink-0">
                {timeAgo(conv.last_message_at)}
              </span>
            </div>

            {conv.product_title && (
              <p className="text-[11px] text-mizo-teal truncate mt-0.5">
                Re: {conv.product_title}
              </p>
            )}

            <div className="flex items-center justify-between gap-2 mt-0.5">
              <p className="text-[13px] text-text-secondary truncate">
                {conv.last_message_body || "No messages yet"}
              </p>
              {conv.unread_count > 0 && (
                <span className="shrink-0 flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-bold text-white bg-mizo-red rounded-full font-tabular">
                  {conv.unread_count > 99 ? "99+" : conv.unread_count}
                </span>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
