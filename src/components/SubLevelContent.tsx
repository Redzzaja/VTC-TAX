"use client";

import { useState } from "react";
import { PlayCircle, ClipboardList, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface SubLevelContentProps {
  levelId: string;
  subLevelTitle: string;
  youtubeId: string | null;
  children: React.ReactNode; // Quiz form (server-rendered)
}

export default function SubLevelContent({
  levelId,
  subLevelTitle,
  youtubeId,
  children,
}: SubLevelContentProps) {
  const hasVideo = !!youtubeId;
  const [activeTab, setActiveTab] = useState<"materi" | "kuis">(hasVideo ? "materi" : "kuis");

  return (
    <div className="max-w-3xl mx-auto py-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-6">
        <Link
          href={`/dashboard/belajar/${levelId}`}
          className="text-sm text-slate-500 hover:text-slate-800 mb-2 inline-flex items-center gap-1 transition-colors"
        >
          <ChevronLeft size={14} />
          Kembali ke Materi
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">{subLevelTitle}</h1>
      </div>

      {/* Tab Navigation */}
      {hasVideo && (
        <div className="flex bg-slate-100 rounded-xl p-1 mb-6 gap-1">
          <button
            onClick={() => setActiveTab("materi")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200",
              activeTab === "materi"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            <PlayCircle size={16} className={activeTab === "materi" ? "text-red-500" : ""} />
            Pelajari Materi
          </button>
          <button
            onClick={() => setActiveTab("kuis")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200",
              activeTab === "kuis"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            <ClipboardList size={16} className={activeTab === "kuis" ? "text-yellow-500" : ""} />
            Kuis Evaluasi
          </button>
        </div>
      )}

      {/* Tab Content */}
      {activeTab === "materi" && youtubeId && (
        <div className="animate-in fade-in duration-300">
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-100">
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
                title="Video Materi Pembelajaran"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-slate-500 mb-3">
              Setelah menonton video, lanjutkan ke kuis untuk menguji pemahamanmu.
            </p>
            <button
              onClick={() => setActiveTab("kuis")}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all shadow-sm hover:shadow-md"
            >
              <ClipboardList size={16} />
              Lanjut ke Kuis
            </button>
          </div>
        </div>
      )}

      {activeTab === "kuis" && (
        <div className="animate-in fade-in duration-300">
          {children}
        </div>
      )}
    </div>
  );
}
