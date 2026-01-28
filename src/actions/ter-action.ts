"use server";

import { appendSheetData, getSheetData } from "@/lib/google";
import { revalidatePath } from "next/cache";

// Helper: Tentukan Kategori TER berdasarkan PTKP
function getKategoriTER(ptkp: string) {
  const ptkpMap: Record<string, string> = {
    "TK/0": "A",
    "TK/1": "A",
    "K/0": "A",
    "TK/2": "B",
    "TK/3": "B",
    "K/1": "B",
    "K/2": "B",
    "K/3": "C",
  };
  return ptkpMap[ptkp] || "A";
}

// --- ACTION 1: AMBIL DATA (READ) ---
export async function getTerListAction() {
  try {
    const rows = await getSheetData("Data TER!A2:H");
    if (!rows) return [];

    return rows
      .map((row) => ({
        id: row[0],
        tanggal: row[1],
        nama: row[2],
        nik: row[3]?.replace("'", "") || "",
        ptkp: row[4],
        bruto: parseFloat(row[5]) || 0,
        tarif: row[6],
        pph: parseFloat(row[7]) || 0,
      }))
      .reverse();
  } catch (error) {
    console.error("Error get data:", error);
    return [];
  }
}

// --- ACTION 2: HITUNG & SIMPAN (CREATE) ---
export async function calculateTerAction(formData: any) {
  try {
    const timestamp = new Date().toLocaleString("id-ID", {
      timeZone: "Asia/Jakarta",
    });
    const id = "TER-" + Date.now().toString().slice(-6);

    // 1. Ambil Input
    const bruto = parseFloat(formData.bruto) || 0;
    const ptkp = formData.ptkp;

    // 2. Tentukan Kategori
    const kategori = getKategoriTER(ptkp);

    // 3. Logika Tarif Sederhana (Simulasi)
    // (Bisa diganti dengan tabel lengkap PP 58 nanti)
    let tarifPersen = 0;

    if (kategori === "A") {
      if (bruto <= 5400000) tarifPersen = 0;
      else if (bruto <= 5650000) tarifPersen = 0.25;
      else if (bruto <= 5950000) tarifPersen = 0.5;
      else if (bruto <= 6300000) tarifPersen = 0.75;
      else tarifPersen = 1.5;
    } else if (kategori === "B") {
      if (bruto <= 6200000) tarifPersen = 0;
      else tarifPersen = 2.0;
    } else {
      // C
      if (bruto <= 6600000) tarifPersen = 0;
      else tarifPersen = 3.0;
    }

    const pph = Math.floor(bruto * (tarifPersen / 100));

    // 4. Simpan ke Google Sheet
    // Kolom: [ID, Tanggal, Nama, NIK, PTKP, Bruto, Tarif, PPh]
    const newRow = [
      id,
      timestamp,
      formData.nama,
      `'${formData.nik}`,
      `${ptkp} (TER ${kategori})`,
      bruto,
      `${tarifPersen}%`,
      pph,
    ];

    const result = await appendSheetData("Data TER!A:H", [newRow]);

    if (result) {
      revalidatePath("/dashboard/ter");
      return {
        success: true,
        message: "Perhitungan Berhasil!",
        hasil: { pph: pph, tarif: tarifPersen, kategori: kategori },
      };
    } else {
      return { success: false, message: "Gagal koneksi database." };
    }
  } catch (error) {
    return { success: false, message: "Server Error" };
  }
}
