import Sidebar from "@/components/Sidebar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get("user_session");

  if (!session) {
    redirect("/");
  }

  const user = JSON.parse(session.value);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 1. Sidebar Tetap di Kiri */}
      <Sidebar />

      {/* 2. Konten Utama digeser ke Kanan (ml-64) agar tidak tertutup Sidebar */}
      <div className="flex-1 ml-64 transition-all duration-300">
        {/* Header Atas */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-8 sticky top-0 z-40">
          <h1 className="text-lg font-semibold text-gray-700">
            Selamat Datang,{" "}
            <span className="text-blue-600 font-bold">{user.name}</span>
          </h1>
          <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase border border-blue-100">
            {user.role}
          </div>
        </header>

        {/* Area Konten Halaman */}
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
