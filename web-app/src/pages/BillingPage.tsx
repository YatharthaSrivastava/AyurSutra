import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import {
  Calculator,
  Printer,
  Receipt,
  Trash2,
  ShieldCheck
} from "lucide-react";

interface MedicineItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export default function BillingPage() {
  const [patientName, setPatientName] = useState("Aarav Sharma");
  const [patientId, setPatientId] = useState("PAT-101");
  const [invoiceDate, setInvoiceDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [basePackageCost, setBasePackageCost] = useState(12500); // B_c
  const [packageName, setPackageName] = useState("7-Day Classical Purification (Shodhana)");
  const [durationDays, setDurationDays] = useState(7); // D
  const [dailyRoomTariff, setDailyRoomTariff] = useState(2200); // C_h
  const [suiteName, setSuiteName] = useState("Suite 1 - Snehana Droni (Teakwood)");
  const [taxRate, setTaxRate] = useState(18); // 18% GST
  const [discountAmount, setDiscountAmount] = useState(1000); // e.g. Insurance / Promo

  // Itemized herbal medicines
  const [medicines, setMedicines] = useState<MedicineItem[]>([
    { id: "M-1", name: "Mahatriphala Ghrita (Murchita 500ml)", quantity: 2, unitPrice: 850 },
    { id: "M-2", name: "Dhanwantharam 101 Taila (1 Liter)", quantity: 1, unitPrice: 1200 },
    { id: "M-3", name: "Trivrit Lehyam & Triphala Decoction", quantity: 1, unitPrice: 500 },
  ]);

  const [newMedName, setNewMedName] = useState("");
  const [newMedQty, setNewMedQty] = useState(1);
  const [newMedPrice, setNewMedPrice] = useState(400);

  const handleAddMedicine = () => {
    if (!newMedName.trim()) return;
    setMedicines([
      ...medicines,
      { id: `M-${Date.now()}`, name: newMedName.trim(), quantity: Number(newMedQty), unitPrice: Number(newMedPrice) },
    ]);
    setNewMedName("");
  };

  const handleRemoveMedicine = (id: string) => {
    setMedicines(medicines.filter((m) => m.id !== id));
  };

  // Calculation Formula: T_c = B_c + (D * C_h) + M_c + T_tax - Discount
  const medicineCost = medicines.reduce((acc, m) => acc + m.quantity * m.unitPrice, 0);
  const roomTotal = durationDays * dailyRoomTariff;
  const subtotal = basePackageCost + roomTotal + medicineCost;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = Math.round((taxableAmount * taxRate) / 100);
  const totalCost = taxableAmount + taxAmount;

  return (
    <div className="min-h-screen bg-[#faf6f1] text-[#1b4332] flex flex-col font-sans selection:bg-[#d4a373]/30">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* ========================================================================= */}
        {/* TOP HEADER                                                                */}
        {/* ========================================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white p-6 rounded-3xl border-2 border-[#1b4332]/15 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-black tracking-widest text-[#b45309] uppercase">
              <Receipt className="w-4 h-4 text-[#d4a373]" />
              <span>AyurSutra Billing & Invoicing Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#1b4332] tracking-tight">
              Panchakarma Dynamic Tariff & Clinical Billing
            </h1>
            <p className="text-xs text-gray-600 font-medium">
              Interactive cost calculator implementing <code className="font-mono bg-[#faf6f1] px-1.5 py-0.5 rounded border border-[#1b4332]/20 font-bold">T_c = B_c + (D × C_h) + M_c + T_tax</code> with itemized GST invoice generator.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs font-black uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-[#1b4332]"
            >
              <Printer className="w-4 h-4 text-[#d4a373]" />
              <span>Print Tax Invoice</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MAIN SPLIT: CALCULATOR CONTROLS (5 cols) & INVOICE PREVIEW (7 cols)       */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: TARIFF PARAMETERS FORM */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-3xl border-2 border-[#1b4332]/15 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-[#1b4332] font-serif font-bold text-base border-b border-gray-100 pb-3">
                <Calculator className="w-5 h-5 text-[#b45309]" />
                <span>Tariff Parameters & Invoicing Controls</span>
              </div>

              <div className="space-y-4 text-xs">
                {/* Patient Info */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Patient Name</label>
                    <input
                      type="text"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full px-3.5 py-2 border-2 border-gray-200 rounded-xl font-bold text-[#1b4332] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Patient ID</label>
                    <input
                      type="text"
                      value={patientId}
                      onChange={(e) => setPatientId(e.target.value)}
                      className="w-full px-3.5 py-2 border-2 border-gray-200 rounded-xl font-bold text-gray-900 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Invoice Date & Suite Selection */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Invoice Date</label>
                    <input
                      type="date"
                      value={invoiceDate}
                      onChange={(e) => setInvoiceDate(e.target.value)}
                      className="w-full px-3.5 py-2 border-2 border-gray-200 rounded-xl font-bold text-gray-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Treatment Suite</label>
                    <select
                      value={suiteName}
                      onChange={(e) => setSuiteName(e.target.value)}
                      className="w-full px-3.5 py-2 border-2 border-gray-200 rounded-xl font-bold text-[#1b4332] focus:outline-none"
                    >
                      <option value="Suite 1 - Snehana Droni (Teakwood)">Suite 1 - Snehana</option>
                      <option value="Suite 2 - Shirodhara Droni (Bronze)">Suite 2 - Shirodhara</option>
                      <option value="Suite 3 - Basti Karma Unit">Suite 3 - Basti Unit</option>
                      <option value="Suite 4 - Panchakarma VIP Room">Suite 4 - VIP Suite</option>
                    </select>
                  </div>
                </div>

                {/* Base Package */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Base Panchakarma Package (B_c) ₹
                  </label>
                  <select
                    value={basePackageCost}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setBasePackageCost(val);
                      if (val === 12500) {
                        setPackageName("7-Day Classical Purification (Shodhana)");
                        setDurationDays(7);
                      } else if (val === 18000) {
                        setPackageName("14-Day Complete Kayakalpa Protocol");
                        setDurationDays(14);
                      } else if (val === 25000) {
                        setPackageName("21-Day Royal Rejuvenation & Rasayana");
                        setDurationDays(21);
                      } else {
                        setPackageName("Custom Outpatient Therapy Program");
                        setDurationDays(3);
                      }
                    }}
                    className="w-full px-3.5 py-2 border-2 border-gray-200 rounded-xl font-bold text-[#1b4332] focus:outline-none"
                  >
                    <option value={12500}>7-Day Classical Purification (₹12,500)</option>
                    <option value={18000}>14-Day Complete Kayakalpa (₹18,000)</option>
                    <option value={25000}>21-Day Royal Rejuvenation (₹25,000)</option>
                    <option value={6000}>3-Day Intensive Mini-Cleanse (₹6,000)</option>
                  </select>
                </div>

                {/* Days & Room Tariff */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Duration (D) Days</label>
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={durationDays}
                      onChange={(e) => setDurationDays(Number(e.target.value))}
                      className="w-full px-3.5 py-2 border-2 border-gray-200 rounded-xl font-bold font-mono text-gray-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Daily Suite Tariff (C_h) ₹</label>
                    <input
                      type="number"
                      value={dailyRoomTariff}
                      onChange={(e) => setDailyRoomTariff(Number(e.target.value))}
                      className="w-full px-3.5 py-2 border-2 border-gray-200 rounded-xl font-bold font-mono text-gray-900 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Discount & Tax */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Discount / Insurance ₹</label>
                    <input
                      type="number"
                      value={discountAmount}
                      onChange={(e) => setDiscountAmount(Number(e.target.value))}
                      className="w-full px-3.5 py-2 border-2 border-gray-200 rounded-xl font-bold text-emerald-800 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">GST Tax Rate (%)</label>
                    <select
                      value={taxRate}
                      onChange={(e) => setTaxRate(Number(e.target.value))}
                      className="w-full px-3.5 py-2 border-2 border-gray-200 rounded-xl font-bold text-gray-900 focus:outline-none"
                    >
                      <option value={18}>18% Standard GST</option>
                      <option value={12}>12% Reduced Rate</option>
                      <option value={5}>5% Essential Medicines</option>
                      <option value={0}>0% Healthcare Exempt</option>
                    </select>
                  </div>
                </div>

                {/* Add Herbal Medicine Row */}
                <div className="pt-2 border-t border-gray-100 space-y-2">
                  <label className="block font-bold text-[#1b4332]">Add Herbal Medicine Item (M_c)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Medicine name..."
                      value={newMedName}
                      onChange={(e) => setNewMedName(e.target.value)}
                      className="flex-1 px-3 py-1.5 border-2 border-gray-200 rounded-xl text-xs font-medium"
                    />
                    <input
                      type="number"
                      min={1}
                      max={10}
                      placeholder="Qty"
                      value={newMedQty}
                      onChange={(e) => setNewMedQty(Number(e.target.value))}
                      className="w-14 px-2 py-1.5 border-2 border-gray-200 rounded-xl text-xs font-mono font-bold"
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={newMedPrice}
                      onChange={(e) => setNewMedPrice(Number(e.target.value))}
                      className="w-20 px-2 py-1.5 border-2 border-gray-200 rounded-xl text-xs font-mono font-bold"
                    />
                    <button
                      type="button"
                      onClick={handleAddMedicine}
                      className="px-3 py-1.5 bg-[#1b4332] text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-[#2d6a4f]"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: OFFICIAL TAX INVOICE PREVIEW (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white p-8 rounded-3xl border-2 border-[#1b4332]/20 shadow-xl space-y-6 print:border-none print:shadow-none">
              {/* Hospital Brand Header */}
              <div className="flex justify-between items-start border-b-2 border-gray-100 pb-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#1b4332] text-[#d4a373] flex items-center justify-center font-serif text-lg font-bold">
                      आ
                    </div>
                    <h2 className="font-serif font-black text-2xl text-[#1b4332]">AyurSutra</h2>
                  </div>
                  <p className="text-[11px] text-gray-500 font-medium">
                    Classical Panchakarma & Research Hospital • NABH Accredited
                  </p>
                  <p className="text-[10px] text-gray-400 font-mono">GSTIN: 07AAAAA0000A1Z5 | AYUSH/2026/DL-098</p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 uppercase tracking-wide">
                    Tax Invoice
                  </span>
                  <p className="font-mono text-xs font-bold text-gray-800 mt-2">INV-2026-{patientId.replace("PAT-", "99")}</p>
                  <p className="text-[10px] text-gray-500 font-medium">Date: {invoiceDate}</p>
                </div>
              </div>

              {/* Patient & Admission Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-[#faf6f1] rounded-2xl border border-[#1b4332]/10 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase block">Billed To (Patient)</span>
                  <p className="font-bold text-[#1b4332] text-sm mt-0.5">{patientName}</p>
                  <p className="text-[10px] text-gray-600 font-mono">{patientId} • IPD / OPD Care</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase block">Treatment Suite</span>
                  <p className="font-bold text-[#1b4332] text-sm mt-0.5">{suiteName.split(" - ")[0]}</p>
                  <p className="text-[10px] text-gray-600">Duration: {durationDays} Days</p>
                </div>
              </div>

              {/* Itemized Table */}
              <table className="w-full text-left text-xs">
                <thead className="border-b-2 border-gray-200 text-gray-500 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="py-2.5">Item Description</th>
                    <th className="py-2.5 text-center">Qty / Days</th>
                    <th className="py-2.5 text-right">Rate ₹</th>
                    <th className="py-2.5 text-right">Amount ₹</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                  <tr>
                    <td className="py-3">
                      <p className="font-bold text-[#1b4332]">{packageName}</p>
                      <span className="text-[10px] text-gray-500">Base Panchakarma protocol package fee (B_c)</span>
                    </td>
                    <td className="py-3 text-center">1</td>
                    <td className="py-3 text-right font-mono">₹{basePackageCost.toLocaleString()}</td>
                    <td className="py-3 text-right font-mono font-bold">₹{basePackageCost.toLocaleString()}</td>
                  </tr>

                  <tr>
                    <td className="py-3">
                      <p className="font-bold text-[#1b4332]">Treatment Suite Occupancy & Droni Maintenance</p>
                      <span className="text-[10px] text-gray-500">{suiteName} ({durationDays} days × ₹{dailyRoomTariff}/day)</span>
                    </td>
                    <td className="py-3 text-center">{durationDays}</td>
                    <td className="py-3 text-right font-mono">₹{dailyRoomTariff.toLocaleString()}</td>
                    <td className="py-3 text-right font-mono font-bold">₹{roomTotal.toLocaleString()}</td>
                  </tr>

                  {medicines.map((med) => (
                    <tr key={med.id}>
                      <td className="py-2.5">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleRemoveMedicine(med.id)}
                            className="text-gray-300 hover:text-red-600 print:hidden cursor-pointer"
                            title="Remove"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                          <span>{med.name}</span>
                        </div>
                      </td>
                      <td className="py-2.5 text-center">{med.quantity}</td>
                      <td className="py-2.5 text-right font-mono">₹{med.unitPrice.toLocaleString()}</td>
                      <td className="py-2.5 text-right font-mono font-bold">₹{(med.quantity * med.unitPrice).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals & Tax Calculation Breakdown */}
              <div className="pt-4 border-t-2 border-gray-100 space-y-2 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal (Package + Suite + Herbs)</span>
                  <span className="font-mono font-bold">₹{subtotal.toLocaleString()}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-800 font-bold">
                    <span>AyurSutra Care Concession / Insurance</span>
                    <span className="font-mono">- ₹{discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>GST Tax ({taxRate}%)</span>
                  <span className="font-mono font-bold">₹{taxAmount.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center pt-3 border-t-2 border-[#1b4332] text-[#1b4332]">
                  <div>
                    <span className="font-serif font-black text-lg sm:text-xl block">Total Amount Payable (T_c)</span>
                    <span className="text-[10px] text-gray-500 font-medium">All taxes and sanitation charges included</span>
                  </div>
                  <span className="font-serif font-black text-2xl sm:text-3xl text-emerald-900 font-mono">
                    ₹{totalCost.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Seal & Authorization */}
              <div className="flex justify-between items-end pt-6 border-t border-gray-100 text-[10px] text-gray-500">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>Verified Hospital Bill (DISHA & HIPAA Compliant)</span>
                  </div>
                  <p>Computer generated invoice, requires no physical signature.</p>
                </div>
                <div className="text-right">
                  <div className="w-32 border-b border-gray-400 mb-1"></div>
                  <span className="font-bold text-gray-700 uppercase">Authorized Vaidya Signatory</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
