// app/dashboard/admin/settings/page.tsx

import AdminSettingsClient from "../../../../components/admin/AdminSettingsClient";

export const dynamic = "force-dynamic"; // admin pages should be dynamic

export default function AdminSettingsPage() {
  return <AdminSettingsClient />;
}
