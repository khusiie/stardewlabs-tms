"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import TaskCard from "@/components/client/TaskCard";
import { useAuthUser } from "@/lib/supabase/useAuthUser";

/* ---------------- CLIENT-SAFE TYPES ---------------- */

type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

type ClientTask = {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  dueDate?: string | null;
};

/* ---------------- COMPONENT ---------------- */

export default function ClientMyTasksClient() {
  const { userId, loading } = useAuthUser();

  const [tasks, setTasks] = useState<ClientTask[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 🔍 Status filter (lightweight)
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | TaskStatus
  >("ALL");

  useEffect(() => {
    if (!userId) return;

    fetch("/api/client/tasks")
      .then((res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then((data: ClientTask[]) => setTasks(data))
      .catch(() => setError("Failed to load tasks"));
  }, [userId]);

  if (loading) return null;
  if (error) return <p className="text-red-400">{error}</p>;

  const visibleTasks = tasks.filter(
    (task) =>
      statusFilter === "ALL" || task.status === statusFilter
  );

  return (
    <div className="space-y-6">
      {/* 🔍 STATUS FILTER */}
      <div className="flex">
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as any)
          }
          className="bg-[#1a1a1a] border border-[#2a2a2a] px-3 py-2 text-sm rounded-md text-white"
        >
          <option value="ALL">All Tasks</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      {visibleTasks.length === 0 ? (
        <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
          <CardContent className="p-6 text-center text-gray-400">
            No tasks match this status.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {visibleTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}
