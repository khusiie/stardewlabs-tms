"use server";

import { prisma } from "@/lib/prisma";


export async function getAdminTaskStats() {
  const [total, pending, inProgress, completed] = await Promise.all([
    prisma.task.count(),
    prisma.task.count({ where: { status: "PENDING" } }),
    prisma.task.count({ where: { status: "IN_PROGRESS" } }),
    prisma.task.count({ where: { status: "COMPLETED" } }),
  ]);

  return { total, pending, inProgress, completed };
}

// ✅ Admin task list
export async function getAllTasks(limit?: number) {
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

// ✅ Update task status
export async function updateTaskStatus({
  taskId,
  status,
}: {
  taskId: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
}) {
  await prisma.task.update({
    where: { id: taskId },
    data: { status },
  });

  return { success: true };
}
