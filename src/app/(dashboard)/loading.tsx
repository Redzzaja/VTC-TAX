export default function Loading() {
  return (
    <div className="flex h-[80vh] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner Animasi */}
        <div className="relative h-16 w-16">
          <div className="absolute h-16 w-16 animate-ping rounded-full bg-blue-400 opacity-20"></div>
          <div className="absolute top-0 h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
        </div>

        {/* Teks Loading */}
        <div className="text-center animate-pulse">
          <h3 className="text-lg font-bold text-slate-700">Memuat Data...</h3>
          <p className="text-sm text-slate-400">Mohon tunggu sebentar</p>
        </div>
      </div>
    </div>
  );
}
