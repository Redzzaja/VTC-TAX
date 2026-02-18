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
        <Card className="border-l-4 border-l-green-500 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <CheckCircle className="w-32 h-32 text-green-500" />
          </div>
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Selamat! Anda Lolos Administrasi</CardTitle>
            <CardDescription>
              Silakan lanjutkan ke tahap berikutnya.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                <p className="mb-2 text-slate-600">Anda terdaftar sebagai:</p>
                <div className="font-bold text-xl text-slate-800">{volunteer.nama_lengkap}</div>
                <div className="font-mono text-green-700">{volunteer.nim}</div>
            </div>
            
            <p className="text-slate-600">
              Langkah selanjutnya adalah mengerjakan <strong>Tes Seleksi Relawan</strong>. 
              Tes ini akan menguji pengetahuan dasar perpajakan Anda.
            </p>

            <Link href="/dashboard/seleksi">
                <Button size="lg" className="w-full md:w-auto bg-green-600 hover:bg-green-700 shadow-md">
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
