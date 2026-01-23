import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/getCurrentUser";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export default async function AdminSettingsPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/auth/login");
  }

  // 🔥 Page-only themed switch (no global changes)
  const themedSwitch =
    "border border-[#2a2a2a] \
     data-[state=checked]:bg-gradient-to-r \
     data-[state=checked]:from-[#FF0A0A] \
     data-[state=checked]:to-[#FF7A1A] \
     data-[state=unchecked]:bg-[#1a1a1a]";

  return (
    <div className="space-y-10 min-h-screen bg-[#0f0f0f] px-6 py-6">
   
      {/* Application */}
      <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
        <CardContent className="p-6 space-y-6">
          <h2 className="text-lg font-medium text-white">
            Application
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-400">
                Application Name
              </label>
              <Input
                disabled
                defaultValue="StardewLabs"
                className="
                  mt-1
                  bg-[#0f0f0f]
                  border-[#2a2a2a]
                  text-gray-300
                "
              />
            </div>

            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-white">
                  Maintenance Mode
                </p>
                <p className="text-xs text-gray-500">
                  Temporarily disable user access
                </p>
              </div>
              <Switch className={themedSwitch} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Preferences */}
      <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
        <CardContent className="p-6 space-y-6">
          <h2 className="text-lg font-medium text-white">
            Admin Preferences
          </h2>

          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-white">
                Email Notifications
              </p>
              <p className="text-xs text-gray-500">
                Receive system alerts
              </p>
            </div>
            <Switch defaultChecked className={themedSwitch} />
          </div>

          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-white">
                Activity Logs
              </p>
              <p className="text-xs text-gray-500">
                Track admin actions
              </p>
            </div>
            <Switch defaultChecked className={themedSwitch} />
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
        <CardContent className="p-6 space-y-6">
          <h2 className="text-lg font-medium text-white">
            Security
          </h2>

          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-white">
                Two-Factor Authentication
              </p>
              <p className="text-xs text-gray-500">
                Require 2FA for admins
              </p>
            </div>
            <Switch className={themedSwitch} />
          </div>

          <div className="pt-2">
 <Button
  size="sm"
  className="
    bg-gradient-to-r from-[#FF0A0A] to-[#FF7A1A]
    hover:from-[#E50909] hover:to-[#FF8A2A]
    text-white
    shadow-md shadow-red-500/20
  "
>
  Reset Admin Password
</Button>

          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="bg-[#1a1a1a] border border-red-500/20">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-medium text-red-400">
            Danger Zone
          </h2>

          <p className="text-sm text-gray-400">
            These actions are irreversible.
          </p>

        <Button
  size="sm"
className="

  bg-red-500/20
  border border-red-500/40
  text-red-400
  hover:bg-red-600/40
  hover:border-red-500/60
  hover:text-red-300
  transition-colors
"

>
  Delete All Tasks
</Button>

        </CardContent>
      </Card>
    </div>
  );
}
