import { headers } from "next/headers";

export async function getClientTaskStats() {
  const headersList = await headers();

  const host = headersList.get("host");
  const cookie = headersList.get("cookie"); // 🔑 THIS IS THE FIX

  const protocol =
    process.env.NODE_ENV === "development"
      ? "http"
      : "https";

  const res = await fetch(
    `${protocol}://${host}/api/client/tasks/stats`,
    {
      headers: {
        cookie: cookie ?? "", // ✅ forward auth cookies
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch task stats");
  }

  return res.json();
}

export async function getClientTasks(limit = 5) {
  const headersList = await headers();
  const host = headersList.get("host");
  const cookie = headersList.get("cookie");

  const protocol =
    process.env.NODE_ENV === "development"
      ? "http"
      : "https";

  const res = await fetch(
    `${protocol}://${host}/api/client/tasks`,
    {
      headers: {
        cookie: cookie ?? "",
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch tasks");
  }

  const tasks = await res.json();

  return tasks.slice(0, limit);
}