"use server";

import { getSheetData } from "@/lib/google";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

// Definisikan tipe untuk return value
type AuthState = {
  success: boolean;
  message: string;
};

// PERBAIKAN: Tambahkan parameter `prevState` di argumen pertama
export async function loginAction(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  // 1. Ambil data dari Sheet "User"
  const users = await getSheetData("User!A2:D");

  // 2. Cari User yang cocok
  const user = users.find((row) => row[0] === username && row[1] === password);

  if (!user) {
    // Return object state, bukan redirect langsung jika gagal
    return { success: false, message: "Username atau Password salah!" };
  }

  // 3. Simpan sesi
  const userData = { username: user[0], name: user[2], role: user[3] };

  const cookieStore = await cookies();
  cookieStore.set("user_session", JSON.stringify(userData), {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 60 * 24, // 1 Hari
  });

  // 4. Redirect (Ini akan melempar error "NEXT_REDIRECT" yang normal, biarkan saja)
  redirect("/dashboard");
}
