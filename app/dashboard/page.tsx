import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/getCurrentUser";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  // Not logged in → login
  if (!user) {
    redirect("/auth/login");
  }

  
  // Role-based redirect
  if (user.role === "ADMIN") {
    redirect("/dashboard/admin");
  }

  if (user.role === "CLIENT") {
    redirect("/dashboard/client");
  }

  // Safety fallback (should never happen)
  redirect("/auth/login");
}
