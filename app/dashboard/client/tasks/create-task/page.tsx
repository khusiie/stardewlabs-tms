import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/getCurrentUser";
import CreateTaskForm from "@/components/client/CreateTaskForm";

export default async function CreateTaskPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  return <CreateTaskForm />;
}
