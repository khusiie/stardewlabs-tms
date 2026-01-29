"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Task = {
  id: string;
  title: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  dueDate?: string | null;
  createdAt: string;

  assignee?: {
    name: string | null;
    email: string;
  };

  client: {
    name: string | null;
    email: string;
  };
};

const statusStyles: Record<string, string> = {
  PENDING: "border-yellow-500/30 text-yellow-400 bg-yellow-500/10",
  IN_PROGRESS: "border-blue-500/30 text-blue-400 bg-blue-500/10",
  COMPLETED: "border-green-500/30 text-green-400 bg-green-500/10",
};

export default function AdminTasksClient() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔍 Filters
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "PENDING" | "IN_PROGRESS" | "COMPLETED"
  >("ALL");

  const [assignmentFilter, setAssignmentFilter] = useState<
    "ALL" | "ASSIGNED" | "UNASSIGNED"
  >("ALL");

  const [sortBy, setSortBy] = useState<
    "CREATED_AT" | "DUE_DATE_ASC"
  >("CREATED_AT");

  const router = useRouter();

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      const res = await fetch("/api/admin/tasks", {
        cache: "no-store",
      });
      const data = await res.json();
      setTasks(data);
      setLoading(false);
    };

    fetchTasks();

    window.addEventListener("focus", fetchTasks);
    return () => window.removeEventListener("focus", fetchTasks);
  }, []);

  if (loading) return null;

  // 🎯 FILTER + SORT
  const filteredTasks = [...tasks]
    .filter((task) => {
      const statusMatch =
        statusFilter === "ALL" || task.status === statusFilter;

      const assignmentMatch =
        assignmentFilter === "ALL" ||
        (assignmentFilter === "ASSIGNED" && task.assignee) ||
        (assignmentFilter === "UNASSIGNED" && !task.assignee);

      return statusMatch && assignmentMatch;
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

      return (
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
      );
    });

  return (
    <div className="min-h-screen bg-[#0f0f0f] px-6 py-6 space-y-6">
      {/* 🔍 FILTER CONTROLS */}
      <div className="flex flex-wrap gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="bg-[#1a1a1a] border border-[#2a2a2a] px-3 py-2 text-sm rounded-md text-white"
        >
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>

        <select
          value={assignmentFilter}
          onChange={(e) => setAssignmentFilter(e.target.value as any)}
          className="bg-[#1a1a1a] border border-[#2a2a2a] px-3 py-2 text-sm rounded-md text-white"
        >
          <option value="ALL">All Tasks</option>
          <option value="ASSIGNED">Assigned</option>
          <option value="UNASSIGNED">Unassigned</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="bg-[#1a1a1a] border border-[#2a2a2a] px-3 py-2 text-sm rounded-md text-white"
        >
          <option value="CREATED_AT">Newest First</option>
          <option value="DUE_DATE_ASC">Nearest Due Date</option>
        </select>
      </div>

      {/* 🗂 TASK LIST */}
      {filteredTasks.length === 0 ? (
        <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
          <CardContent className="p-8 text-center text-gray-400">
            No matching tasks found.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <Card
              key={task.id}
              onClick={() =>
                router.push(`/dashboard/admin/tasks/${task.id}`)
              }
              className="cursor-pointer bg-[#1a1a1a] border-[#2a2a2a] hover:border-[#FF7A1A]/40 transition"
            >
              <CardContent className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Left */}
                <div className="space-y-1">
                  <p className="text-white font-medium">
                    {task.title}
                  </p>

                  <p className="text-xs text-gray-500">
                    Client:{" "}
                    {task.client?.name ??
                      task.client?.email ??
                      "Unknown"}
                  </p>

                  <p className="text-xs text-gray-500">
                    Assigned to:{" "}
                    {task.assignee?.name ||
                      task.assignee?.email ||
                      "Unassigned"}
                  </p>
                </div>

                {/* Right */}
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs px-3 py-1 rounded-full border ${statusStyles[task.status]}`}
                  >
                    {task.status.replace("_", " ")}
                  </span>

                  <Link
                    href={`/dashboard/admin/tasks/manage/${task.id}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-[#FF0A0A] to-[#FF7A1A] text-white"
                    >
                      Manage
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
