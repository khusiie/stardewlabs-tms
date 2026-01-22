"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase/client";

export default function ClientSidebar() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <aside className="w-64 bg-[#111] border-r border-[#2a2a2a] p-6 flex flex-col">
      {/* Logo */}
      <Link
        href="/dashboard/client"
        className="mb-10 flex items-center gap-3"
      >
        <Image
          src="/logo.svg"
          alt="StardewLabs Logo"
          width={36}
          height={36}
          priority
        />
        <span className="text-xl font-bold text-white">
          StardewLabs
        </span>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {[
          { name: "Dashboard", href: "/dashboard/client" },
          { name: "My Tasks", href: "/dashboard/client/tasks/my-task" },
          { name: "Create Task", href: "/dashboard/client/tasks/create-task" },
          { name: "Settings", href: "/dashboard/client/settings" },
        ].map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="block rounded-lg px-4 py-3 text-gray-300 hover:bg-[#1a1a1a] hover:text-white transition"
          >
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Divider */}
      <div className="my-4 h-px bg-[#2a2a2a]" />

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="px-4 py-3 text-left text-sm text-red-400 hover:bg-[#1a1a1a] rounded-lg transition"
      >
        Logout
      </button>
    </aside>
  );
}
