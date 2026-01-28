export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (user.app_metadata?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type"); // 👈 recent | null

  const rawTasks = await prisma.task.findMany({
    orderBy: { createdAt: "desc" },
    take: type === "recent" ? 5 : undefined, // 👈 magic line
    include: {
      project: {
        include: { owner: true },
      },
      assignee: true,
    },
  });

  const tasks = rawTasks.map((task) => ({
    id: task.id,
    title: task.title,
    status: task.status,
    dueDate: task.dueDate,
    assignee: task.assignee
      ? {
          name: task.assignee.name,
          email: task.assignee.email,
        }
      : null,
    client: {
      name: task.project.owner.name,
      email: task.project.owner.email,
    },
  }));

  return NextResponse.json(tasks);
}
