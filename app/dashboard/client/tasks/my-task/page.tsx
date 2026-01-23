import ClientMyTasksClient from "@/app/dashboard/client/tasks/my-task/ClientMyTasksClient";

export default function ClientTasksPage() {
  // Auth is handled by middleware
  return <ClientMyTasksClient />;
}
