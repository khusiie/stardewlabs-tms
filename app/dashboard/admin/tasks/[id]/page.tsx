"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/* ---------------- TYPES ---------------- */

type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  user: {
    name: string | null;
    email: string;
  };
};

type Task = {
  id: string;
  title: string;
  description: string | null;
  note: string | null;
  links: string[];
  status: TaskStatus;
  priority: string | null;
  dueDate: string | null;
  createdAt: string;

  files: {
    id: string;
    name: string;
    url: string;
  }[];

  assignee: {
    name: string | null;
    email: string;
  } | null;

  project: {
    name: string;
    owner: {
      name: string | null;
      email: string;
    };
  };

  comments: Comment[];
};

/* ---------------- UI HELPERS ---------------- */

const statusStyles: Record<TaskStatus, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  IN_PROGRESS: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  COMPLETED: "bg-green-500/10 text-green-400 border-green-500/30",
};

/* ---------------- COMPONENT ---------------- */

export default function AdminTaskViewPage() {
  const { id } = useParams<{ id: string }>();

  const [task, setTask] = useState<Task | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ---------------- LOAD TASK ---------------- */

  useEffect(() => {
    async function loadTask() {
      try {
        const res = await fetch(`/api/admin/tasks/${id}`, {
          cache: "no-store",
        });

        if (!res.ok) throw new Error();

        const data: Task = await res.json();
        setTask(data);
        setComments(data.comments ?? []);
      } catch {
        setError("Unable to load task");
      }
    }

    loadTask();
  }, [id]);

  /* ---------------- ADD COMMENT ---------------- */

  async function handleAddComment() {
    if (!newComment.trim()) return;

    setCommentLoading(true);

    try {
      const res = await fetch(`/api/tasks/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      });

      if (!res.ok) throw new Error();

      const created: Comment = await res.json();

      setComments((prev) => [...prev, created]);
      setNewComment("");
    } catch {
      alert("Unable to send comment");
    } finally {
      setCommentLoading(false);
    }
  }

  /* ---------------- STATES ---------------- */

  if (error) return <p className="text-red-400 p-6">{error}</p>;
  if (!task) return <p className="text-gray-400 p-6">Loading task…</p>;

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-6 px-6 py-6 bg-[#0f0f0f] min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            {task.title}
          </h1>
          <p className="text-sm text-gray-400">
            Project: {task.project.name}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`px-4 py-1 text-sm rounded-full border ${statusStyles[task.status]}`}
          >
            {task.status.replace("_", " ")}
          </span>

          <Link href={`/dashboard/admin/tasks/manage/${task.id}`}>
            <Button
              size="sm"
              className="bg-gradient-to-r from-[#FF0A0A] to-[#FF7A1A] text-white"
            >
              Manage
            </Button>
          </Link>
        </div>
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
            <p className="text-gray-500">Assigned To</p>
            <p className="text-white">
              {task.assignee?.name ||
                task.assignee?.email ||
                "Unassigned"}
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

      {/* CLIENT NOTES */}
      {task.note && (
        <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
          <CardContent className="p-6">
            <p className="text-gray-400 text-sm mb-2">Client Notes</p>
            <p className="text-white">{task.note}</p>
          </CardContent>
        </Card>
      )}



{/* ATTACHMENTS */}
{task.files && task.files.length > 0 && (
  <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
    <CardContent className="p-6">
      <p className="text-gray-400 text-sm mb-3">Attachments</p>
      <div className="space-y-2 text-sm">
        {task.files.map((file) => (
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


    

    {/* REFERENCE LINKS */}
{task.links && task.links.length > 0 && (
  <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
    <CardContent className="p-6">
      <p className="text-gray-400 text-sm mb-3">Reference Links</p>
      <ul className="space-y-2 text-sm">
        {task.links.map((link, i) => (
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


      {/* COMMENTS */}
      <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">
            Comments
          </h2>

          {comments.length === 0 ? (
            <p className="text-gray-400 text-sm">No comments yet.</p>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-[#121212] border border-[#2a2a2a] rounded-lg p-4"
              >
                <p className="text-white font-medium">
                  {comment.user.name ?? comment.user.email}
                </p>
                <p className="text-gray-300 text-sm mt-1">
                  {comment.content}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(comment.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}

          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Reply to client or team…"
            rows={3}
            className="w-full bg-[#0f0f0f] border border-[#2a2a2a] rounded-md px-3 py-2 text-sm text-white"
          />

          <div className="flex justify-end">
            <Button
              onClick={handleAddComment}
              disabled={commentLoading}
              className="min-w-[140px] bg-gradient-to-r from-[#FF0A0A] to-[#FF7A1A] text-white disabled:opacity-40"
            >
              {commentLoading ? "Sending…" : "Send Reply"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
