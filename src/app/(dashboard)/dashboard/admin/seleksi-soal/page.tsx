"use client";

import { useState, useEffect } from "react";
import { 
  getQuestionsAction, 
  createQuestionAction, 
  updateQuestionAction, 
  deleteQuestionAction 
} from "@/actions/seleksi-action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, Search } from "lucide-react";

export default function AdminSeleksiSoalPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  
  // Form State
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    question: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_answer: "A",
  });

  const fetchQuestions = async () => {
    setIsLoading(true);
    const res = await getQuestionsAction();
    if (res.success) {
      setQuestions(res.data);
    } else {
      toast.error("Gagal memuat soal.");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleOpenDialog = (question?: any) => {
    if (question) {
      setEditingId(question.id);
      setFormData({
        question: question.question,
        option_a: question.options.A,
        option_b: question.options.B,
        option_c: question.options.C,
        option_d: question.options.D,
        correct_answer: question.correct,
      });
    } else {
      setEditingId(null);
      setFormData({
        question: "",
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",
        correct_answer: "A",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    let res;
    if (editingId) {
      res = await updateQuestionAction(editingId, formData);
    } else {
      res = await createQuestionAction(formData);
    }

    if (res.success) {
      toast.success(res.message);
      setIsDialogOpen(false);
      fetchQuestions();
    } else {
      toast.error(res.message);
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus soal ini?")) return;
    
    setIsDeleting(id);
    const res = await deleteQuestionAction(id);
    if (res.success) {
      toast.success(res.message);
      fetchQuestions();
    } else {
      toast.error(res.message);
    }
    setIsDeleting(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Bank Soal Seleksi</h1>
          <p className="text-slate-500">
            Kelola pertanyaan untuk tes seleksi relawan baru.
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="bg-slate-900 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Soal
        </Button>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow className="border-b-slate-200 hover:bg-transparent">
                <TableHead className="w-[80px] text-center font-bold text-slate-700">No</TableHead>
                <TableHead className="font-bold text-slate-700">Pertanyaan</TableHead>
                <TableHead className="w-[200px] font-bold text-slate-700">Kunci Jawaban</TableHead>
                <TableHead className="w-[120px] text-right font-bold text-slate-700 pr-6">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && questions.length === 0 ? (
                <TableRow className="border-b-slate-200">
                  <TableCell colSpan={4} className="h-32 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-slate-300" />
                  </TableCell>
                </TableRow>
              ) : questions.length === 0 ? (
                <TableRow className="border-b-slate-200">
                  <TableCell colSpan={4} className="h-32 text-center text-slate-500">
                    Belum ada soal tersedia.
                  </TableCell>
                </TableRow>
              ) : (
                questions.map((q, idx) => (
                  <TableRow key={q.id} className="hover:bg-slate-50/80 transition-colors border-b-slate-200">
                    <TableCell className="text-center font-medium text-slate-600">{idx + 1}</TableCell>
                    <TableCell>
                      <p className="font-medium text-slate-900 line-clamp-2 leading-relaxed">{q.question}</p>
                      <div className="flex gap-4 mt-2 text-xs text-slate-500">
                         <span className="truncate max-w-[150px]" title={q.options.A}><span className="font-bold text-slate-400 mr-1">A:</span>{q.options.A}</span>
                         <span className="truncate max-w-[150px]" title={q.options.B}><span className="font-bold text-slate-400 mr-1">B:</span>{q.options.B}</span>
                         <span className="truncate max-w-[150px]" title={q.options.C}><span className="font-bold text-slate-400 mr-1">C:</span>{q.options.C}</span>
                         <span className="truncate max-w-[150px]" title={q.options.D}><span className="font-bold text-slate-400 mr-1">D:</span>{q.options.D}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        Jawaban: {q.correct}
                      </span>
                    </TableCell>
                    <TableCell className="text-right pr-4">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                          onClick={() => handleOpenDialog(q)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(q.id)}
                          disabled={isDeleting === q.id}
                        >
                          {isDeleting === q.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog Form */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Soal" : "Tambah Soal Baru"}</DialogTitle>
            <DialogDescription>
              Isi detail pertanyaan dan pilihan jawaban di bawah ini.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5 py-4">
              <div className="space-y-2">
                <Label htmlFor="question" className="text-slate-600 font-semibold">Pertanyaan</Label>
                <Textarea
                  id="question"
                  placeholder="Tulis pertanyaan lengkap di sini..."
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  required
                  className="min-h-[120px] resize-none text-base bg-white border-slate-300 focus:border-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="opt_a" className="text-slate-500 text-xs uppercase font-bold tracking-wider">Pilihan A</Label>
                  <Input
                    id="opt_a"
                    value={formData.option_a}
                    onChange={(e) => setFormData({ ...formData, option_a: e.target.value })}
                    required
                    placeholder="Jawaban A"
                    className="bg-white border-slate-300 focus:border-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="opt_b" className="text-slate-500 text-xs uppercase font-bold tracking-wider">Pilihan B</Label>
                  <Input
                    id="opt_b"
                    value={formData.option_b}
                    onChange={(e) => setFormData({ ...formData, option_b: e.target.value })}
                    required
                    placeholder="Jawaban B"
                    className="bg-white border-slate-300 focus:border-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="opt_c" className="text-slate-500 text-xs uppercase font-bold tracking-wider">Pilihan C</Label>
                  <Input
                    id="opt_c"
                    value={formData.option_c}
                    onChange={(e) => setFormData({ ...formData, option_c: e.target.value })}
                    required
                    placeholder="Jawaban C"
                    className="bg-white border-slate-300 focus:border-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="opt_d" className="text-slate-500 text-xs uppercase font-bold tracking-wider">Pilihan D</Label>
                  <Input
                    id="opt_d"
                    value={formData.option_d}
                    onChange={(e) => setFormData({ ...formData, option_d: e.target.value })}
                    required
                    placeholder="Jawaban D"
                    className="bg-white border-slate-300 focus:border-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Label htmlFor="correct" className="text-slate-600 font-semibold">Kunci Jawaban</Label>
                <Select
                  value={formData.correct_answer}
                  onValueChange={(val) => setFormData({ ...formData, correct_answer: val })}
                >
                  <SelectTrigger className="w-full bg-white border-slate-300 focus:ring-0 focus:border-slate-500 focus:ring-offset-0">
                    <SelectValue placeholder="Pilih yang benar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A" className="font-medium">Pilihan A</SelectItem>
                    <SelectItem value="B" className="font-medium">Pilihan B</SelectItem>
                    <SelectItem value="C" className="font-medium">Pilihan C</SelectItem>
                    <SelectItem value="D" className="font-medium">Pilihan D</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-slate-900 text-white">
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editingId ? "Simpan Perubahan" : "Tambah Soal"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
