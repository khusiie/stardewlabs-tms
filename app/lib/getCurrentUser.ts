import { createSupabaseServerClient } from "./supabase/server";
import { prisma } from "./prisma";

export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user: authUser },
    error,
  } = await supabase.auth.getUser();

  if (error || !authUser) {
    return null;
  }

  // 🔑 Fetch YOUR app user from Prisma
  const user = await prisma.user.findUnique({
    where: {
      id: authUser.id,
    },
  });

  return user; // ✅ Prisma user (CLIENT | ADMIN)
}
