import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardShell from "@/components/DashboardShell"; // Import shell baru

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get("user_session");

  if (!session) {
    redirect("/");
  }

  const user = JSON.parse(session.value);

  // Bungkus children dengan Client Component Shell
  return <DashboardShell user={user}>{children}</DashboardShell>;
}
