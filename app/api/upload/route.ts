import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const ext = file.name.split(".").pop();
    const storageFileName = `${randomUUID()}.${ext}`;

    // 1️⃣ Upload to Supabase Storage
    const { error } = await supabase.storage
      .from("task-files")
      .upload(storageFileName, file, {
        contentType: file.type,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 2️⃣ Get public URL
    const { data } = supabase.storage
      .from("task-files")
      .getPublicUrl(storageFileName);

    // 3️⃣ 🔥 Save metadata in DB
    const fileRecord = await prisma.taskFile.create({
      data: {
        name: file.name,
        url: data.publicUrl,
        taskId: null, // attach later
      },
    });
    console.log("UPLOAD → TaskFile created:", fileRecord);


    // 4️⃣ Return DB-backed ID
    return NextResponse.json({
      fileId: fileRecord.id,
      name: file.name,
      url: data.publicUrl,
    });
  } catch (err) {
    console.error("Upload failed:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
