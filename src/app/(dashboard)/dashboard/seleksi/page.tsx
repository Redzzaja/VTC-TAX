import { cookies } from "next/headers";
import { getVolunteerStatusAction } from "@/actions/relawan-action";
import { redirect } from "next/navigation";
import SelectionTestPage from "@/components/SelectionTest";

export default async function Page() {
  const cookieStore = await cookies();
  const session = cookieStore.get("user_session");
  const user = session ? JSON.parse(session.value) : null;

  if (!user) redirect("/");

  // Verify Eligibility
  const statusRes = await getVolunteerStatusAction(user.username);
  const volunteer = statusRes.success ? statusRes.data : null;

  // Conditions to take test:
  // 1. Registered (volunteer exists)
  // 2. Approved (status = 'DITERIMA' or similar, check logic)
  // 3. Not Taken Yet (test_taken_at is null)

  if (!volunteer) {
    redirect("/dashboard/relawan"); // Not registered
  }

  if (volunteer.status !== "DITERIMA") {
     // If rejected or pending, user shouldn't be here
     redirect("/dashboard/relawan");
  }

  if (volunteer.test_taken_at) {
      // Already taken
      redirect("/dashboard/relawan");
  }

  return <SelectionTestPage user={user} />;
}
