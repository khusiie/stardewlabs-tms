"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase/client";
import { Menu, X } from "lucide-react";

export default function ClientSidebar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard/client" },
    { name: "My Tasks", href: "/dashboard/client/tasks/my-task" },
    { name: "Create Task", href: "/dashboard/client/tasks/create-task" },
    { name: "Settings", href: "/dashboard/client/settings" },
  ];

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between bg-[#111] border-b border-[#2a2a2a] px-4 py-3">
        <button onClick={() => setOpen(true)}>
          <Menu className="h-6 w-6 text-white" />
        </button>
        <div className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="StardewLabs Logo"
            width={24}
            height={24}
            priority
          />
          <span className="text-white font-semibold">StardewLabs</span>
        </div>
        <div className="w-6" />
      </div>

      {/* Overlay (mobile) */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed z-50 inset-y-0 left-0
          w-64 bg-[#111] border-r border-[#2a2a2a] p-6 flex flex-col
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:sticky md:top-0 md:h-screen
        `}
      >
        {/* Mobile close button */}
        <div className="flex items-center justify-between mb-10 md:hidden">
          <span className="text-xl font-bold text-white">StardewLabs</span>
          <button onClick={() => setOpen(false)}>
            <X className="h-6 w-6 text-white" />
          </button>
        </div>

        {/* Logo (desktop) */}
        <Link
          href="/dashboard/client"
          className="hidden md:flex mb-10 items-center gap-3"
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
              onClick={() => setOpen(false)}
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
    </>
  );
}