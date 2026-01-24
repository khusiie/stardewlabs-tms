"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthUser } from "@/lib/supabase/useAuthUser";

export default function ClientSettingsClient() {
  const { userId, email, name, loading } = useAuthUser();

  if (loading) return null;
  if (!userId) return null; // middleware already redirected

  return (
    <div className="space-y-8 max-w-4xl">
      <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
        <CardContent className="p-6 space-y-6">
          <h2 className="text-lg font-medium text-white">
            Profile Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400">
                Full Name
              </label>
              <Input
                defaultValue={name ?? ""}
                className="mt-2 bg-[#111] border-[#2a2a2a] text-white"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400">
                Email Address
              </label>
              <Input
                defaultValue={email ?? ""}
                disabled
                className="mt-2 bg-[#111] border-[#2a2a2a] text-gray-400"
              />
            </div>
          </div>

          <Button className="bg-gradient-to-r from-[#FF2A1A] to-[#FF8A2A] text-white">
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
