"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/* ---------------- CLIENT-SAFE TYPES ---------------- */

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

/* ---------------- COMPONENT ---------------- */

export default function TaskCard({ task }: TaskCardProps) {
  return (
    <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-white">
            {task.title}
          </h3>

          <Badge
            className="
              bg-gradient-to-r from-[#FF0A0A]/15 to-[#FF7A1A]/15
              text-[#FF7A1A]
              border border-[#FF7A1A]/30
            "
          >
            {task.status.replace("_", " ")}
          </Badge>
        </div>

        {task.description && (
          <p className="mt-2 text-sm text-gray-400">
            {task.description}
          </p>
        )}

        <p className="mt-3 text-xs text-gray-500">
          Due:{" "}
          {task.dueDate
            ? new Date(task.dueDate).toDateString()
            : "—"}
        </p>
      </CardContent>
    </Card>
  );
}
