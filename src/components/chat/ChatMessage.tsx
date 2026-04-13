"use client";

import { Avatar } from "@/components/ui/Avatar";
import type { MessageWithSender } from "@/lib/queries/conversations";

interface ChatMessageProps {
  message: MessageWithSender;
  isOwn: boolean;
}

export function ChatMessage({ message, isOwn }: ChatMessageProps) {
  const time = new Date(message.created_at).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`flex gap-2 ${isOwn ? "flex-row-reverse" : ""}`}
    >
      {!isOwn && (
        <Avatar
          src={message.sender?.avatar_url}
          alt={message.sender?.full_name || "User"}
          size="sm"
          className="shrink-0 mt-1"
        />
      )}

      <div
        className={`max-w-[70%] ${isOwn ? "items-end" : "items-start"}`}
      >
        <div
          className={`
            px-3.5 py-2.5 rounded-large text-[14px] leading-relaxed
            ${
              isOwn
                ? "bg-mizo-teal text-white rounded-br-compact"
                : "bg-surface-overlay text-text-primary rounded-bl-compact"
            }
          `}
        >
          {message.body}
        </div>

        {message.image_url && (
          <div className="mt-1.5 rounded-comfortable overflow-hidden max-w-[240px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={message.image_url}
              alt="Shared image"
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        <p
          className={`text-[11px] text-text-muted mt-1 ${
            isOwn ? "text-right" : "text-left"
          }`}
        >
          {time}
          {isOwn && message.is_read && (
            <span className="ml-1 text-mizo-teal">read</span>
          )}
        </p>
      </div>
    </div>
  );
}
