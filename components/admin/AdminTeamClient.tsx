// app/dashboard/admin/team/AdminTeamClient.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Member = {
  id: string;
  name: string | null;
  email: string;
  role: "ADMIN" | "CLIENT";
  _count: {
    tasks: number;
  };
};

export default function AdminTeamClient() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMembers() {
      try {
        const res = await fetch("/api/admin/team");
        if (!res.ok) throw new Error("Failed to fetch team");
        const data = await res.json();
        setMembers(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load team members");
      } finally {
        setLoading(false);
      }
    }

    loadMembers();
  }, []);

  if (loading) return <p className="text-gray-400">Loading…</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  return (
    <div className="min-h-screen bg-[#0f0f0f] px-6 py-6 space-y-8">
      {members.length === 0 ? (
        <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
          <CardContent className="p-10 text-center text-gray-400">
            No team members found.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {members.map((member) => (
            <Card
              key={member.id}
              className="bg-[#1a1a1a] border-[#2a2a2a] hover:border-[#FF7A1A]/40 transition"
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#FF0A0A] to-[#FF7A1A] flex items-center justify-center text-white font-semibold">
                    {member.name?.charAt(0) ??
                      member.email.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <p className="text-white font-medium">
                      {member.name ?? "Unnamed User"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {member.email}
                    </p>
                  </div>
                </div>

                <div className="text-xs text-gray-400">
                  Tasks:{" "}
                  <span className="text-white font-medium">
                    {member._count.tasks}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs px-3 py-1 rounded-full border ${
                      member.role === "ADMIN"
                        ? "border-red-500/30 text-red-400 bg-red-500/10"
                        : "border-blue-500/30 text-blue-400 bg-blue-500/10"
                    }`}
                  >
                    {member.role}
                  </span>

                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-[#FF0A0A] to-[#FF7A1A] text-white"
                  >
                    Manage Member
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
