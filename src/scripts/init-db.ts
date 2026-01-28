import { google } from "googleapis";
import * as dotenv from "dotenv";

// Load environment variables dari .env.local
dotenv.config({ path: ".env.local" });

const SHEET_NAMES = {
  USER: "User",
  TER_LOGS: "Riwayat TER",
  EXAM_LOGS: "Hasil Seleksi Relawan",
  STUDENT_DATA: "Data Mahasiswa",
  VOLUNTEER_REG: "Pendaftaran Relawan",
  BPPU_DATA: "Data BPPU",
  SPT_DATA: "Data SPT",
  BP21_DATA: "Data BP21",
  BILLING_DATA: "Data Billing",
  BANK_SOAL: "Bank Soal",
  TANDING_SOAL: "Bank Soal Tanding",
  TANDING_HASIL: "Hasil Tanding VTC",
};

async function initializeDatabase() {
  console.log("🚀 Memulai Inisialisasi Database Dummy...");

  if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.SPREADSHEET_ID) {
    throw new Error("❌ Harap lengkapi .env.local terlebih dahulu!");
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = process.env.SPREADSHEET_ID;

  // 1. Cek sheet yang sudah ada
  const meta = await sheets.spreadsheets.get({ spreadsheetId });
  const existingSheets =
    meta.data.sheets?.map((s) => s.properties?.title) || [];

  const requests: any[] = [];

  // 2. Buat Sheet jika belum ada
  for (const name of Object.values(SHEET_NAMES)) {
    if (!existingSheets.includes(name)) {
      requests.push({ addSheet: { properties: { title: name } } });
      console.log(`✅ Antrian buat sheet: ${name}`);
    }
  }

  if (requests.length > 0) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: { requests },
    });
    console.log("✨ Sheet berhasil dibuat.");
  }

  // 3. Isi Header & Data Awal (Sesuai backend.gs lama)
  const dataPayload: { range: string; values: string[][] }[] = [
    {
      range: `${SHEET_NAMES.USER}!A1:D1`,
      values: [["Username", "Password", "Nama Lengkap", "Role"]],
    },
    {
      range: `${SHEET_NAMES.USER}!A2:D4`, // Data admin default
      values: [
        ["admin", "admin123", "Syauqal Dev", "Admin"],
        ["vtcbatch5", "vtc123", "Anggota VTC Batch 5", "Full Access"],
        ["relawanpajak", "relawan123", "Calon Relawan", "Restricted"],
      ],
    },
    {
      range: `${SHEET_NAMES.TER_LOGS}!A1:H1`,
      values: [
        [
          "ID Log",
          "Tanggal Hitung",
          "Nama Pegawai",
          "NIK",
          "Status PTKP",
          "Penghasilan Bruto",
          "Tarif TER",
          "PPh 21 Terutang",
        ],
      ],
    },
    {
      range: `${SHEET_NAMES.EXAM_LOGS}!A1:F1`,
      values: [
        [
          "Timestamp",
          "Identitas Peserta",
          "Skor Akhir",
          "Status Kelulusan",
          "Jml Pelanggaran",
          "Keterangan",
        ],
      ],
    },
    {
      range: `${SHEET_NAMES.STUDENT_DATA}!A1:B1`,
      values: [["Nama Mahasiswa", "NIM"]],
    },
    {
      range: `${SHEET_NAMES.STUDENT_DATA}!A2:B4`, // Data mahasiswa dummy
      values: [
        ["Muhamad Syauqal Afwika Rahman", "40011423620080"],
        ["Muhamad Naufal Afwika Rahman", "40017612367123"],
        ["Peserta Umum", "0000000000"],
      ],
    },
    {
      range: `${SHEET_NAMES.VOLUNTEER_REG}!A1:G1`,
      values: [
        [
          "Timestamp",
          "Nama Lengkap",
          "NIM",
          "Program Studi",
          "Semester",
          "Status Upload",
          "Pernyataan",
        ],
      ],
    },
    {
      range: `${SHEET_NAMES.BPPU_DATA}!A1:K1`,
      values: [
        [
          "ID BPPU",
          "Masa Pajak",
          "Status",
          "NPWP/NIK",
          "Nama WP",
          "Kode Objek Pajak",
          "Dasar Pengenaan Pajak",
          "Tarif (%)",
          "PPh Dipotong",
          "No Dokumen",
          "Tanggal Input",
        ],
      ],
    },
    {
      range: `${SHEET_NAMES.SPT_DATA}!A1:I1`,
      values: [
        [
          "ID SPT",
          "Jenis Pajak",
          "Masa Pajak",
          "Tahun Pajak",
          "Status SPT",
          "Pembetulan Ke",
          "Tanggal Buat",
          "Total PPh Kurang Bayar",
          "Data JSON",
        ],
      ],
    },
    {
      range: `${SHEET_NAMES.BP21_DATA}!A1:L1`,
      values: [
        [
          "ID BUPOT",
          "Masa Pajak",
          "Status",
          "NPWP Penerima",
          "Nama Penerima",
          "Kode Objek",
          "Bruto (Rp)",
          "DPP (Rp)",
          "Tarif (%)",
          "PPh (Rp)",
          "No Dokumen",
          "Tanggal Input",
        ],
      ],
    },
    {
      range: `${SHEET_NAMES.BILLING_DATA}!A1:K1`,
      values: [
        [
          "ID Billing",
          "NPWP",
          "Nama WP",
          "Kode Billing",
          "Masa Pajak",
          "Mata Uang",
          "Nominal (Rp)",
          "Status",
          "NTPN",
          "Waktu Buat",
          "Waktu Bayar",
        ],
      ],
    },
    {
      range: `${SHEET_NAMES.BANK_SOAL}!A1:G1`,
      values: [
        [
          "ID",
          "Pertanyaan",
          "Opsi A",
          "Opsi B",
          "Opsi C",
          "Opsi D",
          "Kunci Jawaban",
        ],
      ],
    },
    {
      range: `${SHEET_NAMES.TANDING_SOAL}!A1:G1`,
      values: [
        [
          "ID",
          "Pertanyaan",
          "Opsi A",
          "Opsi B",
          "Opsi C",
          "Opsi D",
          "Kunci Jawaban",
        ],
      ],
    },
    {
      range: `${SHEET_NAMES.TANDING_HASIL}!A1:F1`,
      values: [
        [
          "Timestamp",
          "Nama Peserta",
          "NIM",
          "Skor Akhir",
          "Pelanggaran",
          "Status",
        ],
      ],
    },
  ];

  // Eksekusi update data (batch)
  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId,
    requestBody: {
      valueInputOption: "USER_ENTERED",
      data: dataPayload,
    },
  });

  console.log(
    "🎉 Database Dummy SIAP DIGUNAKAN! Silakan cek Google Sheet Anda."
  );
}

initializeDatabase().catch(console.error);
