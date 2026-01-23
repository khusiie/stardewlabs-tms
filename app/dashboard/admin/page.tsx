import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/getCurrentUser";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  getAdminTaskStats,
  getAllTasks,
} from "@/app/actions/admin/task.action";

const statusStyles: Record<string, string> = {
  PENDING:
    "border-yellow-500/30 text-yellow-400 bg-yellow-500/10",
  IN_PROGRESS:
    "border-blue-500/30 text-blue-400 bg-blue-500/10",
  COMPLETED:
    "border-green-500/30 text-green-400 bg-green-500/10",
};

export default async function AdminDashboard() {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/auth/login");
  }

  const stats = await getAdminTaskStats();
  const tasks = await getAllTasks(5);

  const cards = [
    { title: "Total Tasks", value: stats.total },
    { title: "Pending", value: stats.pending },
    { title: "In Progress", value: stats.inProgress },
    { title: "Completed", value: stats.completed },
  ];

  return (
    <div className="space-y-10 min-h-screen bg-[#0f0f0f] px-6 py-6 ">
      {/* Header */}

   
      

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((item) => (
          <Card
            key={item.title}
            className="bg-[#1a1a1a] border-[#2a2a2a] hover:border-[#FF7A1A]/40 transition"
          >
            <CardContent className="p-6">
              <p className="text-sm text-gray-400">
                {item.title}
              </p>
              <p className="mt-3 text-3xl font-bold text-white">
                {item.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tasks */}
      <div className="space-y-4">
     <div className="border-t border-[#2a2a2a] pt-6">
  <h2 className="text-lg font-semibold text-white">
    Recent Tasks
  </h2>
</div>


        {tasks.length === 0 ? (
          <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
            <CardContent className="p-8 text-center text-gray-400">
              No tasks found.
            </CardContent>
          </Card>
        ) : (
          tasks.map((task: any) => (
            <Card
              key={task.id}
              className="bg-[#1a1a1a] border-[#2a2a2a] hover:border-[#FF7A1A]/40 transition"
            >
              <CardContent className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Left */}
                <div className="space-y-1">
                  <p className="text-white font-medium">
                    {task.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    Client:{" "}
                    {task.project?.owner?.email ?? "N/A"}
                  </p>
                  <p className="text-xs text-gray-500">
                    Assigned to:{" "}
                    {task.assignee?.name ?? "Unassigned"}
                  </p>
                </div>

                {/* Right */}
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs px-3 py-1 rounded-full border ${
                      statusStyles[task.status]
                    }`}
                  >
                    {task.status.replace("_", " ")}
                  </span>
<Button
  size="sm"
  className="
    bg-gradient-to-r from-[#FF0A0A] to-[#FF7A1A]
    hover:from-[#E50909] hover:to-[#FF8A2A]
    text-white
    shadow-md shadow-red-500/20
  "
>
  Assign
</Button>

                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
