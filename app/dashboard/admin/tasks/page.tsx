import AdminTasksClient from "@/components/admin/AdminTasksClient";
export default function AdminTasksPage() {
  // Auth + ADMIN role enforced by middleware
  return <AdminTasksClient />;
}
