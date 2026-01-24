// app/dashboard/admin/team/page.tsx

export const dynamic = "force-dynamic";
export const revalidate = 60; // optional caching (recommended)

import { prisma } from "@/lib/prisma";
import AdminTeamClient from "../../../../components/admin/AdminTeamClient";

export default async function AdminTeamPage() {
  const members = await prisma.user.findMany({
    include: {
      _count: {
        select: { tasks: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return <AdminTeamClient members={members} />;
}
