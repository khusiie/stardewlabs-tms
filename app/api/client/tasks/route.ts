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

  // ✅ Auth check ONLY
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
  } = await req.json();

  if (!title?.trim()) {
    return NextResponse.json(
      { error: "Title is required" },
      { status: 400 }
    );
  }

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

  const task = await prisma.task.create({
    data: {
      title,
      description,
      note,
      dueDate: dueDate ? new Date(dueDate) : null,
      priority,
      status: "PENDING",
      projectId: project.id,
    },
  });

  return NextResponse.json(task, { status: 201 });
}
