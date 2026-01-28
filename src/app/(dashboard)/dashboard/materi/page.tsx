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
  ExternalLink,
} from "lucide-react";

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
          m.desc.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFiltered(result);
  }, [category, search, materials]);

  const getIcon = (type: string) => {
    if (type === "XLSX")
      return <FileSpreadsheet className="text-green-600" size={32} />;
    if (type === "PDF") return <FileText className="text-red-500" size={32} />;
    return <BookOpen className="text-blue-600" size={32} />;
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-2xl p-8 relative overflow-hidden shadow-lg border border-slate-800">
        <div className="relative z-10 text-white">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <BookOpen className="text-yellow-500" /> Pusat Materi Pajak
          </h1>
          <p className="text-slate-400 max-w-2xl">
            Akses ribuan literasi perpajakan, modul pembelajaran, dan regulasi
            terbaru untuk menunjang pengetahuan Anda.
          </p>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 bg-linear-to-l from-blue-600/20 to-transparent" />
      </div>

      {/* Toolbar Filter */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
          {["Semua", "Modul", "Regulasi", "Tools", "Video"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                category === cat
                  ? "bg-slate-800 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Cari materi..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Grid Materi */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Memuat materi...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400 flex flex-col items-center">
          <Filter size={48} className="mb-4 opacity-20" />
          <p>Tidak ada materi ditemukan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-gray-50 rounded-xl group-hover:scale-110 transition-transform">
                  {getIcon(item.type)}
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
                    item.category === "Regulasi"
                      ? "bg-purple-100 text-purple-700"
                      : item.category === "Tools"
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {item.category}
                </span>
              </div>

              <div className="flex-1">
                <h3 className="font-bold text-gray-800 text-lg mb-2 leading-tight group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 mb-6 line-clamp-2">
                  {item.desc}
                </p>
              </div>

              {/* PERUBAHAN DI SINI: Menggunakan tag <a> bukan <button> */}
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-lg border border-gray-200 text-gray-600 font-bold text-sm flex items-center justify-center gap-2 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all mt-auto cursor-pointer hover:no-underline"
              >
                <Download size={16} /> Unduh File
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
