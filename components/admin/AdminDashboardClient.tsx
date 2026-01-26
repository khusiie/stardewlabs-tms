"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthUser } from "@/lib/supabase/useAuthUser";
import { Eye } from "lucide-react";
import Link from "next/link";

/* ---------------- TYPES (NO PRISMA) ---------------- */

type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  dueDate: string | null;

  assignee: {
    name: string | null;
    email: string;
  } | null;

  client: {
    name: string | null;
    email: string;
  };
};

type AdminTaskStats = {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
};

/* ---------------- UI HELPERS ---------------- */

const statusStyles: Record<TaskStatus, string> = {
  PENDING: "border-yellow-500/30 text-yellow-400 bg-yellow-500/10",
  IN_PROGRESS: "border-blue-500/30 text-blue-400 bg-blue-500/10",
  COMPLETED: "border-green-500/30 text-green-400 bg-green-500/10",
};

/* ---------------- COMPONENT ---------------- */

export default function AdminDashboardClient() {
  const { userId, loading } = useAuthUser();

  const [stats, setStats] = useState<AdminTaskStats | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    async function loadData() {
      try {
        const [statsRes, tasksRes] = await Promise.all([
          fetch("/api/admin/tasks/stats"),
          fetch("/api/admin/tasks"),
        ]);

        if (!statsRes.ok || !tasksRes.ok) {
          throw new Error("Failed to load admin dashboard");
        }

        setStats(await statsRes.json());
        setTasks(await tasksRes.json());
      } catch (err) {
        console.error(err);
        setError("Something went wrong loading admin dashboard");
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

      {/* ---------------- RECENT TASKS ---------------- */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">
          Recent Tasks
        </h2>

        {tasks.length === 0 ? (
          <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
            <CardContent className="p-8 text-center text-gray-400">
              No tasks found.
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
    {/* Title */}
    <p className="text-white font-medium">
      {task.title}
    </p>

    {/* Client */}
    <div className="text-xs text-gray-400 flex gap-2">
      <span className="text-gray-500 w-16">Client</span>
      <span className="text-gray-300">
        {task.client?.name ??
          task.client?.email ??
          "Unknown"}
      </span>
    </div>

   {/* 
    <div className="text-xs text-gray-400 flex gap-2">
      <span className="text-gray-500 w-16">Assigned</span>
      <span className="text-gray-300">
        {task.assignee?.name ?? "Unassigned"}
      </span>
  
    </div>
Assigned */}
    {/* Due Date */}
    <div className="text-xs text-gray-400 flex gap-2">
      <span className="text-gray-500 w-16">Due Date</span>
      <span className="text-gray-300">
        {task.dueDate
          ? new Date(task.dueDate).toLocaleDateString()
          : "—"}
      </span>
    </div>
  </div>

  
{/* RIGHT */}
<div className="flex items-center gap-3 self-start">
  {/* View icon */}
  <Link
    href={`/dashboard/admin/tasks/${task.id}`}
    className="text-gray-400 hover:text-white transition"
    title="View task"
  >
    <Eye className="w-4 h-4" />
  </Link>

  {/* Status */}
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
