"use server";

import { appendSheetData } from "@/lib/google";

export async function registerRelawanAction(formData: any) {
  try {
    const timestamp = new Date().toLocaleString("id-ID", {
      timeZone: "Asia/Jakarta",
    });
    const id = "REG-" + Date.now().toString().slice(-6);

    // Susunan Kolom: [ID, Tanggal, Nama, NIM, Kampus, Jurusan, Semester, WA, Email, Motivasi, Status]
    const newRow = [
      id,
      timestamp,
      formData.nama,
      `'${formData.nim}`, // Pakai ' agar tidak dianggap angka
      formData.universitas,
      formData.jurusan,
      formData.semester,
      `'${formData.whatsapp}`, // Pakai ' agar 0 di depan tidak hilang
      formData.email,
      formData.alasan,
      "MENUNGGU SELEKSI", // Status Default
    ];

    const result = await appendSheetData("Data Relawan!A:K", [newRow]);

    if (result) {
      return {
        success: true,
        message:
          "Formulir berhasil dikirim! Panitia akan menghubungi Anda via WhatsApp/Email.",
      };
    } else {
      return { success: false, message: "Gagal menyimpan data ke database." };
    }
  } catch (error) {
    console.error("Error register relawan:", error);
    return { success: false, message: "Terjadi kesalahan server." };
  }
}
