import { google } from "googleapis";

// Inisialisasi Auth sekali saja
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

// Fungsi 1: Ambil Data (Read)
export async function getSheetData(range: string) {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range,
    });
    return response.data.values || [];
  } catch (error) {
    console.error("Gagal ambil data:", error);
    return [];
  }
}

// Fungsi 2: Tulis Data Baru (Append)
export async function appendSheetData(range: string, values: any[][]) {
  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: { values },
    });
    return true;
  } catch (error) {
    console.error("Gagal simpan data:", error);
    return false;
  }
}
