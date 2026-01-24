import dotenv from "dotenv";
dotenv.config({ path: ".env" }); // 👈 LOAD .env EXPLICITLY

import { createClient } from "@supabase/supabase-js";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL is missing");
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY is missing");
}

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function setAdminRole() {
  const userId = "b026726c-561d-482f-bf48-5f8bcb6fa847"; // 👈 real UUID

  const { data, error } =
    await supabaseAdmin.auth.admin.updateUserById(userId, {
      app_metadata: {
        role: "ADMIN",
      },
    });

  if (error) {
    console.error("❌ Failed:", error.message);
    process.exit(1);
  }

  console.log("✅ Admin role set for user:", data.user.id);
}

setAdminRole();
