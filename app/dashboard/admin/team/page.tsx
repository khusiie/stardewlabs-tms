import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/getCurrentUser";
import { prisma } from "@/app/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function AdminTeamPage() {
    const user = await getCurrentUser();

    if (!user || user.role !== "ADMIN") {
        redirect("/auth/login");
    }

    const members = await prisma.user.findMany({
        include: {
            _count: {
                select: { tasks: true },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="min-h-screen bg-[#0f0f0f] px-6 py-6 space-y-8">


            {/* Members */}
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
                            className="
                bg-[#1a1a1a]
                border-[#2a2a2a]
                hover:border-[#FF7A1A]/40
                hover:shadow-lg hover:shadow-orange-500/5
                transition
              "
                        >
                            <CardContent className="p-6 space-y-4">
                                {/* Top */}
                                <div className="flex items-center gap-4">
                                    {/* Avatar */}
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
                                <div>
                                        <span className="text-xs text-gray-400">
                                    Tasks:{" "}
                                    <span className="text-white font-medium">
                                        {member._count.tasks}
                                    </span>
                                </span>

                                </div>
                            

                                {/* Meta */}
                                <div className="flex items-center justify-between">

                                    <span
                                        className={`text-xs px-3 py-1 rounded-full border
                      ${member.role === "ADMIN"
                                                ? "border-red-500/30 text-red-400 bg-red-500/10"
                                                : "border-blue-500/30 text-blue-400 bg-blue-500/10"
                                            }
                    `}
                                    >
                                        {member.role}
                                    </span>
                                
                                    {/* Action */}
                                    <Button
                                        size="sm"
                                        className="
                    
                    bg-gradient-to-r from-[#FF0A0A] to-[#FF7A1A]
                    hover:from-[#E50909] hover:to-[#FF8A2A]
                    text-white
                    shadow-md shadow-red-500/20
                  "
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
