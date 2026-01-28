"use server";

import { query } from "@/lib/db";
import { redirect } from "next/navigation";

type RegisterState = {
  success: boolean;
  message: string;
};

export async function registerAction(
  prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  // Input dari form tetap "name" (sesuai attribute name di input HTML)
  const name = formData.get("name") as string;
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!name || !username || !password) {
    return { success: false, message: "Semua data wajib diisi!" };
  }

  try {
    const existingUser = await query(
      "SELECT * FROM users WHERE username = $1",
      [username],
    );

    if (existingUser.rows.length > 0) {
      return { success: false, message: "Username sudah terpakai." };
    }

    // PERBAIKAN: Gunakan 'full_name' sesuai kolom database Anda
    await query(
      "INSERT INTO users (full_name, username, password, role) VALUES ($1, $2, $3, 'Relawan')",
      [name, username, password],
    );
  } catch (error) {
    console.error("Register Error:", error);
    return { success: false, message: "Gagal mendaftar (Database Error)." };
  }

  redirect("/");
}
