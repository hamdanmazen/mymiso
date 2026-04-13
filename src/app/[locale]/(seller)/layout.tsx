import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { NotificationBellWrapper } from "@/components/layout/NotificationBellWrapper";

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar notificationSlot={<NotificationBellWrapper />} />
      <div className="flex flex-1">
        <Sidebar />
        <main id="main-content" className="flex-1 px-4 sm:px-6 lg:px-8 py-6 pb-20 lg:pb-6 overflow-auto">
          {children}
        </main>
      </div>
      <MobileBottomNav />
    </>
  );
}
