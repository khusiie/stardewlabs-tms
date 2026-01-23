"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase/client";

export default function AdminSidebar() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard/admin" },
    { name: "All Tasks", href: "/dashboard/admin/tasks" },
    { name: "Team Members", href: "/dashboard/admin/team" },
    { name: "Settings", href: "/dashboard/admin/settings" },
  ];

  return (
    <aside
      className="
        fixed left-0 top-0
        h-screen w-64
        bg-[#111]
        border-r border-[#2a2a2a]
        p-6
        flex flex-col
        z-50
      "
    >
      {/* Logo */}
      <Link
        href="/dashboard/admin"
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
        {navItems.map((item) => (
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
