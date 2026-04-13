import { Navbar } from "@/components/layout/Navbar";
import { CategoryNav } from "@/components/layout/CategoryNav";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { NotificationBellWrapper } from "@/components/layout/NotificationBellWrapper";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar notificationSlot={<NotificationBellWrapper />} />
      <CategoryNav />
      <main id="main-content" className="flex-1 pb-14 lg:pb-0">{children}</main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
