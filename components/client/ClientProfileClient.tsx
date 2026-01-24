"use client";

import ProfileView from "@/components/profile/ProfileView";
import { useAuthUser } from "@/lib/supabase/useAuthUser";

/* ---------------- CLIENT-SAFE TYPES ---------------- */

type UserRole = "ADMIN" | "CLIENT";

export default function ClientProfileClient() {
  const { userId, loading } = useAuthUser();

  if (loading) return null;
  if (!userId) return null; // middleware handles redirect

  return (
    <ProfileView
      email=""          // fetch from API if needed
      role={"CLIENT"}   // ✅ client-safe role
    />
  );
}
