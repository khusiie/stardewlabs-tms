import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TaskStatus } from "@prisma/client";

export async function GET() {
  try {
    const [total, pending, inProgress, completed] = await Promise.all([
      prisma.task.count(),
      prisma.task.count({ where: { status: TaskStatus.PENDING } }),
      prisma.task.count({ where: { status: TaskStatus.IN_PROGRESS } }),
      prisma.task.count({ where: { status: TaskStatus.COMPLETED } }),
    ]);

    return NextResponse.json({
      total,
      pending,
      inProgress,
      completed,
    });
  } catch (error) {
    console.error("Admin stats error:", error);

    return NextResponse.json(
      { error: "Failed to fetch task stats" },
      { status: 500 }
    );
  }
}
