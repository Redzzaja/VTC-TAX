import { getLevelsAction, getSubLevelsAction, createSubLevelAction, deleteSubLevelAction } from "@/actions/quiz-action";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Plus, GitBranch } from "lucide-react";

export default async function AdminSubLevelsPage({ searchParams }: { searchParams: Promise<{ levelId?: string }> }) {
  const levelsRes = await getLevelsAction();
  const levels = levelsRes.success ? levelsRes.data : [];
  
  const { levelId } = await searchParams;
  const selectedLevelId = levelId ? parseInt(levelId) : (levels[0]?.id || 0);
  
  let subLevels: any[] = [];
  if (selectedLevelId) {
     const subRes = await getSubLevelsAction(selectedLevelId);
     subLevels = subRes.success ? subRes.data : [];
  }

  async function createSubLevel(formData: FormData) {
    "use server";
    await createSubLevelAction(formData);
  }

  async function deleteSubLevel(id: number) {
    "use server";
    await deleteSubLevelAction(id);
  }

   return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
       <div className="flex items-center gap-3 mb-6">
          <GitBranch className="w-8 h-8 text-yellow-500" />
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Kelola Sub-Level</h1>
            <p className="text-slate-500">Tambah materi atau bagian dalam level.</p>
          </div>
       </div>

       {/* Level Selector */}
       <div className="bg-white p-4 rounded-xl border-0 shadow-lg shadow-slate-100 flex items-center gap-4">
          <span className="text-sm font-bold text-slate-700">Pilih Level:</span>
          <div className="flex flex-wrap gap-2">
              {levels.map(l => (
                  <Link 
                    key={l.id} 
                    href={`?levelId=${l.id}`}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedLevelId === l.id 
                        ? "bg-slate-900 text-white shadow-md shadow-slate-900/20" 
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                     Level {l.level_number}
                  </Link>
              ))}
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {/* Form Create */}
           <Card className="md:col-span-1 h-fit border-0 shadow-lg shadow-slate-100">
              <CardHeader>
                  <CardTitle className="text-lg text-slate-800">Tambah Sub-Level</CardTitle>
              </CardHeader>
              <CardContent>
                  <form action={createSubLevel} className="space-y-4">
                      <input type="hidden" name="levelId" value={selectedLevelId} />
                      
                      <div className="space-y-2">
                          <Label>Nomor Urut (Part)</Label>
                          <Input name="subLevelNumber" type="number" required placeholder="Contoh: 1" className="bg-white text-slate-900 border-slate-300 focus:ring-slate-500 focus:border-slate-500" />
                      </div>
                      <div className="space-y-2">
                          <Label>Judul Materi</Label>
                          <Input name="title" required placeholder="Contoh: Pengenalan PPh" className="bg-white text-slate-900 border-slate-300 focus:ring-slate-500 focus:border-slate-500" />
                      </div>
                      <div className="space-y-2">
                          <Label>KKM (Min. Score)</Label>
                          <Input name="minScore" type="number" defaultValue={70} className="bg-white text-slate-900 border-slate-300 focus:ring-slate-500 focus:border-slate-500" />
                      </div>
                      <Button type="submit" className="w-full bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/20" disabled={!selectedLevelId}>
                          <Plus size={16} className="mr-2" /> Tambah Sub-Level
                      </Button>
                  </form>
              </CardContent>
           </Card>

           {/* List SubLevels */}
           <Card className="md:col-span-2 border-0 shadow-lg shadow-slate-100">
              <CardHeader>
                  <CardTitle className="text-lg text-slate-800">Daftar Sub-Level (Level {levels.find(l => l.id === selectedLevelId)?.level_number})</CardTitle>
              </CardHeader>
              <CardContent>
                  <Table>
                      <TableHeader>
                          <TableRow className="hover:bg-transparent border-slate-100">
                             <TableHead className="w-[80px]">Part</TableHead>
                             <TableHead>Judul Materi</TableHead>
                             <TableHead>KKM</TableHead>
                             <TableHead className="text-right">Aksi</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                         {subLevels.map((sub) => (
                             <TableRow key={sub.id} className="border-slate-50 hover:bg-slate-50/50">
                                 <TableCell className="font-bold text-center bg-slate-50 rounded-lg text-slate-700">{sub.sub_level_number}</TableCell>
                                 <TableCell className="font-medium text-slate-800">{sub.title}</TableCell>
                                 <TableCell className="text-slate-600">{sub.min_score_to_pass}</TableCell>
                                 <TableCell className="text-right">
                                     <form action={deleteSubLevel.bind(null, sub.id)}>
                                         <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                             <Trash2 size={16} />
                                         </Button>
                                     </form>
                                 </TableCell>
                             </TableRow>
                         ))}
                         {subLevels.length === 0 && (
                             <TableRow>
                                 <TableCell colSpan={4} className="text-center py-8 text-slate-400">Belum ada sub-level di level ini.</TableCell>
                             </TableRow>
                         )}
                      </TableBody>
                  </Table>
              </CardContent>
           </Card>
       </div>
    </div>
  );
}
