"use client";

import { Bell } from "lucide-react";
import { usePathname } from "next/navigation";

export default function AdminHeader() {
  const pathname = usePathname();

  const titleMap: Record<
    string,
    { title: string; subtitle?: string }
  > = {
    "/dashboard/admin": {
      title: "Admin Dashboard",
      subtitle: "Monitor and manage all client tasks",
    },
    "/dashboard/admin/tasks": {
      title: "All Tasks",
      subtitle: "View and manage tasks across projects",
    },
    "/dashboard/admin/team": {
      title: "Team Members",
      subtitle: "Manage internal team access",
    },
    "/dashboard/admin/settings": {
      title: "Settings",
      subtitle: "Configure admin preferences",
    },
  };

  let page = titleMap[pathname];

  // ✅ Handle dynamic manage task route
  if (pathname.startsWith("/dashboard/admin/tasks/manage/")) {
    page = {
      title: "Manage Task",
      subtitle: "Update assignment, priority, and internal notes",
    };
  }

  return (
    <header className="mb-8 flex items-center justify-between">
      {/* LEFT */}
      <div>
        {page && (
          <>
            <h1 className="text-2xl font-semibold text-white">
              {page.title}
            </h1>
            {page.subtitle && (
              <p className="text-sm text-gray-400">
                {page.subtitle}
              </p>
            )}
          </>
        )}
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        <button className="relative rounded-full p-2 text-gray-400 hover:bg-[#1a1a1a]">
          <Bell size={18} />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#ff7a1a]" />
        </button>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1a1a1a] text-white font-semibold">
          A
        </div>
      </div>
    </header>
  );
}
