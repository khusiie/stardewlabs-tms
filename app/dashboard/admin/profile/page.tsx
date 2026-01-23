import AdminProfileClient from "@/app/dashboard/admin/profile/AdminProfileClient";

export default function AdminProfilePage() {
  // No auth logic here.
  // Middleware already guarantees ADMIN access.
  return <AdminProfileClient />;
}
