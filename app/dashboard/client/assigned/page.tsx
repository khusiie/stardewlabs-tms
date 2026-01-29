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
  createdAt?: string; // optional (safe if backend adds later)
};

/* ---------------- UI HELPERS (MATCH ADMIN) ---------------- */

const statusStyles: Record<TaskStatus, string> = {
  PENDING: "border-yellow-500/30 text-yellow-400 bg-yellow-500/10",
  IN_PROGRESS: "border-blue-500/30 text-blue-400 bg-blue-500/10",
  COMPLETED: "border-green-500/30 text-green-400 bg-green-500/10",
};

/* ---------------- COMPONENT ---------------- */

export default function AssignedTasksPage() {
  const { userId, loading } = useAuthUser();

  const [tasks, setTasks] = useState<AssignedTask[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 🔍 Filters
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | TaskStatus
  >("ALL");

  const [sortBy, setSortBy] = useState<
    "CREATED_AT" | "DUE_DATE_ASC"
  >("CREATED_AT");

  useEffect(() => {
    if (!userId) return;

    fetch("/api/client/tasks?type=assigned", {
      cache: "no-store",
    })
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

  /* ---------------- FILTER + SORT ---------------- */

  const visibleTasks = [...tasks]
    .filter((task) => {
      return (
        statusFilter === "ALL" || task.status === statusFilter
      );
    })
    .sort((a, b) => {
      if (sortBy === "DUE_DATE_ASC") {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return (
          new Date(a.dueDate).getTime() -
          new Date(b.dueDate).getTime()
        );
      }

      // default → newest first
      if (!a.createdAt || !b.createdAt) return 0;

      return (
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
      );
    });

  return (
    <div className="min-h-screen bg-[#0f0f0f] px-6 py-6 space-y-6">
      <h1 className="text-xl font-semibold text-white">
        Tasks Assigned To Me
      </h1>

      {/* 🔍 FILTER CONTROLS */}
      <div className="flex flex-wrap gap-3">
        {/* Status */}
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as any)
          }
          className="bg-[#1a1a1a] border border-[#2a2a2a] px-3 py-2 text-sm rounded-md text-white"
        >
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) =>
            setSortBy(e.target.value as any)
          }
          className="bg-[#1a1a1a] border border-[#2a2a2a] px-3 py-2 text-sm rounded-md text-white"
        >
          <option value="CREATED_AT">Newest First</option>
          <option value="DUE_DATE_ASC">
            Due Date (Closest)
          </option>
        </select>
      </div>

      {/* 🗂 TASK LIST */}
      {visibleTasks.length === 0 ? (
        <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
          <CardContent className="p-8 text-center text-gray-400">
            No matching tasks found.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {visibleTasks.map((task) => (
            <Card
              key={task.id}
              className="bg-[#1a1a1a] border-[#2a2a2a] hover:border-[#FF7A1A]/40 transition"
            >
              <CardContent className="p-6 flex justify-between items-start gap-6">
                {/* LEFT */}
                <div className="space-y-2">
                  <p className="text-white font-medium">
                    {task.title}
                  </p>

                  <div className="text-xs text-gray-400 flex gap-2">
                    <span className="text-gray-500 w-20">
                      Due Date:
                    </span>
                    <span>
                      {task.dueDate &&
                      !isNaN(Date.parse(task.dueDate))
                        ? new Date(
                            task.dueDate
                          ).toLocaleDateString()
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
          ))}
        </div>
      )}
    </div>
  );
}
