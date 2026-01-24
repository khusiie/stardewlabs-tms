export const runtime = "nodejs";

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error"],
  });

(async () => {
  const result = await prisma.$queryRawUnsafe(`select current_user;`);
  console.log("🔍 ACTUAL DB USER:", result);
})();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}


