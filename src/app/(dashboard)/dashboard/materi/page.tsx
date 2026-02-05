"use client";

import { useState, useEffect } from "react";
import { getMateriListAction } from "@/actions/materi-action";
import {
  BookOpen,
  FileText,
  Download,
  FileSpreadsheet,
  Search,
  Filter,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

export default function MateriPage() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [category, setCategory] = useState("Semua");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await getMateriListAction();
        if (res.success) {
          setMaterials(res.data);
          setFiltered(res.data);
        }
      } catch (error) {
        console.error("Gagal memuat materi:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    let result = materials;

    if (category !== "Semua") {
      result = result.filter((m) => m.category === category);
    }

    if (search) {
      result = result.filter(
        (m) =>
          m.title.toLowerCase().includes(search.toLowerCase()) ||
          m.desc.toLowerCase().includes(search.toLowerCase()),
      );
    }

    setFiltered(result);
  }, [category, search, materials]);

  const getIcon = (type: string) => {
    const iconClass = "text-slate-600";
    if (type === "XLSX")
      return <FileSpreadsheet className={iconClass} size={28} />;
    if (type === "PDF") return <FileText className={iconClass} size={28} />;
    return <BookOpen className={iconClass} size={28} />;
  };

  return (
    <div className="w-full max-w-[100vw] overflow-x-hidden animate-in fade-in pb-20">
      {/* Auto Center Container */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 space-y-6">
        {/* Tombol Kembali */}
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium text-xs md:text-sm"
          >
            <ArrowLeft size={16} /> Kembali ke Dashboard
          </Link>
        </div>

        {/* Header Banner */}
        <div className="bg-slate-900 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-lg border border-slate-800">
          <div className="relative z-10 text-white">
            <h1 className="text-xl md:text-3xl font-bold mb-2 flex items-center gap-3">
              <BookOpen className="text-yellow-500 w-6 h-6 md:w-8 md:h-8 shrink-0" />
              <span>Pusat Materi Pajak</span>
            </h1>
            <p className="text-slate-400 max-w-2xl text-xs md:text-base leading-relaxed">
              Akses ribuan literasi perpajakan, modul pembelajaran, dan regulasi
              terbaru untuk menunjang pengetahuan Anda.
            </p>
          </div>

          {/* Dekorasi Background */}
          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-slate-800/50 to-transparent pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-32 h-32 md:w-40 md:h-40 bg-yellow-500/5 rounded-full blur-3xl" />
        </div>

        {/* Toolbar Filter (Stack on Mobile) */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm w-full">
          {/* Scrollable Filter Buttons */}
          <div className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <div className="flex gap-2 min-w-max px-1">
              {["Semua", "Modul", "Regulasi", "Tools", "Video"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all whitespace-nowrap ${
                    category === cat
                      ? "bg-slate-900 text-white shadow-md"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search
              size={16}
              className="absolute left-3 top-3 text-slate-400"
            />
            <input
              type="text"
              placeholder="Cari materi..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 outline-none transition-all placeholder:text-slate-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Grid Materi */}
        {isLoading ? (
          <div className="text-center py-16 text-slate-400 text-sm">
            <p>Memuat materi...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400 flex flex-col items-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 mx-4 md:mx-0">
            <Filter size={40} className="mb-4 opacity-30" />
            <p className="text-sm">Tidak ada materi ditemukan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl p-5 md:p-6 border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-slate-300 transition-all group relative overflow-hidden flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl group-hover:bg-slate-100 transition-colors shadow-sm">
                    {getIcon(item.type)}
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider border bg-slate-50 text-slate-600 border-slate-200`}
                  >
                    {item.category}
                  </span>
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 text-sm md:text-lg mb-2 leading-snug group-hover:text-slate-900 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-500 mb-6 line-clamp-3 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* Tombol Download */}
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-lg border border-slate-200 text-slate-600 font-bold text-xs md:text-sm flex items-center justify-center gap-2 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all mt-auto cursor-pointer hover:no-underline shadow-sm hover:shadow-md"
                >
                  <Download size={16} /> Unduh File
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
