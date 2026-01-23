"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import TaskCard from "@/components/client/TaskCard";
import { Task } from "@prisma/client";
import { useAuthUser } from "@/lib/supabase/useAuthUser";

export default function ClientMyTasksClient() {
  const { userId, loading } = useAuthUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    fetch("/api/client/tasks", {
      headers: {
        "x-user-id": userId,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then(setTasks)
      .catch(() => setError("Failed to load tasks"));
  }, [userId]);

  if (loading) return null;
  if (error) return <p className="text-red-400">{error}</p>;

  return (
    <div className="space-y-6">
      {tasks.length === 0 && (
        <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
          <CardContent className="p-6 text-center text-gray-400">
            No tasks available yet.
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
