import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type ConversationRow = Database["public"]["Tables"]["conversations"]["Row"];
type MessageRow = Database["public"]["Tables"]["messages"]["Row"];

export type ConversationWithDetails = ConversationRow & {
  other_name: string;
  other_avatar: string | null;
  product_title: string | null;
  product_thumbnail: string | null;
  last_message_body: string | null;
  unread_count: number;
};

export type MessageWithSender = MessageRow & {
  sender: { full_name: string | null; avatar_url: string | null } | null;
};

export async function getConversations(
  role: "buyer" | "seller"
): Promise<ConversationWithDetails[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = (await createClient())!;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  // Get conversations based on role — split queries to avoid type inference issues with joins
  let sellerId: string | null = null;
  if (role === "seller") {
    const { data: seller } = await supabase
      .from("sellers")
      .select("id")
      .eq("user_id", user.id)
      .single();
    if (!seller) return [];
    sellerId = seller.id;
  }

  const baseQuery = supabase
    .from("conversations")
    .select("*")
    .order("last_message_at", { ascending: false });

  const { data: conversations, error } = role === "buyer"
    ? await baseQuery.eq("buyer_id", user.id)
    : await baseQuery.eq("seller_id", sellerId!);

  if (error || !conversations) return [];

  // Enrich with other participant details
  const enriched: ConversationWithDetails[] = [];

  for (const conv of conversations) {
    // Fetch product info if linked
    let product: { title: string; thumbnail_url: string | null } | null = null;
    if (conv.product_id) {
      const { data: p } = await supabase
        .from("products")
        .select("title, thumbnail_url")
        .eq("id", conv.product_id)
        .single();
      product = p;
    }

    // Fetch messages for this conversation
    const { data: msgs } = await supabase
      .from("messages")
      .select("body, is_read, sender_id, created_at")
      .eq("conversation_id", conv.id)
      .order("created_at", { ascending: false })
      .limit(50);

    const messages = msgs || [];

    // Get latest message
    const sorted = [...messages].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    const lastMessage = sorted[0] || null;

    // Count unread messages not sent by current user
    const unreadCount = messages.filter(
      (m) => !m.is_read && m.sender_id !== user.id
    ).length;

    // Get the other participant's name
    let otherName = "Unknown";
    let otherAvatar: string | null = null;

    if (role === "buyer") {
      // Get seller's shop name
      const { data: seller } = await supabase
        .from("sellers")
        .select("shop_name, shop_logo_url")
        .eq("id", conv.seller_id!)
        .single();
      if (seller) {
        otherName = seller.shop_name;
        otherAvatar = seller.shop_logo_url;
      }
    } else {
      // Get buyer's profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", conv.buyer_id!)
        .single();
      if (profile) {
        otherName = profile.full_name || "Buyer";
        otherAvatar = profile.avatar_url;
      }
    }

    enriched.push({
      id: conv.id,
      buyer_id: conv.buyer_id,
      seller_id: conv.seller_id,
      product_id: conv.product_id,
      last_message_at: conv.last_message_at,
      created_at: conv.created_at,
      other_name: otherName,
      other_avatar: otherAvatar,
      product_title: product?.title || null,
      product_thumbnail: product?.thumbnail_url || null,
      last_message_body: lastMessage?.body || null,
      unread_count: unreadCount,
    });
  }

  return enriched;
}

export async function getConversationMessages(
  conversationId: string,
  page: number = 1,
  limit: number = 50
): Promise<{ messages: MessageWithSender[]; total: number }> {
  if (!isSupabaseConfigured()) return { messages: [], total: 0 };
  const supabase = (await createClient())!;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { messages: [], total: 0 };

  const offset = (page - 1) * limit;

  // Fetch messages
  const { data, count, error } = await supabase
    .from("messages")
    .select("*", { count: "exact" })
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("getConversationMessages error:", error);
    return { messages: [], total: 0 };
  }

  // Fetch sender profiles for all messages
  const senderIds = [...new Set((data || []).map((m) => m.sender_id).filter(Boolean))] as string[];
  const profilesMap = new Map<string, { full_name: string | null; avatar_url: string | null }>();
  if (senderIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url")
      .in("id", senderIds);
    for (const p of profiles || []) {
      profilesMap.set(p.id, { full_name: p.full_name, avatar_url: p.avatar_url });
    }
  }

  const messages: MessageWithSender[] = (data || []).map((m) => ({
    ...m,
    sender: m.sender_id ? profilesMap.get(m.sender_id) || null : null,
  }));

  return { messages, total: count || 0 };
}

export async function getConversationById(conversationId: string) {
  if (!isSupabaseConfigured()) return null;
  const supabase = (await createClient())!;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: conv } = await supabase
    .from("conversations")
    .select("*")
    .eq("id", conversationId)
    .single();

  if (!conv) return null;

  // Fetch product if linked
  let product: { title: string; thumbnail_url: string | null } | null = null;
  if (conv.product_id) {
    const { data: p } = await supabase
      .from("products")
      .select("title, thumbnail_url")
      .eq("id", conv.product_id)
      .single();
    product = p;
  }

  return { ...conv, product };
}

export async function getUnreadMessageCount(): Promise<number> {
  if (!isSupabaseConfigured()) return 0;
  const supabase = (await createClient())!;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return 0;

  // Get all conversations the user is part of (as buyer or seller)
  const { data: seller } = await supabase
    .from("sellers")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  let conversationIds: string[] = [];

  // Buyer conversations
  const { data: buyerConvs } = await supabase
    .from("conversations")
    .select("id")
    .eq("buyer_id", user.id);
  if (buyerConvs) {
    conversationIds.push(...buyerConvs.map((c) => c.id));
  }

  // Seller conversations
  if (seller) {
    const { data: sellerConvs } = await supabase
      .from("conversations")
      .select("id")
      .eq("seller_id", seller.id);
    if (sellerConvs) {
      conversationIds.push(...sellerConvs.map((c) => c.id));
    }
  }

  if (conversationIds.length === 0) return 0;

  const { count } = await supabase
    .from("messages")
    .select("id", { count: "exact", head: true })
    .in("conversation_id", conversationIds)
    .neq("sender_id", user.id)
    .eq("is_read", false);

  return count ?? 0;
}
