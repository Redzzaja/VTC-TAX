"use client";

import { useActionState, useEffect } from "react"; // Tambah useEffect
import { registerRelawanAction } from "@/actions/relawan-action";
import { UploadCloud, Send } from "lucide-react";
import { toast } from "sonner"; // Import toast

const initialState = {
  success: false,
  message: "",
};

export default function RelawanPage() {
  const [state, formAction, isPending] = useActionState(
    registerRelawanAction,
    initialState,
  );

  // --- LOGIKA POP-UP NOTIFIKASI ---
  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success("Berhasil!", {
          description: state.message,
          duration: 4000, // Muncul selama 4 detik
        });
      } else {
        toast.error("Gagal!", {
          description: state.message,
        });
      }
    }
  }, [state]); // Jalankan setiap kali state berubah
  // -------------------------------

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Pendaftaran Relawan Pajak 🚀
        </h1>
        <p className="text-gray-500">
          Bergabunglah menjadi bagian dari Relawan Pajak untuk Negeri.
        </p>

        {/* Note: Pesan Error Text (Div Merah/Hijau) di sini BOLEH DIHAPUS 
            karena sudah digantikan oleh Pop-up Toast. 
            Tapi kalau mau tetap ada sebagai cadangan juga tidak apa-apa.
        */}

        <form action={formAction} className="mt-8 space-y-6">
          {/* ... (Input Form Nama, NIM, dll TETAP SAMA seperti sebelumnya) ... */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Nama Lengkap
              </label>
              <input
                name="nama"
                type="text"
                required
                placeholder="Sesuai KTP"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">NIM</label>
              <input
                name="nim"
                type="text"
                required
                placeholder="Nomor Induk Mahasiswa"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Asal Kampus
              </label>
              <input
                name="universitas"
                type="text"
                required
                placeholder="Nama Universitas"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Jurusan / Prodi
              </label>
              <input
                name="jurusan"
                type="text"
                required
                placeholder="Contoh: D3 Perpajakan"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Semester
              </label>
              <select
                name="semester"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
              >
                <option value="3">Semester 3</option>
                <option value="5">Semester 5</option>
                <option value="7">Semester 7</option>
                <option value="Akhir">Tingkat Akhir</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                WhatsApp
              </label>
              <input
                name="whatsapp"
                type="text"
                required
                placeholder="08xxxxxxxxxx"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                name="email"
                type="email"
                required
                placeholder="email@mahasiswa.ac.id"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Motivasi Bergabung
            </label>
            <textarea
              name="alasan"
              rows={4}
              required
              placeholder="Ceritakan motivasi Anda..."
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
            ></textarea>
          </div>

          {/* Upload File Dummy */}
          <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-center space-y-2 hover:border-blue-300 transition-colors cursor-pointer group">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-full group-hover:bg-blue-200 transition-colors">
              <UploadCloud size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                Upload CV & Transkrip Nilai
              </p>
              <p className="text-xs text-gray-400">Format PDF, Maksimal 2MB</p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {isPending ? (
                "Mengirim..."
              ) : (
                <>
                  <Send size={18} /> Kirim Pendaftaran
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
