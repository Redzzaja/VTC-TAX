import { cookies } from "next/headers";
import { getVolunteerStatusAction } from "@/actions/relawan-action";
import RelawanRegistrationForm from "@/components/RelawanRegistrationForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Clock, CheckCircle, XCircle, AlertTriangle, Trophy } from "lucide-react";

export default async function RelawanPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("user_session");
  const user = session ? JSON.parse(session.value) : null;

  if (!user) return <div className="p-8">Silakan login.</div>;

  const statusRes = await getVolunteerStatusAction(user.username);
  const volunteer = statusRes.success ? statusRes.data : null;

  // Case 1: Belum Mendaftar
  if (!volunteer) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <RelawanRegistrationForm />
      </div>
    );
  }

  // Case 2: Menunggu Konfirmasi (PENDING / MENUNGGU SELEKSI)
  if (volunteer.status === "MENUNGGU SELEKSI" || volunteer.status === "PENDING") {
    return (
      <div className="max-w-2xl mx-auto pt-10 animate-in zoom-in-95 duration-500">
        <Card className="border-l-4 border-l-yellow-500 shadow-lg">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
            <CardTitle className="text-2xl">Pendaftaran Berhasil!</CardTitle>
            <CardDescription className="text-lg">
               Status: <span className="text-yellow-600 font-bold uppercase">Menunggu Konfirmasi</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4 text-slate-600">
            <p>
              Terima kasih telah mendaftar, <strong>{volunteer.nama_lengkap}</strong>. 
              Data Anda (NIM: {volunteer.nim}) sedang ditinjau oleh tim admin kami.
            </p>
            <p className="text-sm bg-slate-50 p-4 rounded-lg">
              Mohon menunggu update selanjutnya. Cek halaman ini secara berkala.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Case 3: DITERIMA (Belum Tes)
  if (volunteer.status === "DITERIMA" && !volunteer.test_taken_at) {
    return (
      <div className="max-w-2xl mx-auto pt-10 animate-in zoom-in-95 duration-500">
        <Card className="shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-slate-100 overflow-hidden">
          <CardContent className="p-10 text-center flex flex-col items-center">
             
             {/* Icon */}
             <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 relative">
                <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20"></div>
                <CheckCircle className="w-12 h-12 text-green-500" strokeWidth={3} />
             </div>

             <h2 className="text-2xl font-bold text-slate-900 mb-2">Selamat! Anda Lolos Administrasi</h2>
             <p className="text-slate-500 mb-8">Silakan lanjutkan ke tahap berikutnya.</p>

             {/* User Details */}
             <div className="bg-green-50/50 border border-green-100 rounded-2xl p-8 w-full max-w-md mb-8">
                 <p className="text-slate-500 text-sm mb-2">Anda terdaftar sebagai:</p>
                 <h3 className="text-xl font-bold text-slate-900">{volunteer.nama_lengkap}</h3>
                 <p className="text-green-600 font-bold font-mono text-lg mt-1">{volunteer.nim}</p>
             </div>

             <p className="text-slate-500 text-sm max-w-md mb-8 leading-relaxed">
               Langkah selanjutnya adalah mengerjakan <strong>Tes Seleksi Relawan</strong>. 
               Tes ini akan menguji pengetahuan dasar perpajakan Anda.
             </p>

             <Link href="/dashboard/seleksi">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20 px-8 py-6 h-auto text-base rounded-xl font-bold transition-all hover:scale-105 active:scale-95">
                    Lanjut Seleksi Sekarang
                </Button>
             </Link>

          </CardContent>
        </Card>
      </div>
    );
  }

  // Case 4: Sudah Tes (Menampilkan Hasil)
  if (volunteer.status === "DITERIMA" && volunteer.test_taken_at) {
    return (
      <div className="max-w-2xl mx-auto pt-10 animate-in zoom-in-95 duration-500">
         <Card className="border-2 shadow-xl text-center overflow-hidden">
            <CardHeader className="bg-slate-900 text-white py-10">
                <div className="mx-auto w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                   <Trophy className="w-10 h-10 text-yellow-400" />
                </div>
                <CardTitle className="text-3xl text-yellow-400">Tes Selesai</CardTitle>
                <CardDescription className="text-slate-300">
                    Terima kasih telah menyelesaikan seleksi.
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-10 pb-10 space-y-6">
                <div>
                     <p className="text-muted-foreground uppercase text-xs font-bold tracking-wider mb-2">Skor Anda</p>
                     <div className="text-6xl font-black text-slate-800 tracking-tighter">
                        {volunteer.selection_score}
                        <span className="text-2xl text-slate-400 font-normal">/100</span>
                     </div>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-600 max-w-sm mx-auto">
                    Hasil seleksi Anda telah tersimpan di sistem kami. 
                    Admin akan menghubungi Anda untuk tahapan selanjutnya jika diperlukan.
                </div>
            </CardContent>
         </Card>
      </div>
    );
  }

  // Case 5: DITOLAK
  if (volunteer.status === "DITOLAK") {
    return (
      <div className="max-w-2xl mx-auto pt-10 animate-in zoom-in-95 duration-500">
        <Card className="border-l-4 border-l-red-500 shadow-lg">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl">Mohon Maaf</CardTitle>
            <CardDescription className="text-red-500 font-bold">
              Aplikasi Anda Belum Dapat Diterima
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4 text-slate-600">
            <p>
              Terima kasih atas minat Anda, <strong>{volunteer.nama_lengkap}</strong>. 
              Namun saat ini kami belum bisa menerima Anda sebagai Relawan Pajak.
            </p>
            <p className="text-sm">
              Jangan berkecil hati, Anda masih dapat mencoba di kesempatan berikutnya.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <div>Loading...</div>;
}
