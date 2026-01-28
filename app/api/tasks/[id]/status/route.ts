export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSupabaseServer } from "@/lib/supabase/server";

type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  // ✅ FIX: await params
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      { error: "Task ID missing" },
      { status: 400 }
    );
  }

  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { status }: { status: TaskStatus } = await req.json();

  if (!["PENDING", "IN_PROGRESS", "COMPLETED"].includes(status)) {
    return NextResponse.json(
      { error: "Invalid status" },
      { status: 400 }
    );
  }

  const task = await prisma.task.findUnique({
    where: { id },
    select: { assigneeId: true },
  });

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  // 🔒 ONLY ASSIGNEE CAN UPDATE
  if (task.assigneeId !== user.id) {
    return NextResponse.json(
      { error: "Forbidden: not assignee" },
      { status: 403 }
    );
  }

  const updatedTask = await prisma.task.update({
    where: { id },
    data: { status },
    select: {
      id: true,
      status: true,
    },
  });

  return NextResponse.json(updatedTask);
}
