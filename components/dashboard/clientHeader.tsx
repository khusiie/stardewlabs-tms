"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { usePathname } from "next/navigation";

export default function ClientHeader({
  userEmail,
}: {
  userEmail: string;
}) {
  const pathname = usePathname();

  const titleMap: Record<string, { title: string; subtitle?: string }> = {
    "/dashboard/client": {
      title: "Client Dashboard",
      subtitle: `Welcome, ${userEmail}`,
    },
    "/dashboard/client/profile": {
      title: "Profile",
      subtitle: " View your account details",
    },
    "/dashboard/client/tasks/my-task":{

      title: "My Tasks",
      subtitle: "View and manage all tasks you’ve created",
    },
    "/dashboard/client/settings":{
      title : "Settings",
      subtitle:"  Manage your account preferences and profile information",
    
    },
    "/dashboard/client/tasks/create-task":{

      title : "Create New Task",
      subtitle:"Fill out the form below to create a new task"
    },
  };


  const page = titleMap[pathname];

  return (
    <header className="mb-8 flex items-center justify-between">
      {/* LEFT: Title */}
      <div>
        {page && (
          <>
            <h1 className="text-2xl font-semibold text-white">
              {page.title}
            </h1>
            {page.subtitle && (
              <p className="text-sm text-gray-400" >
                {page.subtitle}
              </p>
            )}
          </>
        )}
      </div>

      {/* RIGHT: Notifications + Profile */}
      <div className="flex items-center gap-4">
        <button className="relative rounded-full p-2 text-gray-400 hover:bg-[#1a1a1a]">
          <Bell size={18} />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#ff7a1a]" />
        </button>

        <Link
          href="/dashboard/client/profile"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1a1a1a] text-white font-medium"
        >
          {userEmail.charAt(0).toUpperCase()}
        </Link>
      </div>
    </header>
  );
}
