"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";

/* ---------------- TYPES ---------------- */

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

/* ---------------- UI HELPERS ---------------- */

const statusStyles: Record<TaskStatus, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  IN_PROGRESS: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  COMPLETED: "bg-green-500/10 text-green-400 border-green-500/30",
};

/* ---------------- COMPONENT ---------------- */

export default function ClientTaskViewPage() {
  const { id } = useParams<{ id: string }>();

  const [task, setTask] = useState<Task | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  // 💬 comment state
  const [newComment, setNewComment] = useState("");
  const [sendingComment, setSendingComment] = useState(false);

  /* ---------------- LOAD TASK ---------------- */

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

  /* ---------------- UPDATE STATUS ---------------- */

  async function updateStatus(newStatus: TaskStatus) {
    if (!task) return;

    try {
      setUpdating(true);

      const res = await fetch(`/api/tasks/${task.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error();

      // Optimistic UI update
      setTask((prev) =>
        prev ? { ...prev, status: newStatus } : prev
      );
    } catch {
      alert("Failed to update task status");
    } finally {
      setUpdating(false);
    }
  }

  /* ---------------- ADD COMMENT ---------------- */

  async function addComment() {
    if (!newComment.trim() || !task) return;

    try {
      setSendingComment(true);

      const res = await fetch(`/api/tasks/${task.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      });

      if (!res.ok) throw new Error();

      const createdComment = await res.json();

      // ✅ instant UI update
      setTask((prev) =>
        prev
          ? {
              ...prev,
              comments: [...(prev.comments ?? []), createdComment],
            }
          : prev
      );

      setNewComment("");
    } catch {
      alert("Failed to add comment");
    } finally {
      setSendingComment(false);
    }
  }

  /* ---------------- STATES ---------------- */

  if (error) return <p className="text-red-400 p-6">{error}</p>;
  if (!task) return <p className="text-gray-400 p-6">Loading task…</p>;

  const links = task.links ?? [];
  const files = task.files ?? [];
  const comments = task.comments ?? [];

  /* ---------------- UI ---------------- */

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

        {/* STATUS UPDATE */}
        <select
          value={task.status}
          disabled={updating}
          onChange={(e) =>
            updateStatus(e.target.value as TaskStatus)
          }
          className={`px-4 py-1 text-sm rounded-full border bg-[#0f0f0f] ${statusStyles[task.status]}`}
        >
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>
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

      {/* NOTE (ONE-TIME) */}
      {task.note && (
        <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
          <CardContent className="p-6">
            <p className="text-gray-400 text-sm mb-2">
              Task Brief (from creator)
            </p>
            <p className="text-white">{task.note}</p>
          </CardContent>
        </Card>
      )}

      {/* LINKS */}
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

      {/* FILES */}
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

      {/* COMMENTS */}
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
            <div className="space-y-3">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-[#121212] rounded-md p-3"
                >
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-white">
                      {comment.user.name ?? comment.user.email}
                    </p>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mt-1">
                    {comment.content}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* ADD COMMENT */}
          <div className="pt-4 border-t border-[#2a2a2a] space-y-2">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add an update or reply to admin…"
              rows={3}
              className="w-full bg-[#0f0f0f] border border-[#2a2a2a] rounded-md p-3 text-sm text-white resize-none focus:outline-none focus:ring-1 focus:ring-orange-500"
            />

            <button
              onClick={addComment}
              disabled={sendingComment}
              className="px-4 py-2 rounded-md bg-orange-500 text-black text-sm hover:bg-orange-400 disabled:opacity-50"
            >
              {sendingComment ? "Sending..." : "Send Comment"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
