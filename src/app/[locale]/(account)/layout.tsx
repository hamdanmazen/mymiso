import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { NotificationBellWrapper } from "@/components/layout/NotificationBellWrapper";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar notificationSlot={<NotificationBellWrapper />} />
      <main id="main-content" className="flex-1 max-w-[1400px] mx-auto w-full px-4 sm:px-6 py-8 pb-20 lg:pb-8">
        {children}
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
