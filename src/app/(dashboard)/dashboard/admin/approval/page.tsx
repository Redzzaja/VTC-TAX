import {
  approveVolunteerAction,
  getVolunteersAction,
  rejectVolunteerAction,
} from "@/actions/relawan-action";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserPlus, Check, X } from "lucide-react";

export default async function AdminApprovalPage() {
  const result = await getVolunteersAction("MENUNGGU SELEKSI");
  const volunteers = result.success ? result.data : [];

  return (
    <div className="w-full max-w-[100vw] overflow-x-hidden animate-in fade-in pb-20">
      <div className="max-w-6xl mx-auto px-4 md:px-6 space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <UserPlus className="text-slate-700 w-5 h-5 md:w-7 md:h-7 shrink-0" />
            <span>Persetujuan Relawan</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1 leading-snug">
            Tinjau dan kelola pendaftaran relawan baru yang menunggu persetujuan.
          </p>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6 min-h-[400px]">
          
          <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs md:text-sm font-bold text-slate-700 mb-6 flex justify-between items-center">
            <span>DAFTAR ANTRIAN PERSETUJUAN</span>
            <span className="text-slate-500 font-normal text-xs bg-white px-2 py-1 rounded border border-slate-200">
               Total: {volunteers.length} Pemohon
            </span>
          </div>

          {volunteers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-slate-200 rounded-lg bg-slate-50/50">
              <div className="bg-white p-4 rounded-full mb-3 shadow-sm border border-slate-100">
                <UserPlus size={32} className="text-slate-300" />
              </div>
              <h3 className="text-slate-900 font-medium">Tidak ada data pending</h3>
              <p className="text-slate-500 text-sm mt-1">
                Semua pendaftaran relawan telah diproses.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow className="border-slate-200">
                    <TableHead className="font-bold text-slate-700 uppercase text-xs">Nama Lengkap</TableHead>
                    <TableHead className="font-bold text-slate-700 uppercase text-xs">Identitas (NIM)</TableHead>
                    <TableHead className="font-bold text-slate-700 uppercase text-xs">Instansi</TableHead>
                    <TableHead className="font-bold text-slate-700 uppercase text-xs">Kontak</TableHead>
                    <TableHead className="font-bold text-slate-700 uppercase text-xs text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {volunteers.map((vol: any) => (
                    <TableRow key={vol.id} className="hover:bg-slate-50 border-slate-100">
                      <TableCell>
                        <div className="font-bold text-slate-900">{vol.nama_lengkap}</div>
                        <div className="text-xs text-slate-500">{vol.email}</div>
                      </TableCell>
                      <TableCell className="font-mono text-xs font-bold text-slate-600">
                        {vol.nim}
                      </TableCell>
                      <TableCell>
                        <div className="text-xs font-bold text-slate-700">{vol.universitas}</div>
                        <div className="text-[10px] text-slate-500">{vol.jurusan}</div>
                      </TableCell>
                      <TableCell className="text-xs text-slate-600">
                        {vol.whatsapp}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <form
                            action={async () => {
                              "use server";
                              await approveVolunteerAction(vol.id);
                            }}
                          >
                            <Button 
                              size="sm" 
                              className="bg-slate-900 hover:bg-slate-800 text-white h-8 px-3 text-xs shadow-sm"
                              title="Terima"
                            >
                              <Check size={14} className="mr-1" /> Terima
                            </Button>
                          </form>
                          <form
                            action={async () => {
                              "use server";
                              await rejectVolunteerAction(vol.id);
                            }}
                          >
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 h-8 px-3 text-xs shadow-sm"
                              title="Tolak"
                            >
                              <X size={14} className="mr-1" /> Tolak
                            </Button>
                          </form>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
