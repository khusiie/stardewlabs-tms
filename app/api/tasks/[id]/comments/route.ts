export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSupabaseServer } from "@/lib/supabase/server";

/* -------------------------------------------------
   POST: Add a comment to a task
   Allowed: Admin | Task Creator | Assignee
-------------------------------------------------- */
export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ FIX: await params (Next 16 safe)
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Task ID missing" },
        { status: 400 }
      );
    }

    // 🔐 Supabase auth
    const supabase = await getSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 📝 Read body
    const { content }: { content: string } = await req.json();
    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "Comment content is required" },
        { status: 400 }
      );
    }

    // 📌 Load task permissions
    const task = await prisma.task.findUnique({
      where: { id },
      select: {
        assigneeId: true,
        project: {
          select: {
            ownerId: true,
          },
        },
      },
    });

    if (!task) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    // 🔐 Permission check
    const isCreator = task.project.ownerId === user.id;
    const isAssignee = task.assigneeId === user.id;

    // OPTIONAL: Admin check (if you store role in DB)
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    });

    const isAdmin = dbUser?.role === "ADMIN";

    if (!isAdmin && !isCreator && !isAssignee) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // 💾 Create comment
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
  } catch (error) {
    console.error("POST /tasks/[id]/comments error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
