import {
  addMaterialAction,
  deleteMaterialAction,
  getMateriListAction,
  Material,
} from "@/actions/materi-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, BookOpen, ExternalLink, Download } from "lucide-react";

export default async function AdminMaterialsPage() {
  const result = await getMateriListAction();
  const materials = result.success ? result.data : [];

  return (
    <div className="w-full max-w-[100vw] overflow-x-hidden animate-in fade-in pb-20">
      <div className="max-w-6xl mx-auto px-4 md:px-6 space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="text-slate-700 w-5 h-5 md:w-7 md:h-7 shrink-0" />
            <span>Kelola Materi</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1 leading-snug">
            Tambah dan atur materi pembelajaran perpajakan (Modul, Regulasi, Video, Tools).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
           {/* Form Create */}
           <div className="md:col-span-1 space-y-4">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
                <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs md:text-sm font-bold text-slate-700 mb-4">
                  TAMBAH MATERI BARU
                </div>
                
                <form
                  action={async (formData) => {
                    "use server";
                    await addMaterialAction(null, formData);
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label className="block text-xs md:text-sm font-bold text-slate-700 mb-1">Judul Materi</Label>
                    <Input name="title" placeholder="Contoh: Modul PPh 21" required className="bg-white text-slate-900 border-slate-300 focus:ring-slate-500 focus:border-slate-500" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="block text-xs md:text-sm font-bold text-slate-700 mb-1">Kategori</Label>
                    <Select name="category" defaultValue="Modul">
                      <SelectTrigger className="bg-white text-slate-900 border-slate-300 focus:ring-slate-500 focus:border-slate-500">
                        <SelectValue placeholder="Pilih Kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Modul">Modul</SelectItem>
                        <SelectItem value="Regulasi">Regulasi</SelectItem>
                        <SelectItem value="Tools">Tools</SelectItem>
                        <SelectItem value="Video">Video</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="block text-xs md:text-sm font-bold text-slate-700 mb-1">Deskripsi Singkat</Label>
                    <Input name="description" placeholder="Deskripsi materi..." className="bg-white text-slate-900 border-slate-300 focus:ring-slate-500 focus:border-slate-500" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="block text-xs md:text-sm font-bold text-slate-700 mb-1">Tipe File</Label>
                       <Select name="type" defaultValue="PDF">
                        <SelectTrigger className="bg-white text-slate-900 border-slate-300 focus:ring-slate-500 focus:border-slate-500">
                          <SelectValue placeholder="Pilih Tipe" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PDF">PDF</SelectItem>
                          <SelectItem value="XLSX">Excel</SelectItem>
                          <SelectItem value="Video File">Video</SelectItem>
                          <SelectItem value="Link">Link Eksternal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="block text-xs md:text-sm font-bold text-slate-700 mb-1">URL / Link</Label>
                      <Input name="url" placeholder="https://..." required className="bg-white text-slate-900 border-slate-300 focus:ring-slate-500 focus:border-slate-500" />
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-slate-900 text-white hover:bg-slate-800 shadow-sm mt-2">
                    Simpan Materi
                  </Button>
                </form>
              </div>
           </div>

           {/* List Materials */}
           <div className="md:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6 min-h-[400px]">
                  <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs md:text-sm font-bold text-slate-700 mb-4 flex justify-between items-center">
                    <span>DAFTAR MATERI</span>
                    <span className="text-slate-500 font-normal text-xs">Total: {materials.length} File</span>
                  </div>

                  <div className="overflow-x-auto rounded-lg border border-slate-200">
                      <Table>
                          <TableHeader className="bg-slate-50">
                              <TableRow className="border-slate-200">
                                 <TableHead className="font-bold text-slate-700 uppercase text-xs">Judul & Deskripsi</TableHead>
                                 <TableHead className="font-bold text-slate-700 uppercase text-xs">Kategori</TableHead>
                                 <TableHead className="font-bold text-slate-700 uppercase text-xs">Tipe</TableHead>
                                 <TableHead className="font-bold text-slate-700 uppercase text-xs text-center">Aksi</TableHead>
                              </TableRow>
                          </TableHeader>
                          <TableBody>
                             {materials.length === 0 ? (
                                 <TableRow>
                                     <TableCell colSpan={4} className="text-center py-8 text-slate-400 italic">Belum ada materi.</TableCell>
                                 </TableRow>
                             ) : (
                               materials.map((m: Material) => (
                                 <TableRow key={m.id} className="hover:bg-slate-50 border-slate-100">
                                     <TableCell>
                                       <div className="font-bold text-slate-900 text-sm">{m.title}</div>
                                       <div className="text-xs text-slate-500 truncate max-w-[200px]">
                                         {m.description}
                                       </div>
                                     </TableCell>
                                     <TableCell>
                                        <span className="inline-flex items-center px-2 py-1 rounded bg-slate-50 text-slate-700 text-xs font-medium border border-slate-200">
                                          {m.category}
                                        </span>
                                     </TableCell>
                                     <TableCell className="text-xs font-mono text-slate-500">{m.type}</TableCell>
                                     <TableCell className="text-center">
                                         <div className="flex items-center justify-center gap-2">
                                            <a
                                              href={m.url}
                                              target="_blank"
                                              rel="noreferrer"
                                              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                              title="Buka Link"
                                            >
                                              <ExternalLink size={16} />
                                            </a>
                                            <form
                                              action={async () => {
                                                "use server";
                                                await deleteMaterialAction(m.id);
                                              }}
                                            >
                                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50">
                                                <Trash2 size={16} />
                                              </Button>
                                            </form>
                                         </div>
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
