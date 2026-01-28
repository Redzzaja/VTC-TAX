"use server";

const learningMaterials = [
  {
    id: 1,
    title: "Buku Saku PPh 21 (TER)",
    desc: "Panduan lengkap perhitungan Tarif Efektif Rata-rata.",
    category: "Modul",
    type: "PDF",
    url: "https://static.pajak.go.id/download/kalkulator/Buku_PPh2126_Release_20240108.pdf",
  },
  {
    id: 2,
    title: "Tabel Tarif TER (Excel)",
    desc: "Sheet cek kategori otomatis.",
    category: "Tools",
    type: "XLSX",
    url: "https://pajak.go.id/sites/default/files/2024-02/PMK%20168%20Tahun%202023%20Tentang%20PPh%20Pasal%2021%20TER.pdf",
  },
  {
    id: 3,
    title: "UU HPP No. 7 Tahun 2021",
    desc: "Update Harmonisasi Peraturan.",
    category: "Regulasi",
    type: "PDF",
    url: "https://pajak.go.id/sites/default/files/2021-12/Salinan%20UU%20Nomor%207%20Tahun%202021.pdf",
  },
  {
    id: 4,
    title: "PMK 168 Tahun 2023",
    desc: "Petunjuk Pelaksanaan PPh.",
    category: "Regulasi",
    type: "PDF",
    url: "https://jdih.kemenkeu.go.id/api/download/e60a82e0-b218-40f5-9d18-b924aa1e11ce/2023pmkeuangan168.pdf",
  },
  {
    id: 5,
    title: "Tutorial e-Bupot 21/26",
    desc: "Langkah-langkah pembuatan bukti potong.",
    category: "Tutorial",
    type: "Video File",
    url: "https://youtu.be/FGi3B5OTGmQ?si=u1E9_-s_fTiGlHA7",
  },
  {
    id: 6,
    title: "Format Impor Excel DJP",
    desc: "Template CSV/Excel lapor SPT.",
    category: "Tools",
    type: "XLSX",
    url: "https://www.pajak.go.id/en/node/112031",
  },
];

export async function getMateriListAction() {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { success: true, data: learningMaterials };
}
