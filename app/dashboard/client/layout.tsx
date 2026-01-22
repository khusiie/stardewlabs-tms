import { requireRole } from "../../lib/requireRole";
import ClientSidebar from "../../../components/dashboard/clientSidebar";
import ClientHeader from "../../../components/dashboard/ClientHeader";
import { getCurrentUser } from "@/app/lib/getCurrentUser";
import { Role } from "@prisma/client";

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole([Role.CLIENT]);

  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Sidebar (mobile drawer + desktop fixed) */}
      <ClientSidebar />

      {/* Main content */}
      <div
        className="
          flex flex-col
          min-h-screen
          w-full
          md:ml-64
        "
      >
        {/* Header */}
        <div className="px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 md:pt-8">
          <ClientHeader userEmail={user.email || "User"} />
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 pb-6">
          {children}
        </main>
      </div>
    </div>
  );
}
