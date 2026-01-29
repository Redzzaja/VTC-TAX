import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner"; // <--- 1. Import Toaster

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VTC Tax System",
  description: "Sistem Informasi Perpajakan Terintegrasi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        {children}

        {/* 2. Pasang Toaster di sini */}
        {/* richColors membuat sukses jadi hijau, error jadi merah otomatis */}
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
