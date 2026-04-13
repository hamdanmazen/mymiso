import { Card } from "@/components/ui/Card";
import { MessagesClient } from "@/components/chat/MessagesClient";
import { getConversations } from "@/lib/queries/conversations";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { MessageSquare } from "lucide-react";
import { redirect } from "next/navigation";

interface Props {
  searchParams: Promise<{ conversation?: string; seller?: string; product?: string }>;
}

export default async function MessagesPage({ searchParams }: Props) {
  const params = await searchParams;

  if (!isSupabaseConfigured()) {
    return (
      <div>
        <h1 className="text-[24px] font-semibold tracking-tight mb-6">Messages</h1>
        <Card className="text-center py-12">
          <MessageSquare size={40} className="text-text-muted mx-auto mb-3" />
          <p className="text-[16px] text-text-secondary">Chat with sellers about products</p>
          <p className="text-[13px] text-text-muted mt-1">Configure Supabase to enable messaging</p>
        </Card>
      </div>
    );
  }

  const supabase = (await createClient())!;
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // If seller param is provided, create/find conversation and redirect
  if (params.seller) {
    const { getOrCreateConversation } = await import("@/lib/actions/chat");
    const result = await getOrCreateConversation({
      sellerId: params.seller,
      productId: params.product,
    });
    if (result.conversationId) {
      redirect(`/messages?conversation=${result.conversationId}`);
    }
  }

  const conversations = await getConversations("buyer");

  return (
    <div>
      <h1 className="text-[24px] font-semibold tracking-tight mb-6">Messages</h1>
      <MessagesClient
        conversations={conversations}
        currentUserId={user.id}
        initialConversationId={params.conversation}
      />
    </div>
  );
}
