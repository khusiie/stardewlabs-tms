"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function CreateTaskForm() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");

    if (!title.trim()) {
      setError("Task title is required");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/client/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        dueDate: dueDate || null,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      setError("Failed to create task");
      return;
    }

    //  Redirect after success
    router.push("/dashboard/client/tasks/my-task");
    router.refresh();
  };

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
        <CardContent className="p-6 space-y-6">
          <Input
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-[#111] border-[#2a2a2a] text-white"
          />

          <Textarea
            placeholder="Task description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-[#111] border-[#2a2a2a] text-white min-h-[120px]"
          />

          <Input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="bg-[#111] border-[#2a2a2a] text-white"
          />

          {error && (
            <p className="text-sm text-red-400">
              {error}
            </p>
          )}

          <div className="flex gap-4">
            <Button
              disabled={loading}
              onClick={handleSubmit}
              className="
                bg-gradient-to-r from-[#FF2A1A] to-[#FF8A2A]
                hover:from-[#E51919] hover:to-[#FF9A3A]
                text-white
                font-semibold
                px-6 py-2.5
                rounded-lg
                shadow-lg shadow-orange-500/30
                transition-all
                active:scale-95
                disabled:opacity-50
              "
            >
              {loading ? "Creating..." : "Create Task"}
            </Button>

            <Button
              variant="outline"
              onClick={() => router.back()}
              className="
                border border-[#2a2a2a]
                text-gray-300
                bg-[#111]
                hover:bg-[#1f1f1f]
                hover:text-white
                px-6 py-2.5
                rounded-lg
                transition-all
                active:scale-95
              "
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
