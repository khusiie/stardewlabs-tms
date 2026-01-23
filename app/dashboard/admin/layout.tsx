import AdminSidebar from "@/components/dashboard/adminSidebar";
import AdminHeader from "@/components/dashboard/adminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Fixed Sidebar */}
      <AdminSidebar />

      {/* Main content */}
      <main className="ml-64 min-h-screen px-6 py-6">
        <AdminHeader />
        {children}
      </main>
    </div>
  );
}
