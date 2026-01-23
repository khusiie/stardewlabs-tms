import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/getCurrentUser";
import { headers } from "next/headers";
import { Card, CardContent } from "@/components/ui/card";
import TaskCard from "../../../../../components/client/TaskCard";
import { Task } from "@prisma/client";

async function getTasks() {
  const headersList = await headers();
  const host = headersList.get("host");
  const cookie = headersList.get("cookie");

  const protocol =
    process.env.NODE_ENV === "development"
      ? "http"
      : "https";

  const res = await fetch(
    `${protocol}://${host}/api/client/tasks`,
    {
      headers: {
        cookie: cookie ?? "",
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch tasks");
  }

  return res.json();
}

export default async function ClientTasksPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  const tasks = await getTasks();

  return (
    <div className="space-y-6">
     
      

      {/* Empty State */}
      {tasks.length === 0 && (
        <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
          <CardContent className="p-6 text-center text-gray-400">
            No tasks available yet.
          </CardContent>
        </Card>
      )}

      {/* Task List */}
      <div className="space-y-4">
        {tasks.map((task: Task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
