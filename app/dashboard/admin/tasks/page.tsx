import AdminTasksClient from "@/app/dashboard/admin/tasks/AdminTasksClient";
export default function AdminTasksPage() {
  // Auth + ADMIN role enforced by middleware
  return <AdminTasksClient />;
}
