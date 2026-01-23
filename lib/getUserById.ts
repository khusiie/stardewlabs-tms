import { prisma } from "./prisma";

export async function getUserById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
  });
}
