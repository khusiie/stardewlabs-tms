"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ---------------------------------------
   Helper: Upload single file
---------------------------------------- */
async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("File upload failed");
  }

  return res.json(); // { name, url }
}

export default function CreateTaskForm() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Optional fields
  const [files, setFiles] = useState<File[]>([]);
  const [links, setLinks] = useState<string[]>([]);
  const [showLinks, setShowLinks] = useState(false);
  const [note, setNote] = useState("");
  const [priority, setPriority] = useState("MEDIUM");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---------------------------------------
     Submit Handler
  ---------------------------------------- */
  const handleSubmit = async () => {
    setError("");

    if (!title.trim()) {
      setError("Task title is required");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Upload files first
      const uploadedFiles =
        files.length > 0
          ? await Promise.all(files.map(uploadFile))
          : [];

      // 2️⃣ Create task
      const res = await fetch("/api/client/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          dueDate: dueDate || null,
          priority,
          note,                 // 👈 correct field
          links,
          files: uploadedFiles, // 👈 uploaded files
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create task");
      }

      router.push("/dashboard/client/tasks/my-task");
      router.refresh();
    } catch (err) {
      setError("Failed to create task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
        <CardContent className="p-6 space-y-6">
          {/* Title */}
          <Input
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-[#111] border-[#2a2a2a] text-white"
          />

          {/* Description */}
          <Textarea
            placeholder="Task description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-[#111] border-[#2a2a2a] text-white min-h-[120px]"
          />

          {/* File Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">
              Attach files (optional)
            </label>
            <Input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              onChange={(e) =>
                e.target.files && setFiles(Array.from(e.target.files))
              }
              className="bg-[#111] border-[#2a2a2a] text-white"
            />
            {files.length > 0 && (
              <ul className="text-sm text-gray-400 space-y-1">
                {files.map((file, i) => (
                  <li key={i}>📎 {file.name}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Reference Links */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setShowLinks(!showLinks)}
              className="text-sm text-orange-400 hover:text-orange-300"
            >
              ➕ Add reference links
            </button>

            {showLinks && (
              <div className="space-y-2">
                {links.map((link, index) => (
                  <Input
                    key={index}
                    placeholder="https://example.com"
                    value={link}
                    onChange={(e) => {
                      const updated = [...links];
                      updated[index] = e.target.value;
                      setLinks(updated);
                    }}
                    className="bg-[#111] border-[#2a2a2a] text-white"
                  />
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLinks([...links, ""])}
                  className="border-[#2a2a2a] text-gray-300 bg-[#111]"
                >
                  + Add another link
                </Button>
              </div>
            )}
          </div>

          {/* Due Date + Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">
                Due Date
              </label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-[#111] border-[#2a2a2a] text-white"
              />
            </div>

           <div className="space-y-2">
  <label className="text-sm font-medium text-gray-400">
    Priority
  </label>
<Select value={priority} onValueChange={setPriority}>
  <SelectTrigger
    className="bg-[#111] border-[#2a2a2a] text-white"
  >
    <SelectValue placeholder="Select priority" />
  </SelectTrigger>

  <SelectContent
    side="bottom"
    align="start"
    sideOffset={6}
    className="
      bg-[#0f0f0f]
      border border-[#2a2a2a]
      rounded-lg
      shadow-xl
      w-[--radix-select-trigger-width]
    "
  >
    <SelectItem value="LOW">Low</SelectItem>
    <SelectItem value="MEDIUM">Medium</SelectItem>
    <SelectItem value="HIGH">High</SelectItem>
  </SelectContent>
</Select>

</div>

          </div>

          {/* Notes */}
          <Textarea
            placeholder="Comments / personal notes (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="bg-[#111] border-[#2a2a2a] text-white min-h-[100px]"
          />

          {/* Error */}
          {error && <p className="text-sm text-red-400">{error}</p>}

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              disabled={loading}
              onClick={handleSubmit}
              className="
                bg-gradient-to-r from-[#FF2A1A] to-[#FF8A2A]
                hover:from-[#E51919] hover:to-[#FF9A3A]
                text-white font-semibold
                px-6 py-2.5 rounded-lg
                shadow-lg shadow-orange-500/30
                transition-all active:scale-95
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
                text-gray-300 bg-[#111]
                hover:bg-[#1f1f1f] hover:text-white
                px-6 py-2.5 rounded-lg
                transition-all active:scale-95
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
