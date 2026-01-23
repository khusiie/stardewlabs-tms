"use client";

import { useEffect, useState } from "react";
import { supabase } from "./client";

type AuthUser = {
  userId: string | null;
  email: string | null;
  name: string | null;
  loading: boolean;
};

export function useAuthUser(): AuthUser {
  const [state, setState] = useState<AuthUser>({
    userId: null,
    email: null,
    name: null,
    loading: true,
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setState({
        userId: data.user?.id ?? null,
        email: data.user?.email ?? null,
        name:
          (data.user?.user_metadata?.name as string | undefined) ??
          null,
        loading: false,
      });
    });
  }, []);

  return state;
}
