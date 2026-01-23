import Image from "next/image";

export default function Home() {
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
          <a
            href="/auth/login"
            className="w-full rounded-lg bg-[#FF3A2E] py-3 text-white font-medium hover:bg-[#FF5A40]"
          >
            Login
          </a>

          <a
            href="/auth/signup"
            className="w-full rounded-lg border border-gray-600 py-3 text-center text-gray-300 hover:bg-[#1E1E1E] hover:text-white"
          >
            Sign Up
          </a>
        </div>
      </div>
    </main>
  );
}
