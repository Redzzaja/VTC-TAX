import { query } from "@/lib/db";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";

async function getSelectionResults() {
  try {
    const res = await query(`
      SELECT nama_lengkap, nim, selection_score, test_taken_at, email, whatsapp
      FROM volunteer_logs 
      WHERE test_taken_at IS NOT NULL 
      ORDER BY selection_score DESC, test_taken_at ASC
    `);
    return res.rows;
  } catch (error) {
    console.error("Error fetching results:", error);
    return [];
  }
}

export default async function SelectionResultsPage() {
  const results = await getSelectionResults();

  return (
    <div className="w-full max-w-[100vw] overflow-x-hidden animate-in fade-in pb-20">
      <div className="max-w-6xl mx-auto px-4 md:px-6 space-y-6">
        
        {/* Back Button */}
        <div>
          <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Dashboard
          </Link>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ClipboardCheck className="text-slate-700 w-5 h-5 md:w-7 md:h-7 shrink-0" />
            <span>Hasil Seleksi Relawan</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1 leading-snug">
            Daftar nilai dan status kelulusan peserta yang telah mengerjakan tes seleksi.
          </p>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6 min-h-[400px]">
           <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs md:text-sm font-bold text-slate-700 mb-6 flex justify-between items-center">
              <span>DAFTAR HASIL TES</span>
              <span className="bg-white px-2 py-1 rounded border border-slate-200 text-xs font-normal text-slate-500 shadow-sm">
                Total Peserta: {results.length}
              </span>
           </div>

           <div className="overflow-x-auto rounded-lg border border-slate-200">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow className="border-slate-200">
                     <TableHead className="font-bold text-slate-700 uppercase text-xs w-[50px] text-center">No</TableHead>
                     <TableHead className="font-bold text-slate-700 uppercase text-xs">Peserta</TableHead>
                     <TableHead className="font-bold text-slate-700 uppercase text-xs">Kontak</TableHead>
                     <TableHead className="font-bold text-slate-700 uppercase text-xs text-center">Skor</TableHead>
                     <TableHead className="font-bold text-slate-700 uppercase text-xs">Waktu Tes</TableHead>
                     <TableHead className="font-bold text-slate-700 uppercase text-xs text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-slate-500 italic">
                        Belum ada data hasil seleksi.
                      </TableCell>
                    </TableRow>
                  ) : (
                    results.map((row: any, idx: number) => (
                      <TableRow key={idx} className="hover:bg-slate-50 border-slate-100">
                        <TableCell className="text-center font-bold text-slate-500 text-xs">{idx + 1}</TableCell>
                        <TableCell>
                           <div className="font-bold text-slate-900 text-sm">{row.nama_lengkap}</div>
                           <div className="text-xs font-mono text-slate-500">{row.nim}</div>
                        </TableCell>
                        <TableCell>
                            <div className="text-xs space-y-0.5">
                                <div className="text-slate-700">{row.whatsapp}</div>
                                <div className="text-slate-400">{row.email}</div>
                            </div>
                        </TableCell>
                        <TableCell className="text-center">
                            <span className={`text-lg font-bold ${
                                row.selection_score >= 70 ? "text-emerald-700" : "text-red-600"
                            }`}>
                                {row.selection_score}
                            </span>
                        </TableCell>
                        <TableCell className="text-xs text-slate-500">
                            {new Date(row.test_taken_at).toLocaleString("id-ID", {
                              day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                        </TableCell>
                        <TableCell className="text-center">
                             {row.selection_score >= 70 ? (
                                <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200 shadow-none font-bold">Lulus</Badge>
                             ) : (
                                <Badge className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200 shadow-none font-bold">Gagal</Badge>
                             )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
           </div>
        </div>
      </div>
    </div>
  );
}
