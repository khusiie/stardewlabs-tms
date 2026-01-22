"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/app/lib/supabase/client";

export default function ClientSidebar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#111] border-b border-[#2a2a2a]">
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Logo" width={28} height={28} />
          <span className="text-white font-semibold">StardewLabs</span>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="text-white text-xl"
        >
          ☰
        </button>
      </div>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static z-50
          top-0 left-0
          h-screen
          w-64
          bg-[#111]
          border-r border-[#2a2a2a]
          p-6
          flex flex-col
          transition-transform
          duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Logo */}
        <Link
          href="/dashboard/client"
          onClick={() => setOpen(false)}
          className="mb-10 flex items-center gap-3"
        >
          <Image src="/logo.svg" alt="Logo" width={36} height={36} />
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
              onClick={() => setOpen(false)}
              className="block rounded-lg px-4 py-3 text-gray-300 hover:bg-[#1a1a1a] hover:text-white transition"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="my-4 h-px bg-[#2a2a2a]" />

        <button
          onClick={handleLogout}
          className="px-4 py-3 text-left text-sm text-red-400 hover:bg-[#1a1a1a] rounded-lg transition"
        >
          Logout
        </button>
      </aside>
    </>
  );
}
