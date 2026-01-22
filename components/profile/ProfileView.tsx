import { Role } from "@prisma/client";

export default function ProfileView({
  email,
  role,
}: {
  email: string;
  role: Role;
}) {
  return (
    <div className="max-w-xl rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] p-6">
      <h2 className="text-lg font-semibold text-white mb-4">
        Profile Information
      </h2>

      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-400">Email</p>
          <p className="text-white">{email}</p>
        </div>

        <div>
          <p className="text-sm text-gray-400">Role</p>
          <p className="text-white">{role}</p>
        </div>
      </div>

      {/* Admin-only section */}
      {role === Role.ADMIN && (
        <div className="mt-6 border-t border-[#2a2a2a] pt-4">
          <h3 className="text-sm font-semibold text-white mb-2">
            Admin Settings
          </h3>
          <p className="text-sm text-gray-400">
            Manage system-level settings.
          </p>
        </div>
      )}
    </div>
  );
}