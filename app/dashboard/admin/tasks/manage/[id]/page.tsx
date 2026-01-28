"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/* ---------------- TYPES ---------------- */

type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

type User = {
  id: string;
  name: string | null;
  email: string;
};

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
  priority: TaskPriority | null;
  dueDate: string | null;
  assignee: User | null;
  project: {
    owner: {
      name: string | null;
      email: string;
    };
  };
  comments: Comment[];
};

/* ---------------- UI HELPERS ---------------- */

const priorityStyles: Record<TaskPriority, string> = {
  LOW: "border-gray-500/30 text-gray-300 bg-gray-500/10",
  MEDIUM: "border-yellow-500/30 text-yellow-400 bg-yellow-500/10",
  HIGH: "border-red-500/30 text-red-400 bg-red-500/10",
};

/* ---------------- COMPONENT ---------------- */

export default function ManageTaskPage() {
  const { id } = useParams<{ id: string }>();

  const [task, setTask] = useState<Task | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  const [priority, setPriority] = useState<TaskPriority>("MEDIUM");
  const [assigneeId, setAssigneeId] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  /* -------- Load data -------- */
  useEffect(() => {
    async function loadData() {
      const [taskRes, usersRes] = await Promise.all([
        fetch(`/api/admin/tasks/${id}`),
        fetch(`/api/admin/users`),
      ]);

      const taskData = await taskRes.json();
      const usersData = await usersRes.json();

      setTask(taskData);
      setUsers(usersData);

      setPriority(taskData.priority ?? "MEDIUM");
      setAssigneeId(taskData.assignee?.id ?? "");
      setDueDate(taskData.dueDate ? taskData.dueDate.split("T")[0] : "");
      setComments(taskData.comments ?? []);
    }

    loadData();
  }, [id]);

  /* -------- Add comment -------- */
  async function handleAddComment() {
    if (!newComment.trim()) return;

    setCommentLoading(true);

    const res = await fetch(`/api/tasks/${id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newComment }),
    });

    const created = await res.json();
    setComments((prev) => [...prev, created]);
    setNewComment("");
    setCommentLoading(false);
  }

  /* -------- Save task changes -------- */
  async function handleSaveChanges() {
    setSaving(true);

    await fetch(`/api/admin/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        priority,
        assigneeId: assigneeId || null,
        dueDate: dueDate || null,
      }),
    });

    setSaving(false);
    setIsDirty(false);
  }

  if (!task) return <p className="text-gray-400 px-6">Loading…</p>;

  return (
    <div className="min-h-screen bg-[#0f0f0f] px-6 py-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* TASK CARD */}
        <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
          <CardContent className="p-6 space-y-6">

            {/* TITLE + PRIORITY */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-6">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500">Task</p>
                <p className="text-white text-xl font-semibold truncate">
                  {task.title}
                </p>
              </div>

              <div className="flex flex-col items-start sm:items-end shrink-0">
                <p className="text-xs text-gray-500 mb-2">Priority</p>
                <div className="flex gap-2">
                  {(["LOW", "MEDIUM", "HIGH"] as TaskPriority[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        setPriority(p);
                        setIsDirty(true);
                      }}
                      className={`px-4 py-1.5 rounded-full text-xs font-medium border transition
                        ${
                          priority === p
                            ? priorityStyles[p]
                            : "border-[#2a2a2a] text-gray-400 hover:bg-[#1f1f1f]"
                        }`}
                    >
                      {p.charAt(0) + p.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* CLIENT */}
            <div>
              <p className="text-xs text-gray-500">Client</p>
              <p className="text-gray-300">
                {task.project?.owner?.name ||
                  task.project?.owner?.email ||
                  "Unknown"}
              </p>
            </div>

            {/* ASSIGN + DUE DATE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

  {/* ASSIGN TO */}
  <div className="space-y-1.5">
    <label className="text-xs font-medium text-gray-400">
      Assign To
    </label>

    <div className="relative">
      <select
        value={assigneeId}
        onChange={(e) => {
          setAssigneeId(e.target.value);
          setIsDirty(true);
        }}
        className="
          w-full appearance-none
        s   border border-[#2a2a2a]
          rounded-lg
          px-4 py-2.5
          text-sm text-white
          shadow-sm
          transition
          bg-black
          hover:border-[#3a3a3a]
          focus:outline-none
          focus:ring-1 focus:ring-orange-500
        "
      >
        <option value="">Unassigned</option>
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.name ?? u.email}
          </option>
        ))}
      </select>


    </div>
  </div>

  {/* DUE DATE */}
  <div className="space-y-1.5">
    <label className="text-xs font-medium text-gray-400">
      Due Date
    </label>

    <input
      type="date"
      value={dueDate}
      onChange={(e) => {
        setDueDate(e.target.value);
        setIsDirty(true);
      }}
      className="
        w-full
        bg-[#121212]
        border border-[#2a2a2a]
        rounded-lg
        px-4 py-2.5
        text-sm text-white
        shadow-sm
        transition
        bg-black
        hover:border-[#3a3a3a]
        focus:outline-none
        focus:ring-1 focus:ring-orange-500
      "
    />
  </div>

</div>


               {/* SAVE CHANGES */}
        <div className="flex justify-end">
          <Button
            onClick={handleSaveChanges}
            disabled={!isDirty || saving}
            className="min-w-[160px] bg-gradient-to-r from-[#FF0A0A] to-[#FF7A1A] text-white disabled:opacity-40"
          >
            {saving ? "Saving…" : isDirty ? "Save Changes" : "Add changes"}
          </Button>
        </div>

          </CardContent>
        </Card>


        {/* COMMENTS */}
        <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-white font-medium">Comments</h3>

            {comments.map((c) => (
              <div
                key={c.id}
                className="bg-[#121212] border border-[#2a2a2a] rounded-lg p-4"
              >
                <p className="text-sm text-gray-300">{c.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {c.user.name ?? c.user.email} ·{" "}
                  {new Date(c.createdAt).toLocaleString()}
                </p>
              </div>
            ))}

            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a note for the team…"
              rows={3}
              className="w-full bg-[#0f0f0f] border border-[#2a2a2a] rounded-md px-3 py-2 text-sm text-white"
            />

            <div className="flex justify-end gap-3">
            <Button
  onClick={handleAddComment}
  disabled={commentLoading}
  className="min-w-[140px] bg-gradient-to-r from-[#FF0A0A] to-[#FF7A1A] text-white disabled:opacity-40"
>
  {commentLoading ? "Adding…" : "Add Comment"}
</Button>

            </div>
          </CardContent>
        </Card>

     

      </div>
    </div>
  );
}
