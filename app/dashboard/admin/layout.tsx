import { requireRole } from "../../lib/requireRole";
import { Role } from "@prisma/client";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole([Role.ADMIN]); 

  return <>{children}</>;
}
