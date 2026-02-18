import { cookies } from "next/headers";
import AdminDashboard from "@/components/AdminDashboard";
import UserDashboard from "@/components/UserDashboard";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("user_session");
  const user = session ? JSON.parse(session.value) : null;
  const role = user?.role || "user";

  if (role === "admin") {
    return <AdminDashboard />;
  }

  return <UserDashboard />;
}
