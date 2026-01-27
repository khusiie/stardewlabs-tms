import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  // ✅ FIX: await params
  const { id } = await context.params;

  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const task = await prisma.task.findUnique({
    where: { id }, // ✅ id is now defined
    include: {
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
      assignee: {
        select: {
          name: true,
          email: true,
        },
      },
      files: {
        select: {
          id: true,
          name: true,
          url: true,
        },
        orderBy: { createdAt: "asc" },
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
    },
  });

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  // 🔐 Client can only view their own task
  if (task.project.owner.email !== user.email) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(task);
}
