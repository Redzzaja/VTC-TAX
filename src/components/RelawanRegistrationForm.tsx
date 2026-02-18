"use client";

import { useActionState, useEffect } from "react";
import { registerRelawanAction } from "@/actions/relawan-action";
import { User, Loader2, Send, UploadCloud, Clock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const initialState = {
  success: false,
  message: "",
};

export default function RelawanRegistrationForm() {
  const [state, formAction, isPending] = useActionState(
    registerRelawanAction,
    initialState,
  );

  useEffect(() => {
    if (state.message && !state.success) {
      toast.error("Gagal", {
        description: state.message,
      });
    }
  }, [state]);

  const labelClasses = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2";
  const inputClasses = "block w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 outline-none transition-all";

  if (state.success) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-l-4 border-yellow-400 p-12 text-center animate-in fade-in zoom-in duration-500">
          <div className="mx-auto w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mb-6">
             <Clock className="w-10 h-10 text-yellow-500" />
          </div>
          
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Pendaftaran Berhasil!</h2>
          <p className="text-yellow-600 font-bold uppercase tracking-wider text-sm mb-6">Status: MENUNGGU KONFIRMASI</p>
          
          <div className="space-y-2 text-slate-500 mb-8 max-w-md mx-auto leading-relaxed">
             <p>Terima kasih telah mendaftar. Data Anda sedang ditinjau oleh tim admin kami.</p>
          </div>

          <div className="pt-6 border-t border-slate-50">
             <p className="text-xs text-slate-400">
                Mohon menunggu update selanjutnya. Cek halaman ini secara berkala.
             </p>
          </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      
      {/* Header */}
      <div className="p-8 pb-0">
        <div className="flex items-center gap-3 mb-2">
            <User className="w-6 h-6 text-slate-700" />
            <h2 className="text-xl font-bold text-slate-900">Pendaftaran Relawan Pajak</h2>
        </div>
        <p className="text-slate-500 text-sm">
            Bergabunglah menjadi bagian dari Relawan Pajak untuk Negeri. Silakan lengkapi formulir di bawah ini dengan data yang valid.
        </p>
      </div>

      <form action={formAction} className="p-8 space-y-8">
        
        {/* Row 1: Nama & NIM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
                <label className={labelClasses}>Nama Lengkap</label>
                <input name="nama" type="text" required placeholder="Sesuai KTP" className={inputClasses} />
            </div>
            <div className="space-y-1">
                <label className={labelClasses}>NIM</label>
                <input name="nim" type="text" required placeholder="Nomor Induk Mahasiswa" className={inputClasses} />
            </div>
        </div>

        {/* Row 2: Kampus & Jurusan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
                <label className={labelClasses}>Asal Kampus</label>
                <input name="universitas" type="text" required placeholder="Nama Universitas" className={inputClasses} />
            </div>
            <div className="space-y-1">
                <label className={labelClasses}>Jurusan / Prodi</label>
                <input name="jurusan" type="text" required placeholder="Contoh: D3 Perpajakan" className={inputClasses} />
            </div>
        </div>

        {/* Row 3: Semester & WhatsApp */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-1">
                <label className={labelClasses}>Semester</label>
                <div className="relative">
                    <select name="semester" className={`${inputClasses} appearance-none cursor-pointer`} required>
                        <option value="" disabled selected>Pilih Semester</option>
                        <option value="1">Semester 1</option>
                        <option value="3">Semester 3</option>
                        <option value="5">Semester 5</option>
                        <option value="7">Semester 7</option>
                        <option value="Akhir">Semester Akhir</option>
                    </select>
                     <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                </div>
            </div>
            <div className="space-y-1">
                <label className={labelClasses}>WhatsApp</label>
                <input name="whatsapp" type="text" required placeholder="08xxxxxxxxxx" className={inputClasses} />
            </div>
        </div>

        {/* Row 4: Email */}
        <div className="space-y-1">
            <label className={labelClasses}>Email</label>
            <input name="email" type="email" required placeholder="email@mahasiswa.ac.id" className={inputClasses} />
        </div>

        {/* Row 5: Motivasi */}
        <div className="space-y-1">
            <label className={labelClasses}>Motivasi Bergabung</label>
             <textarea
                name="alasan"
                rows={4}
                required
                placeholder="Ceritakan motivasi Anda secara singkat dan jelas..."
                className={`${inputClasses} tracking-normal min-h-[120px] resize-y`}
              ></textarea>
        </div>

        {/* File Upload Placeholder */}
        <div className="space-y-1">
            <label className={labelClasses}>Berkas Pendukung</label>
             <div className="relative group cursor-pointer border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 hover:border-slate-300 transition-all p-8 flex flex-col items-center justify-center text-center">
                 <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                 <div className="bg-white p-3 rounded-full shadow-sm mb-3">
                    <UploadCloud className="w-6 h-6 text-slate-400" />
                 </div>
                 <p className="text-sm font-medium text-slate-700">Klik untuk upload CV & Transkrip</p>
                 <p className="text-xs text-slate-500 mt-1">Format PDF, Max 2MB</p>
             </div>
        </div>


        {/* Submit */}
        <div className="pt-4">
             <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-6 rounded-xl font-bold shadow-lg shadow-slate-900/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-base"
            >
                {isPending ? (
                    <>
                        <Loader2 className="animate-spin text-slate-400" size={20} />
                        Memproses Pendaftaran...
                    </>
                ) : (
                    <>
                        Kirim Pendaftaran <Send size={18} />
                    </>
                )}
            </Button>
        </div>

      </form>
    </div>
  );
}
