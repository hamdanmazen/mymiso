import { Navbar } from "@/components/layout/Navbar";
import { AdminSidebar } from "@/components/layout/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="flex flex-1">
        <AdminSidebar />
        <main id="main-content" className="flex-1 px-4 sm:px-6 lg:px-8 py-6 overflow-auto">
          {children}
        </main>
      </div>
    </>
  );
}
