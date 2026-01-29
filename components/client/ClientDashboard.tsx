"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuthUser } from "@/lib/supabase/useAuthUser";
import { Eye } from "lucide-react";

/* ---------------- TYPES (NO PRISMA) ---------------- */

type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

type ClientTask = {
  id: string;
  title: string;
  status: TaskStatus;
  createdAt: string;
  dueDate?: string | null;
};

type ClientTaskStats = {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
};

/* ---------------- UI HELPERS (SAME AS ADMIN) ---------------- */

const statusStyles: Record<TaskStatus, string> = {
  PENDING: "border-yellow-500/30 text-yellow-400 bg-yellow-500/10",
  IN_PROGRESS: "border-blue-500/30 text-blue-400 bg-blue-500/10",
  COMPLETED: "border-green-500/30 text-green-400 bg-green-500/10",
};

/* ---------------- COMPONENT ---------------- */

export default function ClientDashboardClient() {
  const { userId, loading } = useAuthUser();

  const [stats, setStats] = useState<ClientTaskStats | null>(null);
  const [tasks, setTasks] = useState<ClientTask[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    async function loadData() {
      try {
        const [statsRes, tasksRes] = await Promise.all([
          fetch("/api/client/tasks/stats"),
          fetch("/api/client/tasks"),
        ]);

        if (!statsRes.ok || !tasksRes.ok) {
          throw new Error("Failed to load dashboard data");
        }

        setStats(await statsRes.json());
        setTasks(await tasksRes.json());
      } catch (err) {
        console.error(err);
        setError("Something went wrong loading dashboard");
      }
    }

    loadData();
  }, [userId]);

  if (loading) return <p className="text-gray-400">Loading…</p>;
  if (error) return <p className="text-red-400">{error}</p>;
  if (!stats) return <p className="text-gray-400">Loading dashboard…</p>;

  const cards = [
    { title: "Total Tasks", value: stats.total },
    { title: "Pending", value: stats.pending },
    { title: "In Progress", value: stats.inProgress },
    { title: "Completed", value: stats.completed },
  ];

  return (
    <div className="space-y-10 min-h-screen bg-[#0f0f0f] px-6 py-6">
      {/* ---------------- STATS ---------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((item) => (
          <Card
            key={item.title}
            className="bg-[#1a1a1a] border-[#2a2a2a]"
          >
            <CardContent className="p-6">
              <p className="text-sm text-gray-400">{item.title}</p>
              <p className="mt-3 text-3xl font-bold text-white">
                {item.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ---------------- ADD TASK ---------------- */}
      <div>
        <Link href="/dashboard/client/tasks/create-task">
          <Button className="bg-gradient-to-r from-[#FF0A0A] to-[#FF7A1A]">
            + Add New Task
          </Button>
        </Link>
      </div>

      {/* ---------------- TASK LIST ---------------- */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">
          My Tasks
        </h2>

        {tasks.length === 0 ? (
          <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
            <CardContent className="p-8 text-center text-gray-400">
              No tasks created yet.
            </CardContent>
          </Card>
        ) : (
          tasks.map((task) => (
            <Card
              key={task.id}
              className="bg-[#1a1a1a] border-[#2a2a2a]"
            >
              <CardContent className="p-6 flex justify-between items-start gap-6">
                {/* LEFT */}
                <div className="space-y-2">
                  <p className="text-white font-medium">
                    {task.title}
                  </p>

         
                  {/* Due Date */}
                  <div className="text-xs text-gray-400 flex gap-2">
      
                      Due Date:
        
                    <span>
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString()
                        : "—"}
                    </span>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-3 self-start">
                  <Link
                    href={`/dashboard/client/tasks/${task.id}`}
                    className="text-gray-400 hover:text-white transition"
                    title="View task"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>

                  <span
                    className={`text-xs px-3 py-1 rounded-full border ${statusStyles[task.status]}`}
                  >
                    {task.status.replace("_", " ")}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
