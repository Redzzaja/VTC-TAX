"use server";

import { query } from "@/lib/db";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

type AuthState = {
  success: boolean;
  message: string;
};

export async function loginAction(
  prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  try {
    const result = await query(
      "SELECT * FROM users WHERE username = $1 AND password = $2",
      [username, password],
    );

    const user = result.rows[0];

    if (!user) {
      return { success: false, message: "Username atau Password salah!" };
    }

    // PERBAIKAN: Mapping 'full_name' dari DB ke property 'name' di session
    const userData = {
      username: user.username,
      name: user.full_name, // <--- Ambil dari full_name
      role: user.role,
    };

    const cookieStore = await cookies();
    cookieStore.set("user_session", JSON.stringify(userData), {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 60 * 60 * 24,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return { success: false, message: "Gagal terhubung ke database." };
  }

  redirect("/dashboard");
}
