"use server";

import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";

// Kita gunakan FormData agar kompatibel dengan 'useActionState' atau <form action>
export async function registerRelawanAction(
  prevState: any,
  formData: FormData,
) {
  try {
    // 1. Ambil data dari FormData
    const nama = formData.get("nama") as string;
    const nim = formData.get("nim") as string;
    const universitas = formData.get("universitas") as string;
    const jurusan = formData.get("jurusan") as string;
    const semester = formData.get("semester") as string;
    const whatsapp = formData.get("whatsapp") as string;
    const email = formData.get("email") as string;
    const alasan = formData.get("alasan") as string;

    // Validasi sederhana (Opsional)
    if (!nama || !nim || !whatsapp) {
      return {
        success: false,
        message: "Nama, NIM, dan WhatsApp wajib diisi.",
      };
    }

    // 2. Simpan ke Database Neon
    await query(
      `INSERT INTO volunteer_logs 
       (nama_lengkap, nim, universitas, jurusan, semester, whatsapp, email, alasan, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'MENUNGGU SELEKSI')`,
      [nama, nim, universitas, jurusan, semester, whatsapp, email, alasan],
    );

    // 3. Revalidate halaman agar data baru (jika ada list) ter-update
    revalidatePath("/dashboard/relawan");

    return {
      success: true,
      message:
        "Formulir berhasil dikirim! Panitia akan menghubungi Anda via WhatsApp/Email.",
    };
  } catch (error) {
    console.error("Error register relawan:", error);
    return {
      success: false,
      message: "Terjadi kesalahan server saat menyimpan data.",
    };
  }
}
