import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TaskStatus } from "@prisma/client";
import { getSupabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [total, pending, inProgress, completed] = await Promise.all([
    prisma.task.count({
      where: {
        project: { ownerId: user.id },
      },
    }),
    prisma.task.count({
      where: {
        project: { ownerId: user.id },
        status: TaskStatus.PENDING,
      },
    }),
    prisma.task.count({
      where: {
        project: { ownerId: user.id },
        status: TaskStatus.IN_PROGRESS,
      },
    }),
    prisma.task.count({
      where: {
        project: { ownerId: user.id },
        status: TaskStatus.COMPLETED,
      },
    }),
  ]);

  return NextResponse.json({
    total,
    pending,
    inProgress,
    completed,
  });
}
