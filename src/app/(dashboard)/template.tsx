"use client";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    // Animasi: Muncul pelan (fade-in) dan geser sedikit dari bawah (slide-up)
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-in-out">
      {children}
    </div>
  );
}
