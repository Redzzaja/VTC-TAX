import { getLevelsAction, createLevelAction, deleteLevelAction } from "@/actions/quiz-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Plus, Layers } from "lucide-react";

export default async function AdminLevelsPage() {
  const res = await getLevelsAction();
  const levels = res.success ? res.data : [];

  async function createLevel(formData: FormData) {
    "use server";
    await createLevelAction(formData);
  }

  async function deleteLevel(id: number) {
    "use server";
    await deleteLevelAction(id);
  }

  return (
    <div className="w-full max-w-[100vw] overflow-x-hidden animate-in fade-in pb-20">
      <div className="max-w-6xl mx-auto px-4 md:px-6 space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Layers className="text-slate-700 w-5 h-5 md:w-7 md:h-7 shrink-0" />
            <span>Kelola Level Belajar</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1 leading-snug">
            Atur hierarki materi pembelajaran dengan menambahkan atau menghapus level utama.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
           {/* Form Create */}
           <div className="md:col-span-1 space-y-4">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
                <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs md:text-sm font-bold text-slate-700 mb-4">
                  TAMBAH LEVEL BARU
                </div>
                
                <form action={createLevel} className="space-y-4">
                    <div>
                        <Label className="block text-xs md:text-sm font-bold text-slate-700 mb-1">Nomor Level</Label>
                        <Input name="levelNumber" type="number" required placeholder="Contoh: 3" className="bg-white text-slate-900 border-slate-300 focus:ring-slate-500 focus:border-slate-500" />
                    </div>
                    <div>
                        <Label className="block text-xs md:text-sm font-bold text-slate-700 mb-1">Judul Level</Label>
                        <Input name="title" required placeholder="Contoh: PPh Badan" className="bg-white text-slate-900 border-slate-300 focus:ring-slate-500 focus:border-slate-500" />
                    </div>
                    <div>
                        <Label className="block text-xs md:text-sm font-bold text-slate-700 mb-1">Deskripsi Singkat</Label>
                        <Input name="description" placeholder="Deskripsi materi..." className="bg-white text-slate-900 border-slate-300 focus:ring-slate-500 focus:border-slate-500" />
                    </div>
                    <Button type="submit" className="w-full bg-slate-900 text-white hover:bg-slate-800 shadow-sm">
                        <Plus size={16} className="mr-2" /> Tambah Level
                    </Button>
                </form>
              </div>
           </div>

           {/* List Levels */}
           <div className="md:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6 min-h-[400px]">
                  <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs md:text-sm font-bold text-slate-700 mb-4 flex justify-between items-center">
                    <span>DAFTAR LEVEL AKTIF</span>
                    <span className="text-slate-500 font-normal text-xs">Total: {levels.length}</span>
                  </div>

                  <div className="overflow-x-auto rounded-lg border border-slate-200">
                      <Table>
                          <TableHeader className="bg-slate-50">
                              <TableRow className="border-slate-200">
                                 <TableHead className="w-[80px] font-bold text-slate-700 uppercase text-xs text-center">No</TableHead>
                                 <TableHead className="font-bold text-slate-700 uppercase text-xs">Judul Level</TableHead>
                                 <TableHead className="font-bold text-slate-700 uppercase text-xs">Deskripsi</TableHead>
                                 <TableHead className="font-bold text-slate-700 uppercase text-xs text-right">Aksi</TableHead>
                              </TableRow>
                          </TableHeader>
                          <TableBody>
                             {levels.length === 0 ? (
                                 <TableRow>
                                     <TableCell colSpan={4} className="text-center py-8 text-slate-400 italic">Belum ada level yang dibuat.</TableCell>
                                 </TableRow>
                             ) : (
                               levels.map((level) => (
                                 <TableRow key={level.id} className="hover:bg-slate-50 border-slate-100">
                                     <TableCell className="text-center">
                                        <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-slate-100 text-slate-600 font-bold text-xs ring-1 ring-slate-200">
                                          {level.level_number}
                                        </span>
                                     </TableCell>
                                     <TableCell className="font-bold text-slate-900 text-sm">{level.title}</TableCell>
                                     <TableCell className="text-slate-500 text-xs truncate max-w-[200px]">{level.description}</TableCell>
                                     <TableCell className="text-right">
                                         <form action={deleteLevel.bind(null, level.id)}>
                                             <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50">
                                                 <Trash2 size={16} />
                                             </Button>
                                         </form>
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
      </div>
    </div>
  );
}
