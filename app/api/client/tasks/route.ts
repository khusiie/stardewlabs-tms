export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSupabaseServer } from "@/lib/supabase/server";

/* ---------------------------------------
   GET: Client's tasks
---------------------------------------- */
export async function GET() {
  const supabase = await getSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tasks = await prisma.task.findMany({
    where: {
      project: {
        ownerId: user.id,
      },
    },
    orderBy: { createdAt: "desc" },
    include: {
      files: true,
      comments: true,
    },
  });

  return NextResponse.json(tasks);
}

/* ---------------------------------------
   POST: Create task (CLIENT)
---------------------------------------- */
export async function POST(req: Request) {
  const supabase = await getSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const {
    title,
    description,
    note,
    dueDate,
    priority = "MEDIUM",
    links = [],
    files = [], // 👈 NEW
  } = await req.json();

  if (!title || !title.trim()) {
    return NextResponse.json(
      { error: "Title is required" },
      { status: 400 }
    );
  }

  // clean links
  const cleanedLinks = Array.isArray(links)
    ? links.filter((l) => typeof l === "string" && l.startsWith("http"))
    : [];

  // validate files
  const cleanedFiles = Array.isArray(files)
    ? files.filter(
        (f) =>
          f &&
          typeof f.name === "string" &&
          typeof f.url === "string"
      )
    : [];

  // find or create project
  let project = await prisma.project.findFirst({
    where: { ownerId: user.id },
  });

  if (!project) {
    project = await prisma.project.create({
      data: {
        name: "My First Project",
        ownerId: user.id,
      },
    });
  }

  // create task + files in one transaction
  const task = await prisma.task.create({
    data: {
      title,
      description,
      note,
      dueDate: dueDate ? new Date(dueDate) : null,
      priority,
      links: cleanedLinks,
      status: "PENDING",
      projectId: project.id,
      assigneeId: null,

      files: {
        create: cleanedFiles.map((file) => ({
          name: file.name,
          url: file.url,
        })),
      },
    },
    include: {
      files: true,
    },
  });

  return NextResponse.json(task, { status: 201 });
}
