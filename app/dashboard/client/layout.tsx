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
    <div className="flex min-h-screen bg-[#0f0f0f]">
      {/* Sidebar */}
      <ClientSidebar />

      {/* Right side */}
      <div className="flex-1 flex flex-col">
        {/* 🔹 Shared padding container */}
        <div className="px-8 pt-8">
          <ClientHeader userEmail={user.email || "User"} />
        </div>

        {/* Page content (same horizontal padding) */}
        <main className="flex-1 overflow-y-auto px-8 pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}
