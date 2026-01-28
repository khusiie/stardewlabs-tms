export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> } // params is a Promise here — await it
) {
  // unwrap params
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json({ error: "Missing task id" }, { status: 400 });
  }

  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // debug help (remove or comment out in production)
  // console.log("GET /api/client/tasks/[id] - id:", id, "user:", user.email, "app_meta:", user.app_metadata);

  // load task with related data
  const task = await prisma.task.findUnique({
    where: { id },
    include: {
      project: {
        include: {
          owner: { select: { id: true, name: true, email: true } },
        },
      },
      assignee: { select: { id: true, name: true, email: true } },
      files: { select: { id: true, name: true, url: true }, orderBy: { createdAt: "asc" } },
      comments: {
        include: { user: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  const isOwner = task.project.owner.email === user.email;
  const isAssignee = task.assignee?.email === user.email;
  const isAdmin = user.app_metadata?.role === "ADMIN";

  if (!isOwner && !isAssignee && !isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(task);
}
