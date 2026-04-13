import { NotificationsClient } from "./NotificationsClient";
import { getUserNotifications, getUnreadCount } from "@/lib/queries/notifications";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { Bell } from "lucide-react";
import { redirect } from "next/navigation";

export default async function NotificationsPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div>
        <h1 className="text-[24px] font-semibold tracking-tight mb-6">Notifications</h1>
        <Card className="text-center py-12">
          <Bell size={40} className="text-text-muted mx-auto mb-3" />
          <p className="text-[14px] text-text-muted">Configure Supabase to enable notifications</p>
        </Card>
      </div>
    );
  }

  const supabase = (await createClient())!;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: notifications, total }, unreadCount] = await Promise.all([
    getUserNotifications(1, 30),
    getUnreadCount(),
  ]);

  return (
    <div>
      <h1 className="text-[24px] font-semibold tracking-tight mb-6">
        Notifications
        {unreadCount > 0 && (
          <span className="ml-2 text-[14px] font-normal text-text-muted">
            ({unreadCount} unread)
          </span>
        )}
      </h1>
      <NotificationsClient
        initialNotifications={notifications}
        total={total}
      />
    </div>
  );
}
