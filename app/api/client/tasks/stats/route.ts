import { NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/getCurrentUser";
import { prisma } from "@/app/lib/prisma";
import { TaskStatus } from "@prisma/client";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const [total, pending, inProgress, completed] =
    await Promise.all([
      prisma.task.count({
        where: { assigneeId: user.id },
      }),
      prisma.task.count({
        where: {
          assigneeId: user.id,
          status: TaskStatus.PENDING,
        },
      }),
      prisma.task.count({
        where: {
          assigneeId: user.id,
          status: TaskStatus.IN_PROGRESS,
        },
      }),
      prisma.task.count({
        where: {
          assigneeId: user.id,
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
