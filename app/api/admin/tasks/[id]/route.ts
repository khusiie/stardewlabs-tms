import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSupabaseServer } from "@/lib/supabase/server";

/* ---------------- GET TASK ---------------- */
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

  if (user.app_metadata?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const task = await prisma.task.findUnique({
    where: { id },
    include: {
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      project: {
        include: {
          owner: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
      comments: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "asc" },
      },
      files: {
        select: {
          id: true,
          name: true,
          url: true,
        },
      },
    },
  });

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  return NextResponse.json(task);
}

/* ---------------- UPDATE TASK ---------------- */
export async function PATCH(
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

  const { priority, assigneeId, dueDate } = await req.json();

  const existingTask = await prisma.task.findUnique({
    where: { id },
    select: { assigneeId: true },
  });

  if (!existingTask) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  const isAdmin = user.app_metadata?.role === "ADMIN";
  const isAssignee = existingTask.assigneeId === user.id;

  if (!isAdmin && !isAssignee) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updatedTask = await prisma.task.update({
    where: { id },
    data: {
      priority: priority ?? undefined,
      assigneeId: assigneeId ?? null,
      dueDate: dueDate ? new Date(dueDate) : null,
    },
    include: {
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      project: {
        include: {
          owner: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
      comments: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "asc" },
      },
      files: {
        select: {
          id: true,
          name: true,
          url: true,
        },
      },
    },
  });

  return NextResponse.json(updatedTask);
}
