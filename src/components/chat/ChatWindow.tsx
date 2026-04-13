"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { Avatar } from "@/components/ui/Avatar";
import { sendMessage, markMessagesRead } from "@/lib/actions/chat";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Package } from "lucide-react";
import type { MessageWithSender } from "@/lib/queries/conversations";
import type { Database } from "@/types/database";

interface ChatWindowProps {
  conversationId: string;
  currentUserId: string;
  otherName: string;
  otherAvatar: string | null;
  productTitle?: string | null;
  productThumbnail?: string | null;
  initialMessages: MessageWithSender[];
  onBack?: () => void;
}

type MessageRow = Database["public"]["Tables"]["messages"]["Row"];

export function ChatWindow({
  conversationId,
  currentUserId,
  otherName,
  otherAvatar,
  productTitle,
  initialMessages,
  onBack,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<MessageWithSender[]>(initialMessages);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Mark messages as read on mount / conversation change
  useEffect(() => {
    markMessagesRead(conversationId);
  }, [conversationId]);

  // Subscribe to realtime messages
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMsg = payload.new as MessageRow;
          // Don't add duplicates
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [
              ...prev,
              {
                ...newMsg,
                sender: null, // Realtime doesn't join, but we know it's the other user
              },
            ];
          });

          // Mark as read if from other user
          if (newMsg.sender_id !== currentUserId) {
            markMessagesRead(conversationId);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, currentUserId]);

  async function handleSend(body: string) {
    setSending(true);

    // Optimistic update
    const optimisticMsg: MessageWithSender = {
      id: `temp-${Date.now()}`,
      conversation_id: conversationId,
      sender_id: currentUserId,
      body,
      image_url: null,
      is_read: false,
      created_at: new Date().toISOString(),
      sender: null,
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    const result = await sendMessage({ conversationId, body });
    setSending(false);

    if (result.error) {
      // Remove optimistic message on failure
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id));
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border-default bg-surface-raised shrink-0">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="lg:hidden p-1.5 -ml-1.5 text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Back to conversations"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <Avatar src={otherAvatar} alt={otherName} size="sm" />
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-text-primary truncate">
            {otherName}
          </p>
          {productTitle && (
            <p className="text-[11px] text-mizo-teal truncate flex items-center gap-1">
              <Package size={11} />
              {productTitle}
            </p>
          )}
        </div>
      </div>

      {/* Messages */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
      >
        {messages.length === 0 && (
          <div className="flex-1 flex items-center justify-center h-full">
            <p className="text-[14px] text-text-muted text-center">
              No messages yet. Start the conversation!
            </p>
          </div>
        )}
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            isOwn={msg.sender_id === currentUserId}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <ChatInput onSend={handleSend} disabled={sending} />
    </div>
  );
}
