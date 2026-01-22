import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/getCurrentUser";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default async function ClientSettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Page Header */}
     

      {/* Profile Settings */}
      <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
        <CardContent className="p-6 space-y-6">
          <h2 className="text-lg font-medium text-white">
            Profile Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="text-sm text-gray-400">
                Full Name
              </label>
              <Input
                defaultValue={user.name ?? ""}
                placeholder="Enter your name"
                className="mt-2 bg-[#111] border-[#2a2a2a] text-white"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm text-gray-400">
                Email Address
              </label>
              <Input
                defaultValue={user.email}
                disabled
                className="mt-2 bg-[#111] border-[#2a2a2a] text-gray-400 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4">
            <Button
              className="
                bg-gradient-to-r from-[#FF2A1A] to-[#FF8A2A]
                hover:from-[#E51919] hover:to-[#FF9A3A]
                text-white
                font-semibold
                px-6
                shadow-lg shadow-orange-500/30
                transition-all
                active:scale-95
              "
            >
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security (placeholder for future) */}
      <Card className="bg-[#1a1a1a] border-[#2a2a2a] opacity-60">
        <CardContent className="p-6">
          <h2 className="text-lg font-medium text-white">
            Security
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Password and security settings will be available here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
