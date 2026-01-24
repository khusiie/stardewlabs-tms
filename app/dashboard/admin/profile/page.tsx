import AdminProfileClient from "@/components/admin/AdminProfileClient";

export default function AdminProfilePage() {
  // No auth logic here.
  // Middleware already guarantees ADMIN access.
  return <AdminProfileClient />;
}
