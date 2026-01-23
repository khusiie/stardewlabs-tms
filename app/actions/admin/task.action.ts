"use server";

import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/getCurrentUser";

// ✅ Admin stats
export async function getAdminTaskStats() {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const [total, pending, inProgress, completed] = await Promise.all([
    prisma.task.count(),
    prisma.task.count({ where: { status: "PENDING" } }),
    prisma.task.count({ where: { status: "IN_PROGRESS" } }),
    prisma.task.count({ where: { status: "COMPLETED" } }),
  ]);

  return { total, pending, inProgress, completed };
}

// Admin task list
export async function getAllTasks(limit?: number) {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  return prisma.task.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      assignee: {
        select: { id: true, name: true, email: true },
      },
      project: {
        include: {
          owner: { select: { email: true } },
        },
      },
    },
  });
}

//  Update status (what you already had)
export async function updateTaskStatus({
  taskId,
  status,
}: {
  taskId: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
}) {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.task.update({
    where: { id: taskId },
    data: { status },
  });

  return { success: true };
}
