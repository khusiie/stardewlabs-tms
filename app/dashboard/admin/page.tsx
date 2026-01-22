import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/getCurrentUser";
//import { requireAdmin } from "@/app/actions/admin-auth";

export default async function AdminDashboard() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

//const isAdmin = await requireAdmin(user.id);

 // if (!isAdmin) {
  //  redirect("/dashboard/client");
 // }
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p className="mt-2 text-zinc-600">Welcome Admin</p>
    </div>
  );
}
