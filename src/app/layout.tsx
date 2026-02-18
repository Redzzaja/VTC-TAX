import type { Metadata } from "next";
import { Rajdhani, Barlow, Space_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-heading",
});

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
});

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
      <body
        className={`${rajdhani.variable} ${barlow.variable} ${spaceMono.variable} font-sans antialiased`}
      >
        {children}

        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
