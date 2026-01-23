import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/getCurrentUser";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Task } from "@prisma/client";
import {
  getClientTaskStats,
  getClientTasks,
} from "@/app/actions/client/action";

type ClientTask = Task;
export default async function ClientDashboard() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  const stats = await getClientTaskStats();
  const tasks = await getClientTasks(3); // 👈 preview only

  const cards = [
    { title: "Total Tasks", value: stats.total },
    { title: "Pending", value: stats.pending },
    { title: "In Progress", value: stats.inProgress },
    { title: "Completed", value: stats.completed },
  ];

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {cards.map((item) => (
          <Card
            key={item.title}
            className="bg-[#1a1a1a] border-[#2a2a2a]"
          >
            <CardContent className="p-5">
              <p className="text-sm text-gray-400">{item.title}</p>
              <p className="mt-2 text-2xl font-bold text-white">
                {item.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Task Button */}
      <div className="mt-8">
        <Link href="/dashboard/client/tasks/create-task">
          <Button
            className="
              bg-gradient-to-r from-[#FF0A0A] to-[#FF7A1A]
              hover:from-[#E50909] hover:to-[#FF8A2A]
              shadow-lg shadow-red-500/20
              text-white
            "
          >
            + Add New Task
          </Button>
        </Link>
      </div>

      {/* Task Preview */}
      <div className="mt-8 space-y-4">
        <h2 className="text-lg font-semibold text-white">
          My Tasks
        </h2>

        {tasks.length === 0 ? (
          <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
            <CardContent className="p-6 text-center text-gray-400">
              No tasks created yet.
            </CardContent>
          </Card>
        ) : (
          <>
            {tasks.map((task: ClientTask) => (
              <Card
                key={task.id}
                className="bg-[#1a1a1a] border-[#2a2a2a]"
              >
                <CardContent className="p-5 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">
                      {task.title}
                    </p>
                    {task.dueDate && (
                      <p className="text-xs text-gray-500 mt-1">
                        Due:{" "}
                        {new Date(task.dueDate).toDateString()}
                      </p>
                    )}
                  </div>

                  <span className="text-xs px-3 py-1 rounded-full border border-[#FF7A1A]/30 text-[#FF7A1A] bg-[#FF7A1A]/10">
                    {task.status.replace("_", " ")}
                  </span>
                </CardContent>
              </Card>
            ))}

            <Link
              href="/dashboard/client/tasks/my-task"
              className="text-sm text-[#FF7A1A] hover:underline"
            >
              View all tasks →
            </Link>
          </>
        )}
      </div>
    </>
  );
}
