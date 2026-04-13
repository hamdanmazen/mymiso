"use client";

import { useState, useEffect } from "react";
import { ChatList } from "./ChatList";
import { ChatWindow } from "./ChatWindow";
import { MessageSquare } from "lucide-react";
import { fetchConversationMessages } from "@/lib/actions/chat";
import type {
  ConversationWithDetails,
  MessageWithSender,
} from "@/lib/queries/conversations";

interface MessagesClientProps {
  conversations: ConversationWithDetails[];
  currentUserId: string;
  initialConversationId?: string | null;
}

export function MessagesClient({
  conversations,
  currentUserId,
  initialConversationId,
}: MessagesClientProps) {
  const [activeId, setActiveId] = useState<string | null>(
    initialConversationId || null
  );
  const [activeMessages, setActiveMessages] = useState<MessageWithSender[]>([]);
  const [loading, setLoading] = useState(false);

  const activeConversation = conversations.find((c) => c.id === activeId);

  useEffect(() => {
    if (!activeId) return;

    let cancelled = false;
    setLoading(true);

    fetchConversationMessages(activeId).then((result) => {
      if (cancelled) return;
      setActiveMessages(result.messages);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [activeId]);

  return (
    <div className="flex h-[calc(100dvh-12rem)] lg:h-[calc(100dvh-10rem)] bg-surface-raised border border-border-default rounded-spacious overflow-hidden">
      {/* Conversation List — hidden on mobile when a chat is active */}
      <div
        className={`
          w-full lg:w-80 lg:border-r lg:border-border-default flex flex-col shrink-0
          ${activeId ? "hidden lg:flex" : "flex"}
        `}
      >
        <div className="px-4 py-3 border-b border-border-default">
          <h2 className="text-[14px] font-semibold text-text-primary">
            Conversations
          </h2>
        </div>
        <ChatList
          conversations={conversations}
          activeId={activeId}
          onSelect={setActiveId}
        />
      </div>

      {/* Chat Window — hidden on mobile when no chat is active */}
      <div
        className={`
          flex-1 flex flex-col min-w-0
          ${!activeId ? "hidden lg:flex" : "flex"}
        `}
      >
        {activeConversation ? (
          loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="h-6 w-6 border-2 border-mizo-teal border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <ChatWindow
              conversationId={activeConversation.id}
              currentUserId={currentUserId}
              otherName={activeConversation.other_name}
              otherAvatar={activeConversation.other_avatar}
              productTitle={activeConversation.product_title}
              productThumbnail={activeConversation.product_thumbnail}
              initialMessages={activeMessages}
              onBack={() => setActiveId(null)}
            />
          )
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8">
            <MessageSquare size={48} className="text-text-muted" />
            <p className="text-[16px] text-text-secondary text-center">
              Select a conversation to start chatting
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
