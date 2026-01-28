"use client";

import { useState } from "react";
import {
  Building2,
  Globe2,
  TrendingDown,
  Receipt,
  Car,
  Calculator,
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  Info,
} from "lucide-react";

// --- UTILITIES ---
const formatNumber = (num: string | number) => {
  if (!num) return "";
  const str = num.toString().replace(/\D/g, "");
  return str.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const parseNumber = (text: string | number) => {
  if (!text) return 0;
  return parseFloat(text.toString().replace(/\./g, ""));
};

const calculatorMenus = [
  {
    id: "badan",
    title: "PPh Badan",
    desc: "Hitung PPh Badan (Tarif Umum / Fasilitas 31E / UMKM PP 55)",
    icon: Building2,
    color: "bg-blue-600",
  },
  {
    id: "kredit",
    title: "Kredit Pajak LN",
    desc: "Hitung Kredit PPh Pasal 24 per Negara (Ordinary Credit)",
    icon: Globe2,
    color: "bg-emerald-600",
  },
  {
    id: "susut",
    title: "Penyusutan",
    desc: "Simulasi Penyusutan Fiskal (Garis Lurus & Saldo Menurun)",
    icon: TrendingDown,
    color: "bg-indigo-600",
  },
  {
    id: "ppn",
    title: "PPN & PPnBM",
    desc: "Hitung PPN (Tarif Efektif 12%) & PPnBM",
    icon: Receipt,
    color: "bg-purple-600",
  },
  {
    id: "pkb",
    title: "Pajak Kendaraan",
    desc: "Estimasi PKB & Opsen Pajak (UU HKPD)",
    icon: Car,
    color: "bg-orange-600",
  },
];

export default function KalkulatorPage() {
  const [activeView, setActiveView] = useState("menu");

  // --- STATE PPH BADAN ---
  const [badan, setBadan] = useState({ jenis: "UMUM", omset: "", pkp: "" });
  const [hasilBadan, setHasilBadan] = useState<any>(null);

  // --- STATE KREDIT LN ---
  const [kplnDn, setKplnDn] = useState("");
  const [kplnTarif, setKplnTarif] = useState("22");
  const [kplnList, setKplnList] = useState<any[]>([]);
  const [kplnForm, setKplnForm] = useState({
    negara: "Singapura",
    neto: "",
    pajak: "",
  });
  const [hasilKpln, setHasilKpln] = useState<any>(null);

  // --- STATE PENYUSUTAN ---
  const [susut, setSusut] = useState({
    sptYear: "2025",
    buyYear: "2024",
    buyMonth: "1",
    price: "",
    type: "HARTA", // HARTA | BANGUNAN
    group: "1",
    method: "GL",
  });
  const [hasilSusut, setHasilSusut] = useState<any>(null);

  // --- STATE PPN ---
  const [ppn, setPpn] = useState({ jenis: "UMUM", dpp: "", tarif: "12" });
  const [hasilPpn, setHasilPpn] = useState<any>(null);

  // --- STATE PKB ---
  const [pkb, setPkb] = useState({
    jenis: "MOBIL",
    prov: "LAIN",
    urutan: "1",
    njkb: "",
    bobot: "1",
    swdkllj: "143.000",
  });
  const [hasilPkb, setHasilPkb] = useState<any>(null);

  // ==================== LOGIC 1: PPH BADAN ====================
  const hitungBadan = () => {
    const omset = parseNumber(badan.omset);
    const pkp = parseNumber(badan.pkp);
    let pph = 0;
    let ket = "";
    let detail = "";

    if (badan.jenis === "UMKM") {
      pph = Math.floor(omset * 0.005);
      ket = "Tarif Final UMKM 0.5% (PP 55/2022)";
      detail = "Dihitung dari Peredaran Bruto";
    } else if (badan.jenis === "TBK") {
      pph = Math.floor(pkp * 0.19);
      ket = "Tarif Diskon Tbk (19%)";
      detail = "Diskon 3% dari tarif normal 22%";
    } else {
      // WP BADAN UMUM (Fasilitas 31E)
      if (omset <= 4800000000) {
        pph = Math.floor(pkp * 0.11); // 50% x 22%
        ket = "Fasilitas Pasal 31E (Full)";
        detail = "Seluruh PKP mendapat diskon tarif 50%";
      } else if (omset <= 50000000000) {
        const pkpFasilitas = (4800000000 / omset) * pkp;
        const pkpNon = pkp - pkpFasilitas;
        const pphFas = pkpFasilitas * 0.11;
        const pphNon = pkpNon * 0.22;
        pph = Math.floor(pphFas + pphNon);
        ket = "Fasilitas Pasal 31E (Proporsional)";
        detail = `Fasilitas: Rp ${Math.floor(pphFas).toLocaleString(
          "id-ID"
        )} | Non-Fas: Rp ${Math.floor(pphNon).toLocaleString("id-ID")}`;
      } else {
        pph = Math.floor(pkp * 0.22);
        ket = "Tarif Umum Pasal 17 (22%)";
        detail = "Omset > 50M tidak mendapat fasilitas";
      }
    }
    setHasilBadan({ pph, ket, detail });
  };

  // ==================== LOGIC 2: KREDIT LN (ORDINARY CREDIT) ====================
  const addKpln = () => {
    if (!kplnForm.neto) return alert("Isi Penghasilan Neto LN!");
    setKplnList([...kplnList, { ...kplnForm, id: Date.now() }]);
    setKplnForm({ ...kplnForm, neto: "", pajak: "" }); // Reset input
  };

  const hitungKreditTotal = () => {
    const netoDn = parseNumber(kplnDn);
    const tarif = parseFloat(kplnTarif) / 100;

    // 1. Total Penghasilan
    const totalNetoLn = kplnList.reduce(
      (acc, curr) => acc + parseNumber(curr.neto),
      0
    );
    let totalPkp = netoDn + totalNetoLn;
    if (totalPkp < 0) totalPkp = 0; // Rugi

    // 2. PPh Terutang
    const pphTerutang = Math.floor(totalPkp * tarif);

    // 3. Hitung Kredit Per Negara (Limit)
    let totalKredit = 0;
    const detailList = kplnList.map((item) => {
      const netLn = parseNumber(item.neto);
      const taxLn = parseNumber(item.pajak);

      // Batas Max = (Neto Negara / Total PKP) * PPh Terutang
      const maxKredit = totalPkp > 0 ? (netLn / totalPkp) * pphTerutang : 0;
      const kreditDiakui = Math.min(taxLn, maxKredit);

      totalKredit += kreditDiakui;
      return { ...item, max: maxKredit, allowed: kreditDiakui };
    });

    setHasilKpln({ totalPkp, pphTerutang, totalKredit, detailList });
  };

  // ==================== LOGIC 3: PENYUSUTAN FISKAL ====================
  const hitungSusut = () => {
    const cost = parseNumber(susut.price);
    const sptYear = parseInt(susut.sptYear);
    const buyYear = parseInt(susut.buyYear);
    const buyMonth = parseInt(susut.buyMonth);

    // Tentukan Rate & Masa Manfaat
    let rate = 0;
    let masa = 0;

    if (susut.type === "BANGUNAN") {
      masa = susut.group === "PERMANEN" ? 20 : 10;
      rate = susut.group === "PERMANEN" ? 0.05 : 0.1;
      // Bangunan wajib GL
    } else {
      if (susut.group === "1") {
        masa = 4;
        rate = susut.method === "GL" ? 0.25 : 0.5;
      }
      if (susut.group === "2") {
        masa = 8;
        rate = susut.method === "GL" ? 0.125 : 0.25;
      }
      if (susut.group === "3") {
        masa = 16;
        rate = susut.method === "GL" ? 0.0625 : 0.125;
      }
      if (susut.group === "4") {
        masa = 20;
        rate = susut.method === "GL" ? 0.05 : 0.1;
      }
    }

    let bookValue = cost;
    let accumDepr = 0;
    let currentExpense = 0;

    // Loop dari tahun beli sampai tahun SPT
    for (let y = buyYear; y <= sptYear; y++) {
      let months = 12;
      if (y === buyYear) months = 13 - buyMonth; // Pro-rate tahun pertama

      let expense = 0;

      if (bookValue > 0) {
        if (susut.method === "GL" || susut.type === "BANGUNAN") {
          // GL: (Harga x Tarif) x Bulan/12
          expense = cost * rate * (months / 12);
        } else {
          // SM: (Nilai Buku x Tarif) x Bulan/12
          expense = bookValue * rate * (months / 12);
        }

        // Cek agar tidak minus (terutama akhir masa manfaat)
        if (expense > bookValue) expense = bookValue;
      }

      bookValue -= expense;
      accumDepr += expense;

      if (y === sptYear) currentExpense = expense;
    }

    setHasilSusut({
      year: sptYear,
      expense: currentExpense,
      accum: accumDepr,
      book: bookValue,
    });
  };

  // ==================== LOGIC 4: PPN ====================
  const hitungPpn = () => {
    const dpp = parseNumber(ppn.dpp);
    const rate = parseFloat(ppn.tarif) / 100;
    const tax = Math.floor(dpp * rate);

    setHasilPpn({ tax: tax, total: dpp + tax });
  };

  // ==================== LOGIC 5: PKB (OPSEN) ====================
  const hitungPkb = () => {
    // Tarif Dasar per Provinsi (Simulasi Data)
    const baseRates: any = {
      DKI: 2.0,
      JABAR: 1.75,
      JATENG: 1.5,
      JATIM: 1.5,
      BALI: 1.5,
      LAIN: 1.5,
    };
    const base = baseRates[pkb.prov] || 1.5;

    // Progresif: +0.5% setiap kenaikan urutan
    const urutan = parseInt(pkb.urutan);
    const tarifFinal = base + (urutan - 1) * 0.5;

    const njkb = parseNumber(pkb.njkb);
    const bobot = parseFloat(pkb.bobot);

    // Hitung
    const pkbPokok = Math.floor(njkb * bobot * (tarifFinal / 100));
    const opsen = Math.floor(pkbPokok * 0.66); // UU HKPD Opsen 66%
    const swdkllj = parseNumber(pkb.swdkllj);
    const admin = 200000; // Estimasi Admin STNK/TNKB

    setHasilPkb({
      pkbPokok,
      opsen,
      swdkllj,
      admin,
      total: pkbPokok + opsen + swdkllj + admin,
      tarif: tarifFinal,
    });
  };

  // --- WRAPPER KOMPONEN ---
  const PageWrapper = ({ title, children }: any) => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <button
          onClick={() => setActiveView("menu")}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-bold text-gray-600 transition"
        >
          <ArrowLeft size={16} /> Kembali ke Menu
        </button>
      </div>
      {children}
    </div>
  );

  // --- 1. MENU UTAMA ---
  if (activeView === "menu") {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Calculator className="text-blue-600" /> Pusat Kalkulator Pajak
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Pilih jenis kalkulator perpajakan yang ingin Anda gunakan
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {calculatorMenus.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group flex flex-col justify-between h-full"
            >
              <div>
                <div
                  className={`w-12 h-12 rounded-lg ${item.color} bg-opacity-10 flex items-center justify-center mb-4`}
                >
                  <item.icon
                    className={`w-6 h-6 ${item.color.replace("bg-", "text-")}`}
                  />
                </div>
                <h3 className="font-bold text-gray-800 mb-2 text-lg">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                  {item.desc}
                </p>
              </div>
              <div className="text-sm font-bold text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all mt-auto">
                Gunakan Kalkulator <ArrowRight size={16} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- 2. PPH BADAN ---
  if (activeView === "badan") {
    return (
      <PageWrapper title="Kalkulator PPh Badan">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Jenis Wajib Pajak
              </label>
              <select
                className="w-full border rounded-lg px-3 py-2 bg-white"
                value={badan.jenis}
                onChange={(e) => setBadan({ ...badan, jenis: e.target.value })}
              >
                <option value="UMUM">
                  WP Badan Umum (Tarif Pasal 17 / 31E)
                </option>
                <option value="TBK">WP Badan Terbuka (Diskon Tarif 3%)</option>
                <option value="UMKM">WP Badan UMKM (PP 55 - Final 0.5%)</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Peredaran Bruto (Omset)
              </label>
              <input
                className="w-full border rounded-lg px-3 py-2"
                placeholder="0"
                value={badan.omset}
                onChange={(e) =>
                  setBadan({ ...badan, omset: formatNumber(e.target.value) })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Penghasilan Kena Pajak (PKP)
              </label>
              <input
                className="w-full border rounded-lg px-3 py-2"
                placeholder="0"
                value={badan.pkp}
                onChange={(e) =>
                  setBadan({ ...badan, pkp: formatNumber(e.target.value) })
                }
                disabled={badan.jenis === "UMKM"}
                style={{ opacity: badan.jenis === "UMKM" ? 0.5 : 1 }}
              />
            </div>
            <button
              onClick={hitungBadan}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700"
            >
              HITUNG PAJAK
            </button>
          </div>
          <div className="bg-slate-900 text-white p-6 rounded-xl flex flex-col justify-center text-center">
            {hasilBadan ? (
              <div className="animate-in fade-in zoom-in duration-300">
                <h6 className="text-blue-400 font-bold uppercase text-xs mb-1">
                  PPh Badan Terutang
                </h6>
                <div className="text-4xl font-bold mb-3">
                  Rp {hasilBadan.pph.toLocaleString("id-ID")}
                </div>
                <div className="bg-white/10 p-3 rounded text-left">
                  <div className="text-xs text-gray-400 mb-1">Skema Tarif</div>
                  <div className="font-bold text-sm mb-2">{hasilBadan.ket}</div>
                  <div className="text-xs text-gray-300 italic">
                    {hasilBadan.detail}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Hasil perhitungan muncul di sini.</p>
            )}
          </div>
        </div>
      </PageWrapper>
    );
  }

  // --- 3. KREDIT LN (ORDINARY CREDIT) ---
  if (activeView === "kredit") {
    return (
      <PageWrapper title="Kredit PPh Pasal 24 (Luar Negeri)">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h6 className="font-bold text-gray-800 mb-3 border-bottom pb-2">
              1. Data Penghasilan
            </h6>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs font-bold text-gray-600">
                  Neto Dalam Negeri (Rp)
                </label>
                <input
                  className="w-full border rounded px-2 py-1.5"
                  value={kplnDn}
                  onChange={(e) => setKplnDn(formatNumber(e.target.value))}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600">
                  Tarif Badan (%)
                </label>
                <input
                  className="w-full border rounded px-2 py-1.5"
                  type="number"
                  value={kplnTarif}
                  onChange={(e) => setKplnTarif(e.target.value)}
                />
              </div>
            </div>

            <h6 className="font-bold text-gray-800 mb-3 border-bottom pb-2 mt-4">
              2. Tambah Negara Sumber
            </h6>
            <div className="grid grid-cols-3 gap-2 mb-2">
              <select
                className="border rounded px-2 py-1.5 text-sm"
                value={kplnForm.negara}
                onChange={(e) =>
                  setKplnForm({ ...kplnForm, negara: e.target.value })
                }
              >
                <option>Singapura</option>
                <option>Malaysia</option>
                <option>Amerika Serikat</option>
                <option>Australia</option>
                <option>Lainnya</option>
              </select>
              <input
                className="border rounded px-2 py-1.5 text-sm"
                placeholder="Neto LN"
                value={kplnForm.neto}
                onChange={(e) =>
                  setKplnForm({
                    ...kplnForm,
                    neto: formatNumber(e.target.value),
                  })
                }
              />
              <input
                className="border rounded px-2 py-1.5 text-sm"
                placeholder="Pajak LN"
                value={kplnForm.pajak}
                onChange={(e) =>
                  setKplnForm({
                    ...kplnForm,
                    pajak: formatNumber(e.target.value),
                  })
                }
              />
            </div>
            <button
              onClick={addKpln}
              className="btn btn-sm w-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 hover:bg-emerald-100 mb-4"
            >
              + Tambah Negara
            </button>

            <table className="w-full text-xs text-left mb-4">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">Negara</th>
                  <th className="p-2 text-right">Neto</th>
                  <th className="p-2 text-right">Pajak</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {kplnList.map((item, idx) => (
                  <tr key={item.id} className="border-b">
                    <td className="p-2">{item.negara}</td>
                    <td className="p-2 text-right">{item.neto}</td>
                    <td className="p-2 text-right">{item.pajak}</td>
                    <td
                      className="p-2 text-center text-red-500 cursor-pointer"
                      onClick={() => {
                        const newList = [...kplnList];
                        newList.splice(idx, 1);
                        setKplnList(newList);
                      }}
                    >
                      <Trash2 size={14} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              onClick={hitungKreditTotal}
              className="w-full bg-emerald-600 text-white py-2 rounded-lg font-bold hover:bg-emerald-700"
            >
              HITUNG TOTAL KREDIT
            </button>
          </div>

          <div className="bg-slate-900 text-white p-6 rounded-xl">
            {hasilKpln ? (
              <div className="space-y-4">
                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <span className="text-gray-400 text-sm">
                    Total PKP (DN+LN)
                  </span>
                  <span className="font-bold">
                    Rp {hasilKpln.totalPkp.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <span className="text-gray-400 text-sm">
                    Total PPh Terutang
                  </span>
                  <span className="font-bold">
                    Rp {hasilKpln.pphTerutang.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="bg-emerald-900/50 p-4 rounded border border-emerald-700/50 text-center">
                  <div className="text-emerald-400 text-xs font-bold uppercase mb-1">
                    Total Kredit PPh 24 Diakui
                  </div>
                  <div className="text-3xl font-bold text-white">
                    Rp {hasilKpln.totalKredit.toLocaleString("id-ID")}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 pt-10">
                Hasil perhitungan kredit akan muncul di sini.
              </div>
            )}
          </div>
        </div>
      </PageWrapper>
    );
  }

  // --- 4. PENYUSUTAN ---
  if (activeView === "susut") {
    return (
      <PageWrapper title="Simulasi Penyusutan Fiskal">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">
                Tahun Pelaporan SPT
              </label>
              <input
                type="number"
                className="w-full border rounded px-3 py-2"
                value={susut.sptYear}
                onChange={(e) =>
                  setSusut({ ...susut, sptYear: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">
                Harga Perolehan
              </label>
              <input
                className="w-full border rounded px-3 py-2"
                value={susut.price}
                onChange={(e) =>
                  setSusut({ ...susut, price: formatNumber(e.target.value) })
                }
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">
                Bulan & Tahun Beli
              </label>
              <div className="flex gap-1">
                <select
                  className="border rounded w-1/2"
                  value={susut.buyMonth}
                  onChange={(e) =>
                    setSusut({ ...susut, buyMonth: e.target.value })
                  }
                >
                  {[...Array(12)].map((_, i) => (
                    <option key={i} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  className="border rounded w-1/2"
                  value={susut.buyYear}
                  onChange={(e) =>
                    setSusut({ ...susut, buyYear: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">
                Jenis Harta
              </label>
              <div className="flex gap-2">
                <label className="flex items-center gap-1 text-sm">
                  <input
                    type="radio"
                    name="stype"
                    checked={susut.type === "HARTA"}
                    onChange={() =>
                      setSusut({ ...susut, type: "HARTA", method: "GL" })
                    }
                  />{" "}
                  Harta
                </label>
                <label className="flex items-center gap-1 text-sm">
                  <input
                    type="radio"
                    name="stype"
                    checked={susut.type === "BANGUNAN"}
                    onChange={() =>
                      setSusut({
                        ...susut,
                        type: "BANGUNAN",
                        group: "PERMANEN",
                        method: "GL",
                      })
                    }
                  />{" "}
                  Bangunan
                </label>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">
                Kelompok
              </label>
              <select
                className="w-full border rounded px-3 py-2 text-sm"
                value={susut.group}
                onChange={(e) => setSusut({ ...susut, group: e.target.value })}
              >
                {susut.type === "HARTA" ? (
                  <>
                    <option value="1">Kelompok 1 (4 Tahun)</option>
                    <option value="2">Kelompok 2 (8 Tahun)</option>
                    <option value="3">Kelompok 3 (16 Tahun)</option>
                    <option value="4">Kelompok 4 (20 Tahun)</option>
                  </>
                ) : (
                  <>
                    <option value="PERMANEN">Permanen (20 Tahun)</option>
                    <option value="TIDAK_PERMANEN">
                      Tidak Permanen (10 Tahun)
                    </option>
                  </>
                )}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">
                Metode
              </label>
              <select
                className="w-full border rounded px-3 py-2 text-sm"
                value={susut.method}
                onChange={(e) => setSusut({ ...susut, method: e.target.value })}
                disabled={susut.type === "BANGUNAN"}
              >
                <option value="GL">Garis Lurus (Straight Line)</option>
                {susut.type === "HARTA" && (
                  <option value="SM">Saldo Menurun (Double Declining)</option>
                )}
              </select>
            </div>
          </div>
          <button
            onClick={hitungSusut}
            className="w-full bg-indigo-600 text-white py-2 rounded font-bold hover:bg-indigo-700"
          >
            HITUNG BEBAN PENYUSUTAN
          </button>
        </div>

        {hasilSusut && (
          <div className="bg-slate-900 text-white p-6 rounded-xl flex justify-between items-center shadow-lg">
            <div className="text-center">
              <div className="text-gray-400 text-xs uppercase mb-1">
                Beban Penyusutan Th {hasilSusut.year}
              </div>
              <div className="text-3xl font-bold text-yellow-400">
                Rp {hasilSusut.expense.toLocaleString("id-ID")}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-300">
                Akumulasi: Rp {hasilSusut.accum.toLocaleString("id-ID")}
              </div>
              <div className="text-sm text-gray-300">
                Nilai Buku: Rp {hasilSusut.book.toLocaleString("id-ID")}
              </div>
            </div>
          </div>
        )}
      </PageWrapper>
    );
  }

  // --- 5. PPN ---
  if (activeView === "ppn") {
    return (
      <PageWrapper title="Kalkulator PPN (UU HPP)">
        <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Jenis Faktur / Transaksi
            </label>
            <select
              className="w-full border rounded px-3 py-2"
              value={ppn.jenis}
              onChange={(e) => {
                const j = e.target.value;
                let t = "12";
                if (j === "EKSPOR") t = "0";
                if (j === "FINAL") t = "2.4"; // 20% x 12%
                if (j === "TERTENTU") t = "1.1";
                setPpn({ ...ppn, jenis: j, tarif: t });
              }}
            >
              <option value="UMUM">Faktur Pajak Umum (12%)</option>
              <option value="EKSPOR">Ekspor BKP/JKP (0%)</option>
              <option value="FINAL">
                KMS / Besaran Tertentu (Efektif 2.4%)
              </option>
              <option value="TERTENTU">Kendaraan Bekas (1.1%)</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Dasar Pengenaan Pajak (DPP)
            </label>
            <input
              className="w-full border rounded px-3 py-2 text-lg font-mono"
              value={ppn.dpp}
              onChange={(e) =>
                setPpn({ ...ppn, dpp: formatNumber(e.target.value) })
              }
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Tarif Berlaku (%)
            </label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2 bg-gray-50"
              value={ppn.tarif}
              readOnly
            />
          </div>
          <button
            onClick={hitungPpn}
            className="w-full bg-purple-600 text-white py-3 rounded font-bold hover:bg-purple-700 shadow-lg"
          >
            HITUNG PPN
          </button>

          {hasilPpn && (
            <div className="mt-6 p-4 bg-purple-50 border border-purple-100 rounded-xl text-center">
              <div className="text-purple-600 text-xs font-bold uppercase mb-1">
                PPN Harus Dipungut
              </div>
              <div className="text-4xl font-bold text-purple-900">
                Rp {hasilPpn.tax.toLocaleString("id-ID")}
              </div>
              <div className="text-sm text-gray-500 mt-2">
                Total Tagihan: Rp {hasilPpn.total.toLocaleString("id-ID")}
              </div>
            </div>
          )}
        </div>
      </PageWrapper>
    );
  }

  // --- 6. PKB (PAJAK KENDARAAN) ---
  if (activeView === "pkb") {
    return (
      <PageWrapper title="Estimasi Pajak Kendaraan (UU HKPD)">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <label className="text-xs font-bold text-gray-600">Jenis</label>
                <select
                  className="w-full border rounded px-2 py-2 text-sm"
                  value={pkb.jenis}
                  onChange={(e) => {
                    const j = e.target.value;
                    setPkb({
                      ...pkb,
                      jenis: j,
                      bobot: j === "MOTOR" ? "1" : "1",
                      swdkllj: j === "MOTOR" ? "35.000" : "143.000",
                    });
                  }}
                >
                  <option value="MOBIL">Mobil Penumpang</option>
                  <option value="MOTOR">Sepeda Motor</option>
                  <option value="TRUK">Truk / Pick Up</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600">
                  Provinsi
                </label>
                <select
                  className="w-full border rounded px-2 py-2 text-sm"
                  value={pkb.prov}
                  onChange={(e) => setPkb({ ...pkb, prov: e.target.value })}
                >
                  <option value="DKI">DKI Jakarta</option>
                  <option value="JABAR">Jawa Barat</option>
                  <option value="JATENG">Jawa Tengah</option>
                  <option value="JATIM">Jawa Timur</option>
                  <option value="BALI">Bali</option>
                  <option value="LAIN">Lainnya</option>
                </select>
              </div>
            </div>
            <div className="mb-3">
              <label className="text-xs font-bold text-gray-600">
                Nilai Jual (NJKB)
              </label>
              <input
                className="w-full border rounded px-3 py-2"
                value={pkb.njkb}
                onChange={(e) =>
                  setPkb({ ...pkb, njkb: formatNumber(e.target.value) })
                }
                placeholder="Cek di STNK..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <label className="text-xs font-bold text-gray-600">
                  Kepemilikan Ke-
                </label>
                <select
                  className="w-full border rounded px-2 py-2 text-sm"
                  value={pkb.urutan}
                  onChange={(e) => setPkb({ ...pkb, urutan: e.target.value })}
                >
                  <option value="1">1 (Pertama)</option>
                  <option value="2">2 (Kedua)</option>
                  <option value="3">3 (Ketiga)</option>
                  <option value="4">4 (Keempat)</option>
                  <option value="5">5 (Kelima+)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600">
                  Bobot Koefisien
                </label>
                <input
                  className="w-full border rounded px-2 py-2 text-sm"
                  value={pkb.bobot}
                  onChange={(e) => setPkb({ ...pkb, bobot: e.target.value })}
                />
              </div>
            </div>
            <button
              onClick={hitungPkb}
              className="w-full bg-orange-600 text-white py-2 rounded-lg font-bold hover:bg-orange-700 shadow"
            >
              HITUNG ESTIMASI
            </button>
          </div>

          <div className="bg-slate-900 text-white p-6 rounded-xl flex flex-col justify-center">
            {hasilPkb ? (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <span className="text-gray-400">
                    Tarif PKB ({hasilPkb.tarif}%)
                  </span>
                  <span>Rp {hasilPkb.pkbPokok.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <span className="text-gray-400">Opsen PKB (66%)</span>
                  <span>Rp {hasilPkb.opsen.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <span className="text-gray-400">SWDKLLJ</span>
                  <span>Rp {hasilPkb.swdkllj.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <span className="text-gray-400">Estimasi Admin</span>
                  <span>Rp {hasilPkb.admin.toLocaleString("id-ID")}</span>
                </div>
                <div className="pt-2 text-center">
                  <div className="text-orange-400 text-xs font-bold uppercase">
                    Total Estimasi Bayar
                  </div>
                  <div className="text-3xl font-bold">
                    Rp {hasilPkb.total.toLocaleString("id-ID")}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                Masukkan NJKB kendaraan Anda.
              </div>
            )}
          </div>
        </div>
      </PageWrapper>
    );
  }

  return null;
}
