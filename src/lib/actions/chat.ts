"use server";

import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import {
  getConversationMessages,
  type MessageWithSender,
} from "@/lib/queries/conversations";

export async function getOrCreateConversation(params: {
  sellerId: string;
  productId?: string;
}) {
  if (!isSupabaseConfigured()) return { error: "Not configured" };
  const supabase = (await createClient())!;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Check for existing conversation between this buyer and seller
  const { data: existing } = await supabase
    .from("conversations")
    .select("id")
    .eq("buyer_id", user.id)
    .eq("seller_id", params.sellerId)
    .maybeSingle();

  if (existing) {
    return { conversationId: existing.id };
  }

  // Create new conversation
  const { data: newConv, error } = await supabase
    .from("conversations")
    .insert({
      buyer_id: user.id,
      seller_id: params.sellerId,
      product_id: params.productId ?? null,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  return { conversationId: newConv.id };
}

export async function sendMessage(params: {
  conversationId: string;
  body: string;
  imageUrl?: string;
}) {
  if (!isSupabaseConfigured()) return { error: "Not configured" };
  const supabase = (await createClient())!;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const body = params.body.trim();
  if (!body && !params.imageUrl) return { error: "Message cannot be empty" };
  if (body.length > 5000) return { error: "Message too long (max 5000 characters)" };

  // Verify user is a participant of this conversation
  const { data: conv } = await supabase
    .from("conversations")
    .select("id, buyer_id, seller_id")
    .eq("id", params.conversationId)
    .single();

  if (!conv) return { error: "Conversation not found" };

  // Check if user is the buyer or the seller's user
  const isBuyer = conv.buyer_id === user.id;
  let isSeller = false;
  if (!isBuyer) {
    const { data: seller } = await supabase
      .from("sellers")
      .select("id")
      .eq("id", conv.seller_id!)
      .eq("user_id", user.id)
      .maybeSingle();
    isSeller = !!seller;
  }

  if (!isBuyer && !isSeller) {
    return { error: "Not a participant of this conversation" };
  }

  // Insert message
  const { data: message, error: msgError } = await supabase
    .from("messages")
    .insert({
      conversation_id: params.conversationId,
      sender_id: user.id,
      body,
      image_url: params.imageUrl ?? null,
    })
    .select("id")
    .single();

  if (msgError) return { error: msgError.message };

  // Update conversation last_message_at
  await supabase
    .from("conversations")
    .update({ last_message_at: new Date().toISOString() })
    .eq("id", params.conversationId);

  // Create notification for the other participant
  const recipientId = isBuyer ? null : conv.buyer_id;
  const adminClient = createAdminClient();

  if (isBuyer && conv.seller_id) {
    // Notify seller — find the seller's user_id
    const { data: seller } = await adminClient
      .from("sellers")
      .select("user_id, shop_name")
      .eq("id", conv.seller_id)
      .single();

    if (seller) {
      await adminClient.from("notifications").insert({
        user_id: seller.user_id,
        type: "new_message",
        title: "New message from a buyer",
        body: body.slice(0, 100),
        link: `/seller/messages?conversation=${params.conversationId}`,
      });
    }
  } else if (isSeller && conv.buyer_id) {
    // Notify buyer
    const { data: sellerProfile } = await adminClient
      .from("sellers")
      .select("shop_name")
      .eq("id", conv.seller_id!)
      .single();

    await adminClient.from("notifications").insert({
      user_id: conv.buyer_id,
      type: "new_message",
      title: `New message from ${sellerProfile?.shop_name || "a seller"}`,
      body: body.slice(0, 100),
      link: `/messages?conversation=${params.conversationId}`,
    });
  }

  revalidatePath("/messages");
  revalidatePath("/seller/messages");
  return { success: true, messageId: message.id };
}

export async function markMessagesRead(conversationId: string) {
  if (!isSupabaseConfigured()) return { error: "Not configured" };
  const supabase = (await createClient())!;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Mark all messages in this conversation as read (except ones sent by current user)
  const { error } = await supabase
    .from("messages")
    .update({ is_read: true })
    .eq("conversation_id", conversationId)
    .neq("sender_id", user.id)
    .eq("is_read", false);

  if (error) return { error: error.message };

  revalidatePath("/messages");
  revalidatePath("/seller/messages");
  return { success: true };
}

// Server action wrapper so client components can fetch messages
export async function fetchConversationMessages(
  conversationId: string,
  page: number = 1,
  limit: number = 50
): Promise<{ messages: MessageWithSender[]; total: number }> {
  return getConversationMessages(conversationId, page, limit);
}
