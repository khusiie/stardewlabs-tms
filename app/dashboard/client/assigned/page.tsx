"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Eye } from "lucide-react";
import { useAuthUser } from "@/lib/supabase/useAuthUser";

/* ---------------- TYPES ---------------- */

type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

type AssignedTask = {
  id: string;
  title: string;
  status: TaskStatus;
  dueDate?: string | null;
};

/* ---------------- COMPONENT ---------------- */

export default function AssignedTasksPage() {
  const { userId, loading } = useAuthUser();

  const [tasks, setTasks] = useState<AssignedTask[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    fetch("/api/client/tasks?type=assigned")
      .then((res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then((data: AssignedTask[]) => setTasks(data))
      .catch(() => setError("Failed to load assigned tasks"));
  }, [userId]);

  if (loading) {
    return <p className="text-gray-400">Loading assigned tasks…</p>;
  }

  if (error) {
    return <p className="text-red-400">{error}</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-white">
        Tasks Assigned To Me
      </h1>

      {tasks.length === 0 ? (
        <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
          <CardContent className="p-6 text-center text-gray-400">
            No tasks have been assigned to you yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <Card
              key={task.id}
              className="bg-[#1a1a1a] border-[#2a2a2a] hover:border-orange-500/40 transition"
            >
              <CardContent className="p-5 flex items-center justify-between">
                {/* Left */}
                <div>
                  <p className="text-white font-medium">
                    {task.title}
                  </p>

                  {task.dueDate && (
                    <p className="text-xs text-gray-400 mt-1">
                      Due:{" "}
                      {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  )}
                </div>

                {/* Right */}
                <div className="flex items-center gap-3">


                    <Link
                    href={`/dashboard/client/tasks/${task.id}`}
                    className="text-gray-400 hover:text-orange-400"
                    title="View task"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <span className="text-xs px-3 py-1 rounded-full border border-orange-500 text-orange-400">
                    {task.status.replace("_", " ")}
                  </span>

              
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
