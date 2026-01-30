export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSupabaseServer } from "@/lib/supabase/server";

/* ---------------------------------------
   GET: Client Tasks (created / assigned)
---------------------------------------- */
export async function GET(req: Request) {
  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type"); // assigned | null

  const where =
    type === "assigned"
      ? { assigneeId: user.id }
      : { project: { ownerId: user.id } };

  const tasks = await prisma.task.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      status: true,
      dueDate: true,
    },
  });

  return NextResponse.json(tasks);
}

/* ---------------------------------------
   POST: Create task (CLIENT)
---------------------------------------- */
export async function POST(req: Request) {
  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const {
    title,
    description,
    note,
    dueDate,
    priority = "MEDIUM",
    links = [],
    uploadedFileIds = [],
  } = await req.json();

  if (!title || !title.trim()) {
    return NextResponse.json(
      { error: "Title is required" },
      { status: 400 }
    );
  }

  // 🔹 Ensure client has a project
  let project = await prisma.project.findFirst({
    where: { ownerId: user.id },
  });

  if (!project) {
    project = await prisma.project.create({
      data: {
        name: "My First Project",
        ownerId: user.id,
      },
    });
  }

  // 🔹 Create task with links
  const task = await prisma.task.create({
    data: {
      title,
      description,
      note,
      links,
      dueDate: dueDate ? new Date(dueDate) : null,
      priority,
      status: "PENDING",
      projectId: project.id,
    },
  });

if (uploadedFileIds.length > 0) {
  const result = await prisma.taskFile.updateMany({
    where: {
      id: { in: uploadedFileIds },
    },
    data: {
      taskId: task.id,
    },
  });

  console.log("TASK CREATE → files attached:", result.count);
}

  console.log("TASK CREATE → uploadedFileIds:", uploadedFileIds);


  return NextResponse.json(task, { status: 201 });
}
