"use client";

import ProfileView from "@/components/profile/ProfileView";
import { Role } from "@prisma/client";
import { useAuthUser } from "@/lib/supabase/useAuthUser";

export default function AdminProfileClient() {
  const { userId, loading } = useAuthUser();

  if (loading) return null;
  if (!userId) return null; // middleware handles redirect

  // If ProfileView needs email/role,
  // you should fetch them via Prisma API or server action.
  // For now, role is known to be ADMIN.
  return (
    <ProfileView
      email=""       // fetch from API if needed
      role={Role.ADMIN}
    />
  );
}
