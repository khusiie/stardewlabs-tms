import Image from "next/image";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/getCurrentUser";

export default async function Home() {
  const user = await getCurrentUser();

  // Redirect logged-in users
  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black text-white px-4">
      <div className="w-full max-w-md rounded-xl bg-[#111] p-10 text-center">
        <Image
          src="/logo.svg"
          alt="StardewLabs Logo"
          width={80}
          height={80}
          className="mx-auto mb-6"
          priority
        />

        <h1 className="text-3xl font-semibold text-white">
          StardewLabs
        </h1>

        <p className="mt-2 text-sm text-gray-400">
          Task Management System
        </p>

        <div className="mt-8 flex flex-col gap-4">
          {/* Login Button (Primary) */}
          <a
            href="/auth/login"
            className="
              w-full
              rounded-lg
              bg-[#FF3A2E] 
              hover:bg-[#FF5A40]
              text-white font-medium
              py-3
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-[#FF5500]
            "
          >
            Login
          </a>

          {/* Sign Up Button (Secondary) */}
          <a
            href="/auth/signup"
            className="
              w-full
              rounded-lg
              border border-gray-600
              text-gray-300
              py-3
              text-center font-medium
              hover:bg-[#1E1E1E]
              hover:text-white
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-[#FF5500]
            "
          >
            Sign Up
          </a>
        </div>
      </div>
    </main>
  );
}
