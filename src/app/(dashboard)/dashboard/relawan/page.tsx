"use client";

import { useActionState, useEffect } from "react";
import { registerRelawanAction } from "@/actions/relawan-action";
import { UploadCloud, Send, User, BookOpen } from "lucide-react";
import { toast } from "sonner";

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
          duration: 4000,
        });
      } else {
        toast.error("Gagal!", {
          description: state.message,
        });
      }
    }
  }, [state]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="border-b border-slate-100 pb-6 mb-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
            <User size={28} className="text-slate-600" /> Pendaftaran Relawan
            Pajak
          </h1>
          <p className="text-slate-500 text-sm">
            Bergabunglah menjadi bagian dari Relawan Pajak untuk Negeri. Silakan
            lengkapi formulir di bawah ini dengan data yang valid.
          </p>
        </div>

        <form action={formAction} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Nama Lengkap
              </label>
              <input
                name="nama"
                type="text"
                required
                placeholder="Sesuai KTP"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all placeholder:text-slate-300"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                NIM
              </label>
              <input
                name="nim"
                type="text"
                required
                placeholder="Nomor Induk Mahasiswa"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all placeholder:text-slate-300"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Asal Kampus
              </label>
              <input
                name="universitas"
                type="text"
                required
                placeholder="Nama Universitas"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all placeholder:text-slate-300"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Jurusan / Prodi
              </label>
              <input
                name="jurusan"
                type="text"
                required
                placeholder="Contoh: D3 Perpajakan"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all placeholder:text-slate-300"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Semester
              </label>
              <select
                name="semester"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all bg-white text-slate-700"
              >
                <option value="3">Semester 3</option>
                <option value="5">Semester 5</option>
                <option value="7">Semester 7</option>
                <option value="Akhir">Tingkat Akhir</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                WhatsApp
              </label>
              <input
                name="whatsapp"
                type="text"
                required
                placeholder="08xxxxxxxxxx"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all placeholder:text-slate-300"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="email@mahasiswa.ac.id"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all placeholder:text-slate-300"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Motivasi Bergabung
            </label>
            <textarea
              name="alasan"
              rows={4}
              required
              placeholder="Ceritakan motivasi Anda secara singkat dan jelas..."
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all resize-none placeholder:text-slate-300"
            ></textarea>
          </div>

          {/* Upload File Section */}
          <div className="p-6 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 flex flex-col items-center justify-center text-center space-y-3 hover:border-slate-500 hover:bg-slate-100 transition-all cursor-pointer group">
            <div className="p-4 bg-white border border-slate-200 text-slate-600 rounded-full group-hover:scale-110 transition-transform shadow-sm">
              <UploadCloud size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors">
                Upload CV & Transkrip Nilai
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Format PDF, Maksimal 2MB
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={isPending}
              className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {isPending ? (
                "MENGIRIM..."
              ) : (
                <>
                  <Send size={16} /> KIRIM PENDAFTARAN
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
