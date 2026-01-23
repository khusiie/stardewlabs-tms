"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signupAction } from "@/app/actions/auth";
import { supabase } from "@/app/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async () => {
    setError("");
    setLoading(true);

    try {
      // 1️⃣ Create user + profile
      await signupAction(email, password);

      // 2️⃣ Sign in so session is ready
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        setError(loginError.message);
        setLoading(false);
        return;
      }

      // 3️⃣ Redirect (DO NOT stop loading here)
      router.push("/dashboard");
    }   catch (error: unknown) {
  if (error instanceof Error) {
    setError(error.message);
  } else {
    setError("Something went wrong");
  }
}
  };




  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4">
      {/* Full-screen loader */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black text-white">
          Creating your account…
        </div>
      )}

      <div className="w-full max-w-md bg-[#111] p-8 rounded-xl text-white">
        <h1 className="text-2xl font-semibold text-center mb-4">
          Create Your Account
        </h1>

        <p className="text-center text-gray-400 text-sm mb-6">
          Sign up to join StardewLabs
        </p>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent border border-gray-600 text-white px-4 py-3 rounded
              focus:outline-none focus:border-gray-400 transition"
          />

          <input
            type="password"
            placeholder="Choose a Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent border border-gray-600 text-white px-4 py-3 rounded
              focus:outline-none focus:border-gray-400 transition"
          />

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full bg-[#FF3A2E] hover:bg-[#FF5A40] text-white font-medium py-3 rounded
              transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#FF5500]"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </div>

        <p className="mt-6 text-center text-gray-500 text-sm">
          Already have an account?{" "}
          <a
            href="/auth/login"
            className="text-[#FF5A40] font-semibold hover:underline"
          >
            Login
          </a>
        </p>
      </div>
    </main>
  );
}
