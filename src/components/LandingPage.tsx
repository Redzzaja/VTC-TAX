"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Bot, Award, ChevronRight, Shield, Users, GraduationCap } from "lucide-react";
import SplitText from "@/components/reactbits/SplitText";
import AnimatedContent from "@/components/reactbits/AnimatedContent";
import ShinyText from "@/components/reactbits/ShinyText";
import CountUp from "@/components/reactbits/CountUp";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050a18] text-white overflow-x-hidden">
      {/* ========== NAVBAR ========== */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between rounded-2xl bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] px-6 py-3">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/20">
                <div className="relative w-5 h-5">
                  <Image src="/favicon.ico" alt="VTC" fill className="object-contain" />
                </div>
              </div>
              <span className="text-lg font-black tracking-tight">
                CORE<span className="text-yellow-400">VTC</span>
              </span>
            </Link>

            {/* Nav Links (hidden on mobile for simplicity) */}
            <div className="hidden md:flex items-center gap-1">
              <a href="#features" className="px-4 py-2 text-sm text-white/60 hover:text-white rounded-lg hover:bg-white/[0.06] transition-all">
                Fitur
              </a>
              <a href="#stats" className="px-4 py-2 text-sm text-white/60 hover:text-white rounded-lg hover:bg-white/[0.06] transition-all">
                Statistik
              </a>
              <a href="#about" className="px-4 py-2 text-sm text-white/60 hover:text-white rounded-lg hover:bg-white/[0.06] transition-all">
                Tentang
              </a>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3">
              <Link href="/login" className="hidden sm:block px-5 py-2.5 text-sm font-semibold text-white/80 hover:text-white rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/[0.06] transition-all">
                Masuk
              </Link>
              <Link href="/register" className="px-5 py-2.5 text-sm font-bold bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 rounded-xl hover:shadow-lg hover:shadow-yellow-500/25 hover:-translate-y-[1px] transition-all">
                Daftar
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ========== HERO ========== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
        {/* Aurora Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-blue-600/30 to-purple-600/20 blur-[120px]"
               style={{ animation: 'aurora-float 8s ease-in-out infinite' }} />
          <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-yellow-500/15 to-orange-500/10 blur-[100px]"
               style={{ animation: 'aurora-float-reverse 10s ease-in-out infinite' }} />
          <div className="absolute bottom-[-10%] left-[30%] w-[700px] h-[400px] rounded-full bg-gradient-to-br from-teal-500/10 to-cyan-500/15 blur-[140px]"
               style={{ animation: 'aurora-float 12s ease-in-out infinite' }} />
          {/* Grid overlay */}
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
            backgroundSize: '80px 80px'
          }} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Badge */}
          <AnimatedContent distance={30} duration={0.6}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.06] border border-white/[0.1] backdrop-blur-sm mb-8">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <ShinyText text="VTC Tax Center — Platform Edukasi Pajak #1" speed={4} className="text-sm font-medium" />
            </div>
          </AnimatedContent>

          {/* Headline */}
          <SplitText
            text="Kuasai Pajak, Bangun Indonesia Lebih Baik"
            tag="h1"
            className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight"
            delay={40}
            duration={0.7}
          />

          {/* Subtitle */}
          <AnimatedContent distance={40} duration={0.8} delay={0.5}>
            <p className="mt-8 text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
              Platform edukasi perpajakan interaktif dengan materi video, kuis evaluasi, 
              dan <span className="text-yellow-400 font-semibold">AI Assistant</span> — 
              dirancang untuk mencetak relawan pajak yang kompeten.
            </p>
          </AnimatedContent>

          {/* CTA Buttons */}
          <AnimatedContent distance={30} duration={0.6} delay={0.8}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
              <Link href="/register" className="group px-8 py-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 rounded-2xl font-bold text-lg shadow-2xl shadow-yellow-500/20 hover:shadow-yellow-500/40 hover:-translate-y-1 transition-all flex items-center gap-2">
                Mulai Belajar
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/login" className="px-8 py-4 rounded-2xl font-semibold text-white/80 border border-white/15 hover:bg-white/[0.06] hover:border-white/25 transition-all flex items-center gap-2">
                Sudah Punya Akun
                <ChevronRight size={18} />
              </Link>
            </div>
          </AnimatedContent>

          {/* Hero Visual */}
          <AnimatedContent distance={60} duration={1} delay={1}>
            <div className="mt-16 mx-auto max-w-4xl relative">
              <div className="rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/[0.1] p-1 shadow-2xl">
                <div className="rounded-xl bg-[#0a1628] p-8 relative overflow-hidden">
                  {/* Fake Dashboard Preview */}
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-3 h-3 rounded-full bg-red-500/60" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                    <div className="w-3 h-3 rounded-full bg-green-500/60" />
                    <span className="ml-3 text-xs text-white/30 font-mono">dashboard.corevtc.id</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 bg-white/[0.04] rounded-xl p-4 border border-white/[0.06]">
                      <div className="flex items-center gap-2 mb-3">
                        <BookOpen size={16} className="text-yellow-400" />
                        <span className="text-sm font-semibold text-white/70">Ruang Belajar</span>
                      </div>
                      <div className="space-y-2">
                        {["Level 1 — Pengenalan PPh", "Level 2 — PPh Pasal 21", "Level 3 — PPN"].map((item, i) => (
                          <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.03]">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-green-500/20 text-green-400' : i === 1 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/[0.06] text-white/30'}`}>
                              {i + 1}
                            </div>
                            <span className="text-xs text-white/50">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-white/[0.04] rounded-xl p-4 border border-white/[0.06]">
                        <Bot size={16} className="text-blue-400 mb-2" />
                        <span className="text-xs text-white/50 block">AI Chat</span>
                        <span className="text-[10px] text-white/30 mt-1 block">Tanya apa saja tentang pajak...</span>
                      </div>
                      <div className="bg-white/[0.04] rounded-xl p-4 border border-white/[0.06]">
                        <Award size={16} className="text-yellow-400 mb-2" />
                        <span className="text-xs text-white/50 block">Progress</span>
                        <div className="mt-2 h-2 bg-white/[0.06] rounded-full overflow-hidden">
                          <div className="h-full w-[60%] bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Glow effect */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-400/5 rounded-full blur-[60px]" />
                </div>
              </div>
              {/* Reflection glow under the card */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[80%] h-20 bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent blur-2xl" />
            </div>
          </AnimatedContent>
        </div>
      </section>

      {/* ========== FEATURES ========== */}
      <section id="features" className="py-32 relative">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedContent distance={40} duration={0.7}>
            <div className="text-center mb-16">
              <span className="text-yellow-400 text-sm font-bold uppercase tracking-widest">Fitur Utama</span>
              <h2 className="text-4xl md:text-5xl font-black mt-4 leading-tight">
                Semua yang Kamu Butuhkan<br />
                <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">dalam Satu Platform</span>
              </h2>
            </div>
          </AnimatedContent>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <BookOpen size={24} />,
                title: "Ruang Belajar",
                desc: "Materi video YouTube & kuis interaktif per level. Belajar pajak jadi terstruktur dan menyenangkan.",
                color: "from-blue-500 to-cyan-500",
                glow: "bg-blue-500/10",
              },
              {
                icon: <Bot size={24} />,
                title: "AI Tax Assistant",
                desc: "Chatbot AI yang siap menjawab pertanyaan pajakmu 24/7. Powered by Gemini 2.5 Flash.",
                color: "from-purple-500 to-pink-500",
                glow: "bg-purple-500/10",
              },
              {
                icon: <Shield size={24} />,
                title: "Sertifikasi Relawan",
                desc: "Selesaikan semua level dan dapatkan sertifikasi sebagai Relawan Pajak yang diakui.",
                color: "from-yellow-400 to-amber-500",
                glow: "bg-yellow-500/10",
              },
            ].map((feature, idx) => (
              <AnimatedContent key={idx} distance={50} duration={0.7} delay={idx * 0.15}>
                <div className="group relative bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-500 h-full">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-white/50 leading-relaxed text-sm">{feature.desc}</p>
                  {/* Hover glow */}
                  <div className={`absolute inset-0 ${feature.glow} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[60px] -z-10`} />
                </div>
              </AnimatedContent>
            ))}
          </div>
        </div>
      </section>

      {/* ========== STATS ========== */}
      <section id="stats" className="py-24 relative">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedContent distance={40} duration={0.7}>
            <div className="rounded-3xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/[0.08] p-12 relative overflow-hidden">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {[
                  { value: 500, suffix: "+", label: "Relawan Pajak", icon: <Users size={20} className="text-blue-400" /> },
                  { value: 50, suffix: "+", label: "Video Materi", icon: <BookOpen size={20} className="text-green-400" /> },
                  { value: 5, suffix: " Level", label: "Kuis Evaluasi", icon: <GraduationCap size={20} className="text-yellow-400" /> },
                  { value: 24, suffix: "/7", label: "AI Support", icon: <Bot size={20} className="text-purple-400" /> },
                ].map((stat, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-center mb-3">{stat.icon}</div>
                    <div className="text-3xl md:text-4xl font-black">
                      <CountUp to={stat.value} duration={2.5} suffix={stat.suffix} />
                    </div>
                    <p className="text-white/40 text-sm font-medium">{stat.label}</p>
                  </div>
                ))}
              </div>
              {/* Background glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-32 bg-gradient-to-r from-transparent via-yellow-500/5 to-transparent blur-2xl" />
            </div>
          </AnimatedContent>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section id="about" className="py-32 relative">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <AnimatedContent distance={40} duration={0.7}>
            <span className="text-yellow-400 text-sm font-bold uppercase tracking-widest">Bergabung Sekarang</span>
            <h2 className="text-4xl md:text-5xl font-black mt-4 leading-tight mb-6">
              Jadilah Relawan Pajak<br />
              <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">yang Siap Berkontribusi</span>
            </h2>
            <p className="text-white/40 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Daftar gratis, pelajari materi perpajakan, selesaikan kuis evaluasi, dan dapatkan sertfikasi sebagai Relawan Pajak.
            </p>
            <Link href="/register" className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 rounded-2xl font-bold text-lg shadow-2xl shadow-yellow-500/20 hover:shadow-yellow-500/40 hover:-translate-y-1 transition-all">
              Daftar Sekarang — Gratis
              <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </AnimatedContent>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="border-t border-white/[0.06] py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-lg flex items-center justify-center">
              <div className="relative w-4 h-4">
                <Image src="/favicon.ico" alt="VTC" fill className="object-contain" />
              </div>
            </div>
            <span className="text-sm font-bold text-white/40">
              CORE<span className="text-yellow-500/60">VTC</span>
            </span>
          </div>
          <p className="text-white/25 text-sm">
            © {new Date().getFullYear()} VTC Tax Center. Sistem Edukasi Perpajakan.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm text-white/30 hover:text-white/60 transition-colors">Masuk</Link>
            <Link href="/register" className="text-sm text-white/30 hover:text-white/60 transition-colors">Daftar</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
