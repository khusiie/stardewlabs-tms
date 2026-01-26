import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  // ✅ Await params
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

  if (!id) {
    return NextResponse.json(
      { error: "Task ID is required" },
      { status: 400 }
    );
  }

  try {
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        assignee: {
          select: { name: true, email: true },
        },
        project: {
          include: {
            owner: {
              select: { name: true, email: true },
            },
          },
        },
        comments: {
          include: {
            user: {
              select: { name: true, email: true },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!task) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(task);
  } catch (err) {
    console.error("Admin task view error:", err);
    return NextResponse.json(
      { error: "Failed to fetch task" },
      { status: 500 }
    );
  }
}
