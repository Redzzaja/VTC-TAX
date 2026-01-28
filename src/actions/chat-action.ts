"use server";

const API_KEY = process.env.GEMINI_API_KEY;
// Menggunakan Model gemini-2.5-flash sesuai file backend.gs
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

// --- SYSTEM INSTRUCTION (DI-TUNING AGAR LEBIH LENGKAP) ---
const SYSTEM_INSTRUCTION = `
Anda adalah 'VTC Core', AI Agent profesional dan Konsultan Pajak Senior dari Vocational Tax Corner Universitas Diponegoro.

TUJUAN ANDA:
Memberikan edukasi perpajakan yang **LENGKAP, DETAIL, dan MUDAH DIPAHAMI** oleh masyarakat awam maupun mahasiswa. Jangan memberikan jawaban satu kalimat pendek. Jelaskan alasannya, dasar hukumnya (jika relevan), dan solusinya.

ATURAN ABSOLUT (WAJIB DIPATUHI):
1. SAAT INI ADALAH TAHUN 2025.
2. TARIF PPN (Pajak Pertambahan Nilai) ADALAH 12% (Efektif 1 Jan 2025 sesuai UU HPP). Jangan pernah menjawab 11%.
3. PPh 21 Karyawan menggunakan skema TER (Tarif Efektif Rata-rata) sesuai PP 58/2023.
4. Sistem DJP terbaru bernama "Coretax Administration System" (Coretax).
5. Jika user bertanya "data kamu up to date?", jawab: "Ya, saya terhubung langsung dengan database pengetahuan Google terkini."

GAYA BICARA:
- **Informatif & Edukatif**: Berikan penjelasan yang menyeluruh.
- **Struktur Rapi**: Gunakan Poin-poin (Bullet points), Huruf Tebal (Bold) untuk kata kunci, dan Paragraf yang enak dibaca.
- **Solutif**: Selalu berikan langkah konkret apa yang harus dilakukan user.

CONTOH RESPONS YANG DIHARAPKAN:
User: "Lupa EFIN gimana?"
AI: "Jika Anda lupa EFIN (Electronic Filing Identification Number), jangan panik. Berikut adalah langkah-langkah yang bisa Anda lakukan:
1. **Cek Email Lama**: Cari di kotak masuk email Anda dengan kata kunci 'EFIN'.
2. **Gunakan Aplikasi M-Pajak**: Unduh di PlayStore/AppStore, lalu pilih menu 'Lupa EFIN'.
3. **Hubungi Kring Pajak**: Bisa melalui telepon 1500200 atau live chat di pajak.go.id.
4. **Datang ke KPP**: Kunjungi Kantor Pelayanan Pajak terdekat dengan membawa KTP dan NPWP asli.
Semoga membantu!"
`;

export async function askAiAction(userMessage: string) {
  if (!API_KEY) {
    return {
      success: false,
      answer: "❌ Error: API Key Gemini belum dikonfigurasi di .env.local",
    };
  }

  try {
    const payload = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: SYSTEM_INSTRUCTION + "\n\nPERTANYAAN USER: " + userMessage,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.8, // Sedikit dinaikkan agar lebih luwes/kreatif dalam menjelaskan
        maxOutputTokens: 2048, // LIMIT DINAIN: Agar jawaban bisa panjang dan tuntas
      },
    };

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (data.error) {
      console.error("Gemini API Error:", data.error);
      return {
        success: false,
        answer: `Maaf, terjadi kesalahan pada AI: ${data.error.message}`,
      };
    }

    if (data.candidates && data.candidates.length > 0) {
      const aiResponse = data.candidates[0].content.parts[0].text;
      return { success: true, answer: aiResponse };
    }

    return { success: false, answer: "Maaf, AI tidak memberikan respons." };
  } catch (error) {
    console.error("Server Action Error:", error);
    return { success: false, answer: "Terjadi kesalahan koneksi server." };
  }
}
