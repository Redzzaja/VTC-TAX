import LandingPage from "@/components/LandingPage";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  // Redirect logged-in users to dashboard
  const cookieStore = await cookies();
  const session = cookieStore.get("user_session");
  if (session) {
    redirect("/dashboard");
  }

  return <LandingPage />;
}
