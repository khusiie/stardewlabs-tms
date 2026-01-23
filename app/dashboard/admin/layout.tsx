import { requireRole } from "../../lib/requireRole";
import { Role } from "@prisma/client";

import AdminSidebar from "@/components/dashboard/adminSidebar";
import AdminHeader from "@/components/dashboard/adminHeader";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 🔐 Role protection
  await requireRole([Role.ADMIN]);

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Fixed Sidebar */}
      <AdminSidebar />

      {/* Main content (offset by sidebar width) */}
      <main className="ml-64 min-h-screen px-6 py-6">
        {/* Header */}
        <AdminHeader />

        {/* Page content */}
        {children}
      </main>
    </div>
  );
}
