import { prisma } from "@/lib/prisma";

/**
 * Get client dashboard stats
 * Auth is guaranteed by middleware
 * userId === assigneeId
 */
export async function getClientTaskStats(userId: string) {
  const [total, pending, inProgress, completed] = await Promise.all([
    prisma.task.count({
      where: { assigneeId: userId },
    }),
    prisma.task.count({
      where: { assigneeId: userId, status: "PENDING" },
    }),
    prisma.task.count({
      where: { assigneeId: userId, status: "IN_PROGRESS" },
    }),
    prisma.task.count({
      where: { assigneeId: userId, status: "COMPLETED" },
    }),
  ]);

  return {
    total,
    pending,
    inProgress,
    completed,
  };
}

/**
 * Get recent client tasks
 */
export async function getClientTasks(
  userId: string,
  limit = 5
) {
  return prisma.task.findMany({
    where: { assigneeId: userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
