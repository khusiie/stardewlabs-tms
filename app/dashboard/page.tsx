import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export default async function DashboardPage() {
  // ✅ get cookie store ONCE
  const cookieStore =  await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => cookieStore.get(name)?.value,
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 🛡 safety fallback
  if (!user) {
    redirect("/auth/auth/login");
  }

  // ✅ Prisma = source of truth
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  });

  if (!dbUser) {
    redirect("/auth/login");
  }

  if (dbUser.role === "ADMIN") {
    redirect("/dashboard/admin");
  }

  redirect("/dashboard/client");
}
