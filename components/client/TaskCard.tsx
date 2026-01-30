"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

/* ---------------- TYPES ---------------- */

type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

type ClientTask = {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  dueDate?: string | null;
};

type TaskCardProps = {
  task: ClientTask;
};

/* ---------------- STATUS STYLES ---------------- */

const statusStyles: Record<TaskStatus, string> = {
  PENDING: "border-yellow-500/30 text-yellow-400 bg-yellow-500/10",
  IN_PROGRESS: "border-blue-500/30 text-blue-400 bg-blue-500/10",
  COMPLETED: "border-green-500/30 text-green-400 bg-green-500/10",
};

/* ---------------- COMPONENT ---------------- */

export default function TaskCard({ task }: TaskCardProps) {
  const router = useRouter();

  return (
    <Card
      onClick={() =>
        router.push(`/dashboard/client/tasks/${task.id}`)
      }
      className="
        bg-[#1a1a1a]
        border-[#2a2a2a]
        cursor-pointer
        hover:border-[#FF7A1A]/40
        transition
      "
    >
      <CardContent className="p-5 space-y-3">
        {/* TOP ROW */}
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-white">
            {task.title}
          </h3>

          {/* ✅ READ-ONLY STATUS */}
          <span
            className={`
              text-xs px-3 py-1 rounded-full border
              ${statusStyles[task.status]}
            `}
          >
            {task.status.replace("_", " ")}
          </span>
        </div>

        {/* DESCRIPTION */}
        {task.description && (
          <p className="text-sm text-gray-400">
            {task.description}
          </p>
        )}

        {/* DUE DATE */}
        <p className="text-xs text-gray-500">
          Due:{" "}
          {task.dueDate
            ? new Date(task.dueDate).toDateString()
            : "—"}
        </p>
      </CardContent>
    </Card>
  );
}
