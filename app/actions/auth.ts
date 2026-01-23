"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

export async function signupAction(email: string, password: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw new Error(error.message);
  if (!data.user) throw new Error("User not created");

  await prisma.user.create({
    data: {
      id: data.user.id,
      email: data.user.email!,
      role: "CLIENT",
    },
  });

  // return the user so the client can sign in
  return data.user;
}

/*"use server";


import { prisma } from "@/app/lib/prisma";
import { createClient } from "@supabase/supabase-js";

export async function signupAction(email: string, password: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw new Error(error.message);
  if (!data.user) throw new Error("User not created");

  await prisma.user.create({
    data: {
      id: data.user.id,
      email: data.user.email!,
      role: "CLIENT",
    },
  });

  return { success: true };
}
*/