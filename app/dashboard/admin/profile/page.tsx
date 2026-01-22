import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/getCurrentUser";
import ProfileView from "@/components/profile/ProfileView";
import { Role } from "@prisma/client";

export default async function AdminProfilePage() {
  const user = await getCurrentUser();

  if (!user || !user.role) {
    redirect("/auth/login");
  }

  const { email, role } = user;

  return (
    <ProfileView
      email={email ?? ""}
      role={role as Role}
    />
  );
}
