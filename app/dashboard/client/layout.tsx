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
    <div className="flex bg-[#0f0f0f] min-h-screen">
      {/* Sidebar */}
      <ClientSidebar />

      {/* Right side */}
      <div className="flex-1 flex flex-col w-full md:w-auto">
        {/* Mobile top bar spacer */}
        <div className="md:hidden h-[57px]" />
        
        {/* Shared padding container - responsive padding */}
        <div className="px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 md:pt-8">
          <ClientHeader userEmail={user.email || "User"} />
        </div>

        {/* Page content (same horizontal padding) */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 md:pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}