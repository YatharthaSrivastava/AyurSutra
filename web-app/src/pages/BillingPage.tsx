import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import {
  Calculator,
  Printer,
  CheckCircle2,
  Sparkles,
  Receipt,
  Building2
} from "lucide-react";

export default function BillingPage() {
  const [patientName, setPatientName] = useState("Aarav Sharma");
  const [basePackageCost, setBasePackageCost] = useState(12500); // B_c
  const [durationDays, setDurationDays] = useState(7); // D
  const [dailyRoomTariff, setDailyRoomTariff] = useState(2200); // C_h
  const [medicineCost, setMedicineCost] = useState(3400); // M_c
  const [taxRate, setTaxRate] = useState(18); // 18% GST

  // Calculation Formula: T_c = B_c + (D * C_h) + M_c + T_tax
  const roomTotal = durationDays * dailyRoomTariff;
  const subtotal = basePackageCost + roomTotal + medicineCost;
  const taxAmount = Math.round((subtotal * taxRate) / 100);
  const totalCost = subtotal + taxAmount;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold tracking-wider uppercase mb-1">
              <Receipt className="w-4 h-4" />
              <span>Phase 3 Sprint 3.3 Dynamic Billing Engine</span>
            </div>
            <h1 className="text-3xl font-bold font-serif bg-gradient-to-r from-emerald-300 via-teal-100 to-amber-200 bg-clip-text text-transparent">
              Panchakarma Tariff & Dynamic Billing
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Interactive cost calculator implementing T_c = B_c + D × C_h + M_c + T_tax with itemized invoice generator.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-medium transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice</span>
            </button>
          </div>
        </div>

        {/* Dynamic Calculator Form & Invoice Preview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls & Inputs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel p-6 space-y-4">
              <div className="flex items-center gap-2 text-amber-400 font-serif font-bold text-base border-b border-slate-800 pb-3">
                <Calculator className="w-5 h-5" />
                <span>Tariff Parameters Calculator</span>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Patient Name</label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Base Panchakarma Package (B_c) ₹
                  </label>
                  <select
                    value={basePackageCost}
                    onChange={(e) => setBasePackageCost(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
                  >
                    <option value={12500}>7-Day Classical Purification (₹12,500)</option>
                    <option value={18000}>14-Day Complete Kayakalpa (₹18,000)</option>
                    <option value={25000}>21-Day Royal Rejuvenation (₹25,000)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Duration (D) Days</label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={durationDays}
                      onChange={(e) => setDurationDays(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Daily Suite Tariff (C_h) ₹</label>
                    <input
                      type="number"
                      value={dailyRoomTariff}
                      onChange={(e) => setDailyRoomTariff(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Herbal Medicines & Tailam (M_c) ₹
                  </label>
                  <input
                    type="number"
                    value={medicineCost}
                    onChange={(e) => setMedicineCost(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Healthcare GST Rate (T_tax) %</label>
                  <input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Formula Explanation Card */}
            <div className="ayur-card p-5 rounded-2xl border border-amber-500/30 text-xs space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <Sparkles className="w-4 h-4" />
                <span>Panchakarma Cost Specification</span>
              </div>
              <p className="text-slate-300 leading-relaxed font-mono">
                T_c = B_c + (D × C_h) + M_c + T_tax
              </p>
              <p className="text-slate-400 text-[11px]">
                Calculates transparent patient billing combining clinical procedure fees, suite tariffs, medicated oils, and statutory health taxes.
              </p>
            </div>
          </div>

          {/* Printable Invoice Preview */}
          <div className="lg:col-span-7">
            <div className="glass-panel-light p-8 rounded-2xl shadow-2xl space-y-6 text-slate-900">
              {/* Hospital Header */}
              <div className="flex items-start justify-between border-b border-slate-200 pb-6">
                <div>
                  <div className="flex items-center gap-2 text-emerald-800 font-serif font-bold text-xl">
                    <Building2 className="w-6 h-6 text-emerald-700" />
                    <span>AyurSutra Panchakarma Hospital</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    NABH Accredited Ayurvedic Clinical Center • GSTIN: 27AAAAA0000A1Z5
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest block">INVOICE</span>
                  <span className="text-xs font-mono text-slate-600">#AYUR-2026-889</span>
                  <span className="text-[10px] text-slate-400 block">{new Date().toLocaleDateString()}</span>
                </div>
              </div>

              {/* Patient Info */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Patient Name</span>
                  <span className="font-bold text-slate-900">{patientName}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Duration</span>
                  <span className="font-bold text-slate-900">{durationDays} Days Stay</span>
                </div>
              </div>

              {/* Itemized Table */}
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-300 text-slate-500 uppercase text-[10px]">
                    <th className="py-2">Item Description</th>
                    <th className="py-2 text-right">Calculation</th>
                    <th className="py-2 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  <tr>
                    <td className="py-3 font-semibold text-slate-800">
                      Panchakarma Base Package (B_c)
                    </td>
                    <td className="py-3 text-right text-slate-500">Fixed Package</td>
                    <td className="py-3 text-right font-mono text-slate-900">₹{basePackageCost.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-slate-800">
                      Hospital Suite Accommodation (D × C_h)
                    </td>
                    <td className="py-3 text-right text-slate-500">{durationDays} days @ ₹{dailyRoomTariff}/day</td>
                    <td className="py-3 text-right font-mono text-slate-900">₹{roomTotal.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-slate-800">
                      Herbal Medicines & Tailam (M_c)
                    </td>
                    <td className="py-3 text-right text-slate-500">Kashayas & Oils</td>
                    <td className="py-3 text-right font-mono text-slate-900">₹{medicineCost.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>

              {/* Totals Breakdown */}
              <div className="border-t-2 border-slate-300 pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-mono font-semibold">₹{subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Healthcare GST ({taxRate}%)</span>
                  <span className="font-mono font-semibold">₹{taxAmount.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-base font-bold text-emerald-900 border-t border-slate-300 pt-3">
                  <span>Total Payable (T_c)</span>
                  <span className="font-mono text-xl text-emerald-700">₹{totalCost.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-4 border-t border-slate-200">
                <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-4 h-4" /> Verified Panchakarma EHR Invoice
                </span>
                <span>Thank you for choosing AyurSutra</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
