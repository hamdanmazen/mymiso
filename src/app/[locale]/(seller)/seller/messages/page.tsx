import { Card } from "@/components/ui/Card";
import { MessagesClient } from "@/components/chat/MessagesClient";
import { getConversations } from "@/lib/queries/conversations";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { MessageSquare } from "lucide-react";
import { redirect } from "next/navigation";

interface Props {
  searchParams: Promise<{ conversation?: string }>;
}

export default async function SellerMessagesPage({ searchParams }: Props) {
  const params = await searchParams;

  if (!isSupabaseConfigured()) {
    return (
      <div>
        <h1 className="text-[24px] font-semibold tracking-tight mb-6">Messages</h1>
        <Card className="text-center py-12">
          <MessageSquare size={40} className="text-text-muted mx-auto mb-3" />
          <p className="text-[16px] text-text-secondary">Customer Messages</p>
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

  const conversations = await getConversations("seller");

  return (
    <div>
      <h1 className="text-[24px] font-semibold tracking-tight mb-6">
        Customer Messages
      </h1>
      <MessagesClient
        conversations={conversations}
        currentUserId={user.id}
        initialConversationId={params.conversation}
      />
    </div>
  );
}
