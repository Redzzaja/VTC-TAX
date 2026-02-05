"use client";

import { useState, useEffect } from "react";
import {
  Building2,
  Globe,
  TrendingDown,
  Receipt,
  Car,
  Calculator,
  Plus,
  Trash2,
  X,
  RotateCcw,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

// --- HELPER FORMATTING ---
const formatRupiah = (num: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(num);
};

const formatNumberDots = (value: string | number) => {
  if (!value) return "";
  const rawValue = value.toString().replace(/\D/g, "");
  return rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const parseNumber = (value: string) => {
  return parseInt(value.replace(/\./g, "")) || 0;
};

export default function TaxCalculatorPage() {
  const [activeTab, setActiveTab] = useState<
    "BADAN" | "KPLN" | "PENYUSUTAN" | "PPN" | "PKB"
  >("BADAN");

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Tombol Kembali */}
      <div>
        <Link
          href="/dashboard/simulasi"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium text-sm mb-2"
        >
          <ArrowLeft size={18} /> Kembali ke Menu Simulasi
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Calculator className="text-slate-600" /> Kalkulator Perpajakan
          </h1>
          <p className="text-sm text-slate-500">
            Hitung estimasi pajak Anda dengan cepat dan akurat.
          </p>
        </div>
      </div>

      {/* Navigation Tabs (Monokrom) */}
      <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
        <div className="flex space-x-1 min-w-max">
          {[
            { id: "BADAN", label: "PPh Badan", icon: Building2 },
            { id: "KPLN", label: "Kredit LN", icon: Globe },
            { id: "PENYUSUTAN", label: "Penyusutan", icon: TrendingDown },
            { id: "PPN", label: "PPN", icon: Receipt },
            { id: "PKB", label: "PKB (Kendaraan)", icon: Car },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-slate-900 text-white shadow-md"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 min-h-125">
        {activeTab === "BADAN" && <CalcBadan />}
        {activeTab === "KPLN" && <CalcKpln />}
        {activeTab === "PENYUSUTAN" && <CalcPenyusutan />}
        {activeTab === "PPN" && <CalcPpn />}
        {activeTab === "PKB" && <CalcPkb />}
      </div>
    </div>
  );
}

// ==========================================
// 1. KALKULATOR PPh BADAN
// ==========================================
function CalcBadan() {
  const [jenis, setJenis] = useState("UMUM");
  const [omset, setOmset] = useState("");
  const [pkp, setPkp] = useState("");
  const [note, setNote] = useState("");
  const [result, setResult] = useState<{
    total: number;
    skema: string;
    tarif: string;
  } | null>(null);

  useEffect(() => {
    const valOmset = parseNumber(omset);
    if (jenis === "UMKM") {
      setNote("Menggunakan Tarif Final 0.5% dari Peredaran Bruto (PP 55).");
    } else if (jenis === "TBK") {
      setNote("Diskon Tarif 3% (Tarif 19%) dengan syarat tertentu.");
    } else {
      if (valOmset > 0 && valOmset <= 4800000000) {
        setNote(
          "Omset ≤ 4.8M: Mendapat Fasilitas Pengurangan Tarif 50% (Efektif 11%) atas seluruh PKP.",
        );
      } else if (valOmset > 4800000000 && valOmset <= 50000000000) {
        setNote(
          "Omset 4.8M - 50M: Mendapat Fasilitas Pasal 31E (Proporsional).",
        );
      } else {
        setNote("Omset > 50M: Tarif Tunggal 22% (Tidak ada fasilitas).");
      }
    }
  }, [omset, jenis]);

  const handleReset = () => {
    setJenis("UMUM");
    setOmset("");
    setPkp("");
    setResult(null);
    setNote("");
  };

  const calculate = () => {
    const valOmset = parseNumber(omset);
    const valPkp = parseNumber(pkp);
    let pph = 0;
    let skemaTxt = "";
    let tarifEfektifTxt = "";

    if (jenis === "UMKM") {
      pph = Math.floor(valOmset * 0.005);
      skemaTxt = "PP 55 Tahun 2022";
      tarifEfektifTxt = "0.5% (Final)";
    } else if (jenis === "TBK") {
      pph = Math.floor(valPkp * 0.19);
      skemaTxt = "Pasal 17 (Diskon Tbk)";
      tarifEfektifTxt = "19%";
    } else {
      if (valOmset <= 4800000000) {
        pph = Math.floor(valPkp * 0.11);
        skemaTxt = "Pasal 31E (Full)";
        tarifEfektifTxt = "11% (Fasilitas 50%)";
      } else if (valOmset <= 50000000000) {
        const pkpFasilitas = (4800000000 / valOmset) * valPkp;
        const pkpNon = valPkp - pkpFasilitas;
        pph = Math.floor(pkpFasilitas * 0.11 + pkpNon * 0.22);
        skemaTxt = "Pasal 31E (Proporsional)";
        tarifEfektifTxt = "Campuran (11% & 22%)";
      } else {
        pph = Math.floor(valPkp * 0.22);
        skemaTxt = "Pasal 17 (Tarif Tunggal)";
        tarifEfektifTxt = "22%";
      }
    }
    setResult({ total: pph, skema: skemaTxt, tarif: tarifEfektifTxt });
  };

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-4">
        <div className="bg-slate-50 p-3 rounded border border-slate-200 text-sm font-bold text-slate-700">
          FORMULIR PPh BADAN{" "}
          <span className="text-slate-400 font-normal">
            | Sesuai UU HPP & PP 55 Tahun 2022
          </span>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">
            Jenis Wajib Pajak <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full border border-slate-300 p-2.5 rounded-lg bg-white focus:ring-2 focus:ring-slate-500 outline-none"
            value={jenis}
            onChange={(e) => setJenis(e.target.value)}
          >
            <option value="UMUM">
              WP Badan Umum (Tarif Pasal 17 / Fasilitas 31E)
            </option>
            <option value="TBK">
              WP Badan Terbuka (Tbk) - Diskon Tarif 3%
            </option>
            <option value="UMKM">WP Badan UMKM (PP 55 - Final 0.5%)</option>
          </select>
        </div>

        {note && (
          <div className="text-xs text-slate-600 bg-slate-100 p-2 rounded border border-slate-200 italic">
            {note}
          </div>
        )}

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">
            Peredaran Bruto (Omset) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-slate-500 font-bold">
              Rp
            </span>
            <input
              type="text"
              className="w-full border border-slate-300 p-2.5 pl-10 rounded-lg focus:ring-2 focus:ring-slate-500 outline-none"
              placeholder="0"
              value={formatNumberDots(omset)}
              onChange={(e) => setOmset(e.target.value)}
            />
          </div>
        </div>

        {jenis !== "UMKM" && (
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Penghasilan Kena Pajak (PKP){" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-500 font-bold">
                Rp
              </span>
              <input
                type="text"
                className="w-full border border-slate-300 p-2.5 pl-10 rounded-lg focus:ring-2 focus:ring-slate-500 outline-none"
                placeholder="0"
                value={formatNumberDots(pkp)}
                onChange={(e) => setPkp(e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleReset}
            className="flex-1 bg-white border border-slate-300 text-slate-700 py-3 rounded-lg font-bold hover:bg-slate-50 transition-colors flex justify-center items-center gap-2"
          >
            <RotateCcw size={18} /> RESET
          </button>
          <button
            onClick={calculate}
            className="flex-1 bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 shadow-md transition-all active:scale-95"
          >
            HITUNG PAJAK
          </button>
        </div>
      </div>

      {/* OUTPUT PPH BADAN */}
      <div className="md:col-span-1 bg-slate-900 text-white rounded-xl p-6 flex flex-col justify-center items-center text-center shadow-xl border border-slate-700">
        <h6 className="text-slate-400 font-bold text-xs tracking-wider uppercase mb-2">
          PPh BADAN TERUTANG
        </h6>
        <div className="text-3xl font-bold mb-6 text-yellow-500">
          {result ? formatRupiah(result.total) : "Rp 0"}
        </div>

        {result && (
          <div className="w-full text-left space-y-4">
            <div className="bg-white/10 p-3 rounded-lg border border-white/10">
              <div className="text-xs text-slate-400 uppercase font-bold mb-1">
                Skema Tarif
              </div>
              <div className="font-bold text-white text-sm">{result.skema}</div>
            </div>
            <div className="bg-white/10 p-3 rounded-lg border border-white/10">
              <div className="text-xs text-slate-400 uppercase font-bold mb-1">
                Tarif Efektif
              </div>
              <div className="font-bold text-white text-sm">{result.tarif}</div>
            </div>
          </div>
        )}
        {!result && (
          <p className="text-xs text-slate-500 italic">
            Hasil perhitungan akan muncul di sini.
          </p>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 2. KALKULATOR KREDIT LN (PPh 24)
// ==========================================
function CalcKpln() {
  const [netoDn, setNetoDn] = useState("");
  const [tarif, setTarif] = useState(22);
  const [items, setItems] = useState<
    { id: number; negara: string; neto: string; pajak: string }[]
  >([]);

  const [formNegara, setFormNegara] = useState("");
  const [formNeto, setFormNeto] = useState("");
  const [formPajak, setFormPajak] = useState("");

  const [result, setResult] = useState({ credit: 0, totalPkp: 0, totalTax: 0 });

  const handleReset = () => {
    setNetoDn("");
    setTarif(22);
    setItems([]);
    setResult({ credit: 0, totalPkp: 0, totalTax: 0 });
    toast.info("Data PPh 24 direset.");
  };

  const tambahNegara = () => {
    if (!formNegara || !formNeto) return toast.error("Lengkapi data negara");
    setItems([
      ...items,
      { id: Date.now(), negara: formNegara, neto: formNeto, pajak: formPajak },
    ]);
    setFormNegara("");
    setFormNeto("");
    setFormPajak("");
  };

  const hitung = () => {
    const valNetoDn = parseNumber(netoDn);
    const valTotalNetoLn = items.reduce(
      (sum, i) => sum + parseNumber(i.neto),
      0,
    );
    const totalPkp = valNetoDn + valTotalNetoLn;
    const pphTerutang = totalPkp * (tarif / 100);

    let totalKredit = 0;
    items.forEach((i) => {
      const valNeto = parseNumber(i.neto);
      const valPajak = parseNumber(i.pajak);
      const batas = (valNeto / totalPkp) * pphTerutang;
      const kreditDiakui = Math.min(valPajak, batas);
      totalKredit += kreditDiakui;
    });

    setResult({
      credit: Math.floor(totalKredit),
      totalPkp: Math.floor(totalPkp),
      totalTax: Math.floor(pphTerutang),
    });
  };

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-6">
        <div className="bg-slate-50 p-3 rounded border border-slate-200 text-sm font-bold text-slate-700">
          KREDIT PAJAK LUAR NEGERI{" "}
          <span className="text-slate-400 font-normal">
            | Metode Ordinary Credit per Negara
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Penghasilan Neto Dalam Negeri (Rp){" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-slate-500 outline-none"
              value={formatNumberDots(netoDn)}
              onChange={(e) => setNetoDn(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Tarif PPh Badan (%) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-slate-500 outline-none"
              value={tarif}
              onChange={(e) => setTarif(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
          <h6 className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1">
            <Plus size={14} /> TAMBAH SUMBER PENGHASILAN LN
          </h6>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-1">
              <select
                className="w-full border border-slate-300 p-2 rounded text-sm bg-white focus:ring-2 focus:ring-slate-500 outline-none"
                value={formNegara}
                onChange={(e) => setFormNegara(e.target.value)}
              >
                <option value="">-- Pilih --</option>
                {[
                  "Singapura",
                  "Malaysia",
                  "Jepang",
                  "Amerika Serikat",
                  "Inggris",
                  "Australia",
                  "China",
                  "Belanda",
                  "Jerman",
                  "Lainnya",
                ].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-1">
              <input
                type="text"
                placeholder="Neto LN (Rp)"
                className="w-full border border-slate-300 p-2 rounded text-sm focus:ring-2 focus:ring-slate-500 outline-none"
                value={formatNumberDots(formNeto)}
                onChange={(e) => setFormNeto(e.target.value)}
              />
            </div>
            <div className="md:col-span-1">
              <input
                type="text"
                placeholder="Pajak LN (Rp)"
                className="w-full border border-slate-300 p-2 rounded text-sm focus:ring-2 focus:ring-slate-500 outline-none"
                value={formatNumberDots(formPajak)}
                onChange={(e) => setFormPajak(e.target.value)}
              />
            </div>
            <div className="md:col-span-1">
              <button
                onClick={tambahNegara}
                className="w-full bg-slate-800 text-white p-2 rounded text-sm font-bold hover:bg-slate-900 active:scale-95 transition-all"
              >
                Tambah
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-xs">
              <tr>
                <th className="p-3">Negara</th>
                <th className="p-3 text-right">Neto LN</th>
                <th className="p-3 text-right">Pajak LN</th>
                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="p-4 text-center text-slate-400 italic"
                  >
                    Belum ada data negara ditambahkan.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id}>
                    <td className="p-3">{item.negara}</td>
                    <td className="p-3 text-right">
                      {formatRupiah(parseNumber(item.neto))}
                    </td>
                    <td className="p-3 text-right">
                      {formatRupiah(parseNumber(item.pajak))}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() =>
                          setItems(items.filter((i) => i.id !== item.id))
                        }
                        className="text-slate-400 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleReset}
            className="flex-1 bg-white border border-slate-300 text-slate-700 py-3 rounded-lg font-bold hover:bg-slate-50 transition-colors flex justify-center items-center gap-2"
          >
            <RotateCcw size={18} /> RESET
          </button>
          <button
            onClick={hitung}
            className="flex-1 bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 shadow-md transition-all active:scale-95"
          >
            HITUNG KREDIT
          </button>
        </div>
      </div>

      <div className="md:col-span-1 bg-slate-900 text-white rounded-xl p-6 shadow-xl flex flex-col justify-between border border-slate-700">
        <div>
          <h6 className="text-slate-400 font-bold text-xs tracking-wider uppercase mb-2">
            TOTAL KREDIT PPh 24
          </h6>
          <div className="text-3xl font-bold mb-6 text-yellow-500">
            {formatRupiah(result.credit)}
          </div>

          <div className="space-y-4">
            <div className="bg-white/10 p-3 rounded-lg border border-white/10">
              <p className="text-xs text-slate-400 uppercase font-bold mb-1">
                Total PKP
              </p>
              <p className="font-mono text-lg font-bold">
                {formatRupiah(result.totalPkp)}
              </p>
            </div>
            <div className="bg-white/10 p-3 rounded-lg border border-white/10">
              <p className="text-xs text-slate-400 uppercase font-bold mb-1">
                Total PPh Terutang
              </p>
              <p className="font-mono text-lg font-bold">
                {formatRupiah(result.totalTax)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. KALKULATOR PENYUSUTAN
// ==========================================
function CalcPenyusutan() {
  const [harga, setHarga] = useState("");
  const [tahunSpt, setTahunSpt] = useState(2025);
  const [akhirBuku, setAkhirBuku] = useState("12");
  const [beliBulan, setBeliBulan] = useState("1");
  const [beliTahun, setBeliTahun] = useState("2024");

  const [jenisHarta, setJenisHarta] = useState<"HARTA" | "BANGUNAN">("HARTA");
  const [kelompok, setKelompok] = useState("1");
  const [metode, setMetode] = useState("GL");

  const [summary, setSummary] = useState<{
    beban: number;
    akum: number;
    buku: number;
  } | null>(null);
  const [hasil, setHasil] = useState<any[]>([]);

  useEffect(() => {
    if (jenisHarta === "BANGUNAN") {
      setKelompok("PERMANEN");
      setMetode("GL");
    } else {
      setKelompok("1");
    }
  }, [jenisHarta]);

  const handleReset = () => {
    setHarga("");
    setTahunSpt(2025);
    setJenisHarta("HARTA");
    setKelompok("1");
    setMetode("GL");
    setSummary(null);
    setHasil([]);
    toast.info("Penyusutan direset.");
  };

  const hitung = () => {
    const cost = parseNumber(harga);
    let masaManfaat = 0;

    if (jenisHarta === "HARTA") {
      if (kelompok === "1") masaManfaat = 4;
      if (kelompok === "2") masaManfaat = 8;
      if (kelompok === "3") masaManfaat = 16;
      if (kelompok === "4") masaManfaat = 20;
    } else {
      if (kelompok === "PERMANEN") masaManfaat = 20;
      if (kelompok === "NON_PERMANEN") masaManfaat = 10;
    }

    let tarif = 1 / masaManfaat;
    if (metode === "SM") tarif = tarif * 2;

    let nilaiBuku = cost;
    const temp = [];
    let akumulasi = 0;
    let bebanTahunIni = 0;

    for (let i = 1; i <= masaManfaat; i++) {
      let penyusutan = 0;
      if (metode === "GL") {
        penyusutan = cost / masaManfaat;
      } else {
        penyusutan = nilaiBuku * tarif;
        if (i === masaManfaat) penyusutan = nilaiBuku;
      }

      const tahunBerjalan = Number(beliTahun) + (i - 1);

      if (tahunBerjalan === tahunSpt) {
        bebanTahunIni = penyusutan;
      }

      nilaiBuku -= penyusutan;
      if (tahunBerjalan <= tahunSpt) {
        akumulasi += penyusutan;
      }

      temp.push({
        tahun: tahunBerjalan,
        biaya: Math.floor(penyusutan),
        buku: Math.floor(Math.max(0, nilaiBuku)),
      });
    }

    setHasil(temp);
    setSummary({
      beban: Math.floor(bebanTahunIni),
      akum: Math.floor(akumulasi),
      buku: Math.floor(cost - akumulasi),
    });
  };

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-4">
        <div className="bg-slate-50 p-3 rounded border border-slate-200 text-sm font-bold text-slate-700">
          PENYUSUTAN FISKAL{" "}
          <span className="text-slate-400 font-normal">
            | Metode Garis Lurus & Saldo Menurun
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Tahun SPT Pelaporan
            </label>
            <input
              type="number"
              className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-slate-500 outline-none"
              value={tahunSpt}
              onChange={(e) => setTahunSpt(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Akhir Tahun Buku
            </label>
            <select
              className="w-full border border-slate-300 p-2.5 rounded-lg bg-white focus:ring-2 focus:ring-slate-500 outline-none"
              value={akhirBuku}
              onChange={(e) => setAkhirBuku(e.target.value)}
            >
              <option value="12">Desember</option>
              <option value="3">Maret</option>
              <option value="6">Juni</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">
            Harga Perolehan (Rp)
          </label>
          <input
            type="text"
            className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-slate-500 outline-none"
            value={formatNumberDots(harga)}
            onChange={(e) => setHarga(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">
            Waktu Perolehan
          </label>
          <div className="flex gap-2">
            <select
              className="w-2/3 border border-slate-300 p-2.5 rounded-lg bg-white focus:ring-2 focus:ring-slate-500 outline-none"
              value={beliBulan}
              onChange={(e) => setBeliBulan(e.target.value)}
            >
              {[
                "Januari",
                "Februari",
                "Maret",
                "April",
                "Mei",
                "Juni",
                "Juli",
                "Agustus",
                "September",
                "Oktober",
                "November",
                "Desember",
              ].map((m, i) => (
                <option key={i} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>
            <input
              type="number"
              className="w-1/3 border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-slate-500 outline-none"
              value={beliTahun}
              onChange={(e) => setBeliTahun(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Jenis Harta
          </label>
          <div className="flex gap-4">
            <label
              className={`flex-1 border p-3 rounded-lg cursor-pointer text-center font-medium transition-colors ${jenisHarta === "HARTA" ? "bg-slate-100 border-slate-400 text-slate-900" : "bg-white border-slate-200 text-slate-500"}`}
            >
              <input
                type="radio"
                name="jenisHarta"
                value="HARTA"
                checked={jenisHarta === "HARTA"}
                onChange={() => setJenisHarta("HARTA")}
                className="hidden"
              />
              Harta Berwujud
            </label>
            <label
              className={`flex-1 border p-3 rounded-lg cursor-pointer text-center font-medium transition-colors ${jenisHarta === "BANGUNAN" ? "bg-slate-100 border-slate-400 text-slate-900" : "bg-white border-slate-200 text-slate-500"}`}
            >
              <input
                type="radio"
                name="jenisHarta"
                value="BANGUNAN"
                checked={jenisHarta === "BANGUNAN"}
                onChange={() => setJenisHarta("BANGUNAN")}
                className="hidden"
              />
              Bangunan
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">
            Kelompok Harta
          </label>
          <select
            className="w-full border border-slate-300 p-2.5 rounded-lg bg-white focus:ring-2 focus:ring-slate-500 outline-none"
            value={kelompok}
            onChange={(e) => setKelompok(e.target.value)}
          >
            {jenisHarta === "HARTA" ? (
              <>
                <option value="1">Kelompok 1 (4 Tahun - 25% / 50%)</option>
                <option value="2">Kelompok 2 (8 Tahun - 12.5% / 25%)</option>
                <option value="3">Kelompok 3 (16 Tahun - 6.25% / 12.5%)</option>
                <option value="4">Kelompok 4 (20 Tahun - 5% / 10%)</option>
              </>
            ) : (
              <>
                <option value="PERMANEN">
                  Kelompok Bangunan Permanen (20 Tahun - 5%)
                </option>
                <option value="NON_PERMANEN">
                  Kelompok Bangunan Tidak Permanen (10 Tahun - 10%)
                </option>
              </>
            )}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">
            Metode Penyusutan
          </label>
          <select
            className="w-full border border-slate-300 p-2.5 rounded-lg bg-white focus:ring-2 focus:ring-slate-500 outline-none"
            value={metode}
            onChange={(e) => setMetode(e.target.value)}
            disabled={jenisHarta === "BANGUNAN"}
          >
            <option value="GL">Garis Lurus (Straight Line)</option>
            {jenisHarta === "HARTA" && (
              <option value="SM">Saldo Menurun (Declining Balance)</option>
            )}
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleReset}
            className="flex-1 bg-white border border-slate-300 text-slate-700 py-3 rounded-lg font-bold hover:bg-slate-50 transition-colors flex justify-center items-center gap-2"
          >
            <RotateCcw size={18} /> RESET
          </button>
          <button
            onClick={hitung}
            className="flex-1 bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 shadow-md transition-all active:scale-95"
          >
            HITUNG PENYUSUTAN
          </button>
        </div>
      </div>

      {/* OUTPUT PENYUSUTAN */}
      <div className="md:col-span-1 bg-slate-900 text-white rounded-xl p-6 flex flex-col border border-slate-700 shadow-xl h-fit">
        {!summary ? (
          <div className="h-40 flex flex-col items-center justify-center text-slate-500 italic">
            <TrendingDown size={32} className="mb-2 opacity-50" />
            Hasil perhitungan akan muncul di sini.
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h6 className="text-slate-400 font-bold text-xs tracking-wider uppercase mb-1">
                BEBAN PENYUSUTAN TAHUN {tahunSpt}
              </h6>
              <div className="text-3xl font-bold text-yellow-500">
                {formatRupiah(summary.beban)}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700 space-y-4">
              <div>
                <div className="text-xs text-slate-400 font-bold uppercase mb-1">
                  Akumulasi Penyusutan
                </div>
                <div className="text-lg font-bold text-white">
                  {formatRupiah(summary.akum)}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400 font-bold uppercase mb-1">
                  Nilai Buku Akhir
                </div>
                <div className="text-lg font-bold text-white">
                  {formatRupiah(summary.buku)}
                </div>
              </div>
            </div>
          </div>
        )}

        {hasil.length > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-700">
            <div className="text-xs text-slate-500 uppercase font-bold mb-2">
              Rincian Per Tahun
            </div>
            <div className="max-h-40 overflow-y-auto pr-1">
              <table className="w-full text-xs text-left text-slate-300">
                <tbody>
                  {hasil.map((row) => (
                    <tr key={row.tahun} className="border-b border-slate-800">
                      <td className="py-1">{row.tahun}</td>
                      <td className="py-1 text-right">
                        {formatNumberDots(row.biaya)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 4. KALKULATOR PPN
// ==========================================
function CalcPpn() {
  const [dpp, setDpp] = useState("");
  const [rate, setRate] = useState(12);
  const [jenis, setJenis] = useState("UMUM");
  const [result, setResult] = useState(0);

  const handleReset = () => {
    setDpp("");
    setRate(12);
    setJenis("UMUM");
    setResult(0);
    toast.info("PPN direset.");
  };

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-4">
        <div className="bg-slate-50 p-3 rounded border border-slate-200 text-sm font-bold text-slate-700">
          KALKULATOR PPN{" "}
          <span className="text-slate-400 font-normal">
            | UU HPP - Tarif Efektif 12% (2025)
          </span>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">
            Jenis Pengenaan PPN <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full border border-slate-300 p-2.5 rounded-lg bg-white focus:ring-2 focus:ring-slate-500 outline-none"
            value={jenis}
            onChange={(e) => setJenis(e.target.value)}
          >
            <option value="UMUM">Tarif Umum (12%)</option>
            <option value="EKSPOR">Ekspor BKP/JKP (0%)</option>
            <option value="BESARAN">
              Besaran Tertentu (Kendaraan Bekas, Emas, dll)
            </option>
            <option value="KMS">PPN Membangun Sendiri (KMS)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">
            Dasar Pengenaan Pajak (DPP) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-slate-500 font-bold">
              Rp
            </span>
            <input
              type="text"
              className="w-full border border-slate-300 p-2.5 pl-10 rounded-lg focus:ring-2 focus:ring-slate-500 outline-none"
              placeholder="0"
              value={formatNumberDots(dpp)}
              onChange={(e) => setDpp(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">
            Tarif PPN (%)
          </label>
          <div className="relative">
            <input
              type="number"
              className="w-full border border-slate-300 p-2.5 pr-10 rounded-lg focus:ring-2 focus:ring-slate-500 outline-none"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
            />
            <span className="absolute right-3 top-2.5 text-slate-500 font-bold">
              %
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            *Tarif standar 12% berlaku mulai 1 Januari 2025.
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleReset}
            className="flex-1 bg-white border border-slate-300 text-slate-700 py-3 rounded-lg font-bold hover:bg-slate-50 transition-colors flex justify-center items-center gap-2"
          >
            <RotateCcw size={18} /> RESET
          </button>
          <button
            onClick={() =>
              setResult(Math.floor(parseNumber(dpp) * (rate / 100)))
            }
            className="flex-1 bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 shadow-md transition-all active:scale-95"
          >
            HITUNG PPN
          </button>
        </div>
      </div>

      <div className="md:col-span-1 bg-slate-900 text-white rounded-xl p-6 flex flex-col justify-center items-center text-center shadow-xl border border-slate-700">
        <h6 className="text-slate-400 font-bold text-xs tracking-wider uppercase mb-2">
          PPN TERUTANG
        </h6>
        <div className="text-3xl font-bold mb-4 text-emerald-400">
          {formatRupiah(result)}
        </div>
        <div className="bg-white/10 p-3 rounded-lg text-xs text-slate-300 border border-white/10">
          Hasil perhitungan PPN muncul di sini.
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 5. KALKULATOR PKB (KENDARAAN)
// ==========================================
function CalcPkb() {
  const [njkb, setNjkb] = useState("");
  const [provinsi, setProvinsi] = useState(2);
  const [urutan, setUrutan] = useState(1);
  const [bobot, setBobot] = useState(1.0);
  const [swdkllj, setSwdkllj] = useState(143000);
  const [result, setResult] = useState<{
    total: number;
    pokok: number;
    opsen: number;
  } | null>(null);

  const handleReset = () => {
    setNjkb("");
    setProvinsi(2);
    setUrutan(1);
    setBobot(1.0);
    setSwdkllj(143000);
    setResult(null);
    toast.info("PKB direset.");
  };

  const hitung = () => {
    const valNjkb = parseNumber(njkb);
    const tarifProgresif = (provinsi + (urutan - 1) * 0.5) / 100;

    const pkbPokok = Math.floor(valNjkb * bobot * tarifProgresif);
    const opsen = Math.floor(pkbPokok * 0.66); // UU HKPD Opsen 66%
    const total = pkbPokok + opsen + swdkllj;

    setResult({ total, pokok: pkbPokok, opsen });
  };

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-4">
        <div className="bg-slate-50 p-3 rounded border border-slate-200 text-sm font-bold text-slate-700">
          PAJAK KENDARAAN BERMOTOR (PKB){" "}
          <span className="text-slate-400 font-normal">
            | UU HKPD No. 1/2022 (Opsen 66%)
          </span>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">
            Jenis Kendaraan
          </label>
          <select
            className="w-full border border-slate-300 p-2.5 rounded-lg bg-white focus:ring-2 focus:ring-slate-500 outline-none"
            onChange={(e) => {
              if (e.target.value === "MOTOR") setSwdkllj(35000);
              else setSwdkllj(143000);
            }}
          >
            <option value="MOBIL">Mobil Penumpang</option>
            <option value="MOTOR">Sepeda Motor</option>
            <option value="TRUK">Truk / Pick Up</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">
            NJKB (Nilai Jual) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-slate-500 font-bold">
              Rp
            </span>
            <input
              type="text"
              className="w-full border border-slate-300 p-2.5 pl-10 rounded-lg focus:ring-2 focus:ring-slate-500 outline-none"
              placeholder="0"
              value={formatNumberDots(njkb)}
              onChange={(e) => setNjkb(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Provinsi (Tarif Daerah)
            </label>
            <select
              className="w-full border border-slate-300 p-2.5 rounded-lg bg-white focus:ring-2 focus:ring-slate-500 outline-none"
              value={provinsi}
              onChange={(e) => setProvinsi(Number(e.target.value))}
            >
              <option value={2}>DKI Jakarta (2%)</option>
              <option value={1.75}>Jawa Barat (1.75%)</option>
              <option value={1.5}>Jawa Tengah (1.5%)</option>
              <option value={1.5}>Jawa Timur (1.5%)</option>
              <option value={1.5}>DI Yogyakarta (1.5%)</option>
              <option value={1.5}>Bali (1.5%)</option>
              <option value={1.5}>Lainnya (Default 1.5%)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Kepemilikan Ke-
            </label>
            <select
              className="w-full border border-slate-300 p-2.5 rounded-lg bg-white focus:ring-2 focus:ring-slate-500 outline-none"
              value={urutan}
              onChange={(e) => setUrutan(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} ({n === 1 ? "Pertama" : "dst"})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Koefisien Bobot
            </label>
            <select
              className="w-full border border-slate-300 p-2.5 rounded-lg bg-white focus:ring-2 focus:ring-slate-500 outline-none"
              value={bobot}
              onChange={(e) => setBobot(Number(e.target.value))}
            >
              <option value={1}>1.0 (Minibus/Sedan/Motor)</option>
              <option value={1.05}>1.05 (Jeep/SUV)</option>
              <option value={1.1}>1.1 (Truk Ringan)</option>
              <option value={1.3}>1.3 (Truk/Alat Berat)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Biaya SWDKLLJ
            </label>
            <input
              type="text"
              className="w-full border border-slate-300 p-2.5 rounded-lg bg-slate-100"
              value={formatRupiah(swdkllj)}
              readOnly
            />
          </div>
        </div>

        {/* Info Tarif Dinamis */}
        <div className="flex gap-4 text-xs text-slate-500 bg-slate-50 p-2 rounded border border-slate-200">
          <span>
            Tarif PKB: <strong>{provinsi + (urutan - 1) * 0.5}%</strong>
          </span>
          <span>
            Tarif Opsen: <strong>66%</strong>
          </span>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleReset}
            className="flex-1 bg-white border border-slate-300 text-slate-700 py-3 rounded-lg font-bold hover:bg-slate-50 transition-colors flex justify-center items-center gap-2"
          >
            <RotateCcw size={18} /> RESET
          </button>
          <button
            onClick={hitung}
            className="flex-1 bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 shadow-md transition-all active:scale-95"
          >
            HITUNG PAJAK
          </button>
        </div>
      </div>

      {/* OUTPUT PKB */}
      <div className="md:col-span-1 bg-slate-900 text-white rounded-xl p-6 flex flex-col justify-center items-center text-center shadow-xl border border-slate-700">
        <h6 className="text-slate-400 font-bold text-xs tracking-wider uppercase mb-2">
          TOTAL BAYAR (ESTIMASI)
        </h6>
        <div className="text-3xl font-bold mb-6 text-yellow-500">
          {result ? formatRupiah(result.total) : "Rp 0"}
        </div>

        {result ? (
          <div className="w-full text-left space-y-3">
            <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
              <span className="text-slate-400">PKB Pokok</span>
              <span className="font-bold">
                {formatNumberDots(result.pokok)}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
              <span className="text-slate-400">Opsen PKB (Kab/Kota)</span>
              <span className="font-bold">
                {formatNumberDots(result.opsen)}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm pb-2">
              <span className="text-slate-400">SWDKLLJ</span>
              <span className="font-bold text-yellow-500">
                {formatNumberDots(swdkllj)}
              </span>
            </div>
            <div className="mt-4 text-[10px] text-slate-500 text-center italic bg-black/20 p-2 rounded">
              Note: Belum termasuk biaya administrasi STNK/TNKB.
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic">
            Total Pajak Kendaraan muncul di sini.
          </p>
        )}
      </div>
    </div>
  );
}
