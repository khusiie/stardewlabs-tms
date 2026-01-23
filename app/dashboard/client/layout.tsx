"use client";

import ClientSidebar from "@/components/dashboard/clientSidebar";
import ClientHeader from "@/components/dashboard/clientHeader";
import { useAuthUser } from "@/lib/supabase/useAuthUser";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, email, loading } = useAuthUser();

  if (loading) return null;
  if (!userId) return null; // middleware already redirected

  return (
    <div className="flex bg-[#0f0f0f] min-h-screen">
      {/* Sidebar */}
      <ClientSidebar />

      {/* Right side */}
      <div className="flex-1 flex flex-col w-full md:w-auto">
        {/* Mobile top bar spacer */}
        <div className="md:hidden h-[57px]" />

        {/* Header */}
        <div className="px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 md:pt-8">
          <ClientHeader userEmail={email ?? "User"} />
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 md:pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}
