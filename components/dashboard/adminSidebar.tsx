"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

export default function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    router.push("/");
    router.refresh();
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard/admin" },
    { name: "Manage All Tasks", href: "/dashboard/admin/tasks" },
    { name: "Team Members", href: "/dashboard/admin/team" },
    { name: "Settings", href: "/dashboard/admin/settings" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#111] border-r border-[#2a2a2a] p-6 flex flex-col z-50">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white lg:hidden transition"
          aria-label="Close menu"
        >
          <X size={24} />
        </button>
      )}

      <Link
        href="/dashboard/admin"
        className="mb-10 flex items-center gap-3"
        onClick={onClose}
      >
        <Image src="/logo.svg" alt="StardewLabs Logo" width={36} height={36} />
        <span className="text-xl font-bold text-white">StardewLabs</span>
      </Link>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="block rounded-lg px-4 py-3 text-gray-300 hover:bg-[#1a1a1a] hover:text-white transition"
            onClick={onClose}
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
  );
}
