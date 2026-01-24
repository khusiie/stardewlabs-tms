// app/api/admin/team/route.ts

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const members = await prisma.user.findMany({
      include: {
        _count: { select: { tasks: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(members);
  } catch (error) {
    console.error("Failed to fetch admin team:", error);
    return NextResponse.json(
      { message: "Failed to load team members" },
      { status: 500 }
    );
  }
}
