"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logoutAction() {
  // Hapus cookie sesi
  const cookieStore = await cookies();
  cookieStore.delete("user_session");

  // Arahkan kembali ke halaman login
  redirect("/");
}
