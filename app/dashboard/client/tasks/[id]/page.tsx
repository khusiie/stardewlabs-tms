"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";

type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

type Task = {
  id: string;
  title: string;
  description: string | null;
  note: string | null;
  links?: string[];
  status: TaskStatus;
  priority: string | null;
  dueDate: string | null;
  createdAt: string;

  files?: {
    id: string;
    name: string;
    url: string;
  }[];

  project: {
    name: string;
    owner: {
      name: string | null;
      email: string;
    };
  };

  comments?: {
    id: string;
    content: string;
    createdAt: string;
    user: {
      name: string | null;
      email: string;
    };
  }[];
};

const statusStyles: Record<TaskStatus, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  IN_PROGRESS: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  COMPLETED: "bg-green-500/10 text-green-400 border-green-500/30",
};

export default function ClientTaskViewPage() {
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTask() {
      try {
        const res = await fetch(`/api/client/tasks/${id}`);
        if (!res.ok) throw new Error();
        setTask(await res.json());
      } catch {
        setError("Unable to load task");
      }
    }

    loadTask();
  }, [id]);

  if (error) return <p className="text-red-400 p-6">{error}</p>;
  if (!task) return <p className="text-gray-400 p-6">Loading task…</p>;

  const links = task.links ?? [];
  const files = task.files ?? [];
  const comments = task.comments ?? [];

  return (
    <div className="space-y-6 px-6 py-6 bg-[#0f0f0f] min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            {task.title}
          </h1>
          <p className="text-sm text-gray-400">
            Project: {task.project.name}
          </p>
        </div>

        <span
          className={`px-4 py-1 text-sm rounded-full border ${statusStyles[task.status]}`}
        >
          {task.status.replace("_", " ")}
        </span>
      </div>

      {/* DETAILS */}
      <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <p className="text-gray-500">Client</p>
            <p className="text-white">
              {task.project.owner.name ?? task.project.owner.email}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Priority</p>
            <p className="text-white">{task.priority ?? "LOW"}</p>
          </div>

          <div>
            <p className="text-gray-500">Due Date</p>
            <p className="text-white">
              {task.dueDate
                ? new Date(task.dueDate).toLocaleDateString()
                : "—"}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Created</p>
            <p className="text-white">
              {new Date(task.createdAt).toLocaleDateString()}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* DESCRIPTION */}
      {task.description && (
        <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
          <CardContent className="p-6">
            <p className="text-gray-400 text-sm mb-2">Description</p>
            <p className="text-white">{task.description}</p>
          </CardContent>
        </Card>
      )}

      {/* CLIENT NOTES (PRIVATE) */}
      {task.note && (
        <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
          <CardContent className="p-6">
            <p className="text-gray-400 text-sm mb-2">Your Notes</p>
            <p className="text-white">{task.note}</p>
          </CardContent>
        </Card>
      )}

      {/* REFERENCE LINKS */}
      {links.length > 0 && (
        <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
          <CardContent className="p-6">
            <p className="text-gray-400 text-sm mb-3">Reference Links</p>
            <ul className="space-y-2 text-sm">
              {links.map((link, i) => (
                <li key={i}>
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-400 hover:underline break-all"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* ATTACHMENTS */}
      {files.length > 0 && (
        <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
          <CardContent className="p-6">
            <p className="text-gray-400 text-sm mb-3">Attachments</p>
            <div className="space-y-2 text-sm">
              {files.map((file) => (
                <a
                  key={file.id}
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-orange-400 hover:underline"
                >
                  📎 {file.name}
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* COMMENTS (ADMIN / TEAM RESPONSES) */}
      <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">
            Comments
          </h2>

          {comments.length === 0 ? (
            <p className="text-gray-400 text-sm">
              No comments yet.
            </p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="text-sm">
                <p className="text-white font-medium">
                  {comment.user.name ?? comment.user.email}
                </p>
                <p className="text-gray-400">
                  {comment.content}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
