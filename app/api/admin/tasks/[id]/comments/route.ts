export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSupabaseServer } from "@/lib/supabase/server";
import { CommentType } from "@prisma/client";

/* -------------------------------------------------
   INTERNAL COMMENTS (Admin ↔ Assignee ONLY)
-------------------------------------------------- */

/* =========================
   GET: Load INTERNAL comments
   ========================= */
export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ✅ FIX

    if (!id) {
      return NextResponse.json(
        { error: "Task ID missing" },
        { status: 400 }
      );
    }

    const supabase = await getSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const task = await prisma.task.findUnique({
      where: { id },
      select: { assigneeId: true },
    });

    if (!task) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    });

    const isAdmin = dbUser?.role === "ADMIN";
    const isAssignee = task.assigneeId === user.id;

    if (!isAdmin && !isAssignee) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const comments = await prisma.comment.findMany({
      where: {
        taskId: id,
        type: CommentType.INTERNAL,
      },
      orderBy: { createdAt: "asc" },
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

    return NextResponse.json(comments);
  } catch (error) {
    console.error("GET internal comments error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/* =========================
   POST: Add INTERNAL comment
   ========================= */
export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ✅ FIX

    if (!id) {
      return NextResponse.json(
        { error: "Task ID missing" },
        { status: 400 }
      );
    }

    const supabase = await getSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { content }: { content: string } = await req.json();

    if (!content?.trim()) {
      return NextResponse.json(
        { error: "Comment content is required" },
        { status: 400 }
      );
    }

    const task = await prisma.task.findUnique({
      where: { id },
      select: { assigneeId: true },
    });

    if (!task) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    });

    const isAdmin = dbUser?.role === "ADMIN";
    const isAssignee = task.assigneeId === user.id;

    if (!isAdmin && !isAssignee) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        taskId: id,
        userId: user.id,
        type: CommentType.INTERNAL,
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

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("POST internal comment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
