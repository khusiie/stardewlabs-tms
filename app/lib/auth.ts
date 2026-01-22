import { redirect } from "next/navigation";
import { prisma } from "./prisma";
import { getCurrentUser } from "./getCurrentUser";

export async function requireAuth() {
  const supabaseUser = await getCurrentUser();

  if (!supabaseUser || !supabaseUser.email) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: supabaseUser.email },
  });

  if (!dbUser) {
    redirect("/login");
  }

  return dbUser; // ✅ includes role
}
