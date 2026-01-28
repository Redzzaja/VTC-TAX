"use client";

import { useState, useRef, useEffect } from "react";
import { askAiAction } from "@/actions/chat-action";
import { Send, Bot, User, RotateCw, Sparkles } from "lucide-react";

type Message = {
  id: number;
  role: "ai" | "user";
  text: string;
  time: string;
};

export default function TanyaAgentPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "ai",
      text: "Halo, Sobat Pajak! 👋\nSaya terhubung langsung dengan AI Cerdas. Tanyakan apa saja tentang perpajakan, saya siap membantu!",
      time: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto Scroll ke bawah
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 1. Tambah Pesan User
    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      text: input,
      time: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // 2. Panggil Server Action
    const res = await askAiAction(userMsg.text);

    // 3. Tambah Pesan AI
    setIsTyping(false);
    const aiMsg: Message = {
      id: Date.now() + 1,
      role: "ai",
      text: res.success ? res.answer : "Maaf, terjadi gangguan koneksi.",
      time: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, aiMsg]);
  };

  const handleReset = () => {
    setMessages([
      {
        id: Date.now(),
        role: "ai",
        text: "Chat telah direset. Silakan ajukan pertanyaan baru! 🚀",
        time: new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  };

  return (
    <div className="h-[85vh] flex flex-col bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 relative">
      {/* --- HEADER --- */}
      <div className="bg-slate-900/90 backdrop-blur-md p-4 flex justify-between items-center border-b border-slate-800 z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/20">
            <Bot size={28} className="text-slate-900" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg flex items-center gap-2">
              AGENT VTC (LIVE)
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
            </h1>
            <p className="text-slate-400 text-xs flex items-center gap-1">
              <Sparkles size={10} className="text-yellow-500" /> AI Consultant
            </p>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all border border-slate-700"
          title="Reset Chat"
        >
          <RotateCw size={18} />
        </button>
      </div>

      {/* --- CHAT AREA --- */}
      <div
        ref={chatContainerRef}
        className="flex-1 p-6 overflow-y-auto space-y-6 scroll-smooth"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, rgba(30, 41, 59, 0.4) 0%, rgba(2, 6, 23, 0.8) 100%)",
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-4 ${
              msg.role === "ai" ? "flex-row" : "flex-row-reverse"
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${
                msg.role === "ai"
                  ? "bg-yellow-500 text-slate-900"
                  : "bg-blue-600 text-white"
              }`}
            >
              {msg.role === "ai" ? <Bot size={20} /> : <User size={20} />}
            </div>

            {/* Bubble */}
            <div
              className={`relative max-w-[80%] p-4 rounded-2xl shadow-lg ${
                msg.role === "ai"
                  ? "bg-slate-800/90 text-slate-100 border border-slate-700 rounded-tl-none"
                  : "bg-gradient-to-br from-yellow-500 to-amber-600 text-slate-900 font-medium border-none rounded-tr-none"
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {msg.text}
              </p>
              <span
                className={`text-[10px] absolute bottom-1 ${
                  msg.role === "ai"
                    ? "right-3 text-slate-500"
                    : "left-3 text-amber-900/60"
                }`}
              >
                {msg.time}
              </span>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex gap-4 flex-row animate-pulse">
            <div className="w-10 h-10 rounded-full bg-yellow-500 text-slate-900 flex items-center justify-center shadow-lg">
              <Bot size={20} />
            </div>
            <div className="bg-slate-800/90 border border-slate-700 p-4 rounded-2xl rounded-tl-none flex items-center gap-1 h-12">
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
            </div>
          </div>
        )}
      </div>

      {/* --- INPUT AREA --- */}
      <div className="p-4 bg-slate-900 border-t border-slate-800">
        <form onSubmit={handleSend} className="relative max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tanya apa saja tentang pajak..."
            className="w-full bg-slate-800 text-white border border-slate-700 rounded-full py-4 pl-6 pr-16 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none shadow-inner placeholder-slate-500"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2 top-2 p-2.5 bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-900 rounded-full shadow-lg hover:shadow-yellow-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
          >
            <Send size={20} className="ml-0.5" />
          </button>
        </form>
        <p className="text-center text-slate-600 text-[10px] mt-3">
          AI dapat membuat kesalahan. Mohon verifikasi informasi penting dengan
          peraturan terbaru.
        </p>
      </div>
    </div>
  );
}
