import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { requireAuth } from "./auth";

export async function requireRole(allowedRoles: Role[]) {
  const user = await requireAuth();

  if (!allowedRoles.includes(user.role)) {
    if (user.role === "ADMIN") redirect("/dashboard/admin");
    redirect("/dashboard/client");
  }

  return user;
}
