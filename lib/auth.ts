import { prisma } from "./prisma";

/**
 * Middleware already guarantees authentication.
 * This helper only fetches a user by ID.
 */
export async function requireUserById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
  });
}
