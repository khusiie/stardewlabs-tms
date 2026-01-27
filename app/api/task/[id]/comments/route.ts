import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSupabaseServer } from "@/lib/supabase/server";

/* ---------------- GET COMMENTS ---------------- */
export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const task = await prisma.task.findUnique({
    where: { id },
    select: {
      assigneeId: true,
    },
  });

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  const isAdmin = user.app_metadata?.role === "ADMIN";
  const isAssignee = task.assigneeId === user.id;

  if (!isAdmin && !isAssignee) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const comments = await prisma.comment.findMany({
    where: { taskId: id },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          role: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(comments);
}

/* ---------------- ADD COMMENT ---------------- */
export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { content } = await req.json();

  if (!content?.trim()) {
    return NextResponse.json(
      { error: "Comment cannot be empty" },
      { status: 400 }
    );
  }

  const task = await prisma.task.findUnique({
    where: { id },
    select: {
      assigneeId: true,
    },
  });

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  const isAdmin = user.app_metadata?.role === "ADMIN";
  const isAssignee = task.assigneeId === user.id;

  if (!isAdmin && !isAssignee) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const comment = await prisma.comment.create({
    data: {
      content,
      taskId: id,
      userId: user.id,
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  return NextResponse.json(comment);
}
