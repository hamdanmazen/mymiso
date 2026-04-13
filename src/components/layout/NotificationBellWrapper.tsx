import { NotificationBell } from "./NotificationBell";
import {
  getUserNotifications,
  getUnreadCount,
} from "@/lib/queries/notifications";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function NotificationBellWrapper() {
  if (!isSupabaseConfigured()) return null;

  const supabase = (await createClient())!;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const [unreadCount, { data: notifications }] = await Promise.all([
    getUnreadCount(),
    getUserNotifications(1, 10),
  ]);

  return (
    <NotificationBell
      initialCount={unreadCount}
      initialNotifications={notifications}
      userId={user.id}
    />
  );
}
