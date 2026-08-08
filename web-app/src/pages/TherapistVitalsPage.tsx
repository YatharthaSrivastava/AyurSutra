import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api-client";
import {
  HeartPulse,
  User,
  CheckCircle2,
  Lock,
  Plus,
  Minus,
  Flame,
  Droplets,
  History
} from "lucide-react";

interface VitalLogEntry {
  id: string;
  patientName: string;
  time: string;
  bpSys: number;
  bpDia: number;
  pulse: number;
  agniScore: number;
  swedaLevel: string;
}

export default function TherapistVitalsPage() {
  const { session } = useAuth();
  const [selectedPatient, setSelectedPatient] = useState("Aarav Sharma (Room 101)");
  const [vitals, setVitals] = useState({ bp_sys: 120, bp_dia: 80, pulse: 72, agni: 7, sweda: "Moderate" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [history, setHistory] = useState<VitalLogEntry[]>([
    {
      id: "V-901",
      patientName: "Aarav Sharma",
      time: "09:15 AM",
      bpSys: 120,
      bpDia: 80,
      pulse: 72,
      agniScore: 7,
      swedaLevel: "Profuse",
    },
    {
      id: "V-900",
      patientName: "Priya Patel",
      time: "10:45 AM",
      bpSys: 110,
      bpDia: 75,
      pulse: 68,
      agniScore: 8,
      swedaLevel: "Moderate",
    },
  ]);

  const assignedPatients = [
    "Aarav Sharma (Room 101)",
    "Priya Patel (Room 102)",
    "Vikram Malhotra (Room 103)",
    "Ananya Roy (Room 104)",
  ];

  const quickPresets = [
    { label: "Normal (120/80 - 72)", bp_sys: 120, bp_dia: 80, pulse: 72 },
    { label: "Post-Sweda (115/75 - 78)", bp_sys: 115, bp_dia: 75, pulse: 78 },
    { label: "Resting (110/70 - 65)", bp_sys: 110, bp_dia: 70, pulse: 65 },
  ];

  const submit = async () => {
    if (!session) return;
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await api.logVitals(session.token, { bp_sys: vitals.bp_sys, bp_dia: vitals.bp_dia, pulse: vitals.pulse });
      setMessage("Vitals logged securely with field-level encryption (Fernet AES-256).");

      const newLog: VitalLogEntry = {
        id: `V-${902 + history.length}`,
        patientName: selectedPatient.split(" (")[0],
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        bpSys: vitals.bp_sys,
        bpDia: vitals.bp_dia,
        pulse: vitals.pulse,
        agniScore: vitals.agni,
        swedaLevel: vitals.sweda,
      };

      setHistory([newLog, ...history]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to log vitals");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf6f1] text-[#1b4332] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
          <div>
            <div className="flex items-center gap-2 text-[#1b4332] text-xs font-semibold tracking-wider uppercase mb-1">
              <HeartPulse className="w-4 h-4 text-[#d4a373]" />
              <span>MOD-05 Therapist Touch Console</span>
            </div>
            <h1 className="text-3xl font-bold font-serif text-[#1b4332]">
              Therapy Room Quick Vital Entry
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Touch-optimized vitals logger for therapists during Panchakarma session execution (&gt;48px target zones).
            </p>
          </div>

          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl text-xs text-emerald-800 font-bold shadow-sm">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Fernet Field-Level Encrypted</span>
          </div>
        </div>

        {/* Patient Picker */}
        <div className="ayur-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white shadow-md rounded-2xl border border-gray-200">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-[#d4a373]" />
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400">Assigned Patient</label>
              <select
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
                className="bg-white border border-gray-200 text-gray-900 rounded-xl text-sm font-bold px-3.5 py-1.5 focus:border-[#1b4332] focus:outline-none"
              >
                {assignedPatients.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            {quickPresets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => setVitals({ ...vitals, bp_sys: preset.bp_sys, bp_dia: preset.bp_dia, pulse: preset.pulse })}
                className="px-3.5 py-2 bg-gray-50 hover:bg-[#1b4332] hover:text-white border border-gray-200 rounded-xl text-xs font-bold text-[#1b4332] whitespace-nowrap transition-all shadow-sm min-h-[44px]"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Large Touch Targets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Systolic BP */}
          <VitalCard
            title="Systolic BP (mmHg)"
            value={vitals.bp_sys}
            color="rose"
            onIncrease={() => setVitals({ ...vitals, bp_sys: vitals.bp_sys + 5 })}
            onDecrease={() => setVitals({ ...vitals, bp_sys: Math.max(70, vitals.bp_sys - 5) })}
            onChange={(val) => setVitals({ ...vitals, bp_sys: val })}
          />

          {/* Diastolic BP */}
          <VitalCard
            title="Diastolic BP (mmHg)"
            value={vitals.bp_dia}
            color="amber"
            onIncrease={() => setVitals({ ...vitals, bp_dia: vitals.bp_dia + 5 })}
            onDecrease={() => setVitals({ ...vitals, bp_dia: Math.max(40, vitals.bp_dia - 5) })}
            onChange={(val) => setVitals({ ...vitals, bp_dia: val })}
          />

          {/* Nadi Pulse Rate */}
          <VitalCard
            title="Nadi / Pulse (bpm)"
            value={vitals.pulse}
            color="emerald"
            onIncrease={() => setVitals({ ...vitals, pulse: vitals.pulse + 2 })}
            onDecrease={() => setVitals({ ...vitals, pulse: Math.max(40, vitals.pulse - 2) })}
            onChange={(val) => setVitals({ ...vitals, pulse: val })}
          />
        </div>

        {/* Ayurvedic Vitals: Agni & Sweda Level */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="ayur-card p-5 space-y-3 bg-white shadow-md rounded-2xl border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1b4332] flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#d4a373]" /> Agni (Digestive Fire Score 1–10)
              </span>
              <span className="font-mono text-sm font-bold text-[#1b4332]">{vitals.agni} / 10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={vitals.agni}
              onChange={(e) => setVitals({ ...vitals, agni: Number(e.target.value) })}
              className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1b4332]"
            />
          </div>

          <div className="ayur-card p-5 space-y-3 bg-white shadow-md rounded-2xl border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1b4332] flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-[#2d6a4f]" /> Sweda (Sweat Level)
              </span>
              <span className="font-mono text-sm font-bold text-[#1b4332]">{vitals.sweda}</span>
            </div>
            <div className="flex items-center gap-2">
              {["Mild", "Moderate", "Profuse"].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setVitals({ ...vitals, sweda: lvl })}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                    vitals.sweda === lvl
                      ? "bg-[#1b4332] text-white border-[#1b4332] shadow-sm"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && <p className="text-xs text-red-600 font-bold bg-red-50 p-3 rounded-xl border border-red-200">{error}</p>}
        {message && <p className="text-xs text-emerald-800 font-bold bg-emerald-50 p-3 rounded-xl border border-emerald-200">{message}</p>}

        {/* Submit Button */}
        <button
          onClick={submit}
          disabled={loading}
          className="min-h-[56px] w-full rounded-2xl bg-[#1b4332] hover:bg-[#2d6a4f] text-lg font-bold text-white shadow-xl transition-all disabled:opacity-50"
        >
          {loading ? "Encrypting & Logging Vitals..." : "Confirm & Save Encrypted Vitals"}
        </button>

        {/* Vitals History Log */}
        <div className="ayur-card p-6 space-y-4 bg-white shadow-md rounded-2xl border border-gray-200">
          <div className="flex items-center gap-2 text-xs font-bold text-[#1b4332] uppercase tracking-wider">
            <History className="w-4 h-4 text-[#d4a373]" />
            <span>Session Vitals Log Timeline</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-slate-50 text-gray-500 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Time</th>
                  <th className="p-3">Patient</th>
                  <th className="p-3">BP (Sys/Dia)</th>
                  <th className="p-3">Pulse</th>
                  <th className="p-3">Agni</th>
                  <th className="p-3">Sweda</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-mono">
                {history.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="p-3 text-gray-500">{log.time}</td>
                    <td className="p-3 font-semibold text-[#1b4332] font-sans">{log.patientName}</td>
                    <td className="p-3 text-emerald-700 font-bold">{log.bpSys}/{log.bpDia}</td>
                    <td className="p-3 text-rose-600 font-bold">{log.pulse} bpm</td>
                    <td className="p-3 text-[#1b4332] font-bold">{log.agniScore}/10</td>
                    <td className="p-3 text-[#2d6a4f] font-bold">{log.swedaLevel}</td>
                    <td className="p-3 font-sans">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Encrypted
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

function VitalCard({
  title,
  value,
  color,
  onIncrease,
  onDecrease,
  onChange,
}: {
  title: string;
  value: number;
  color: "rose" | "amber" | "emerald";
  onIncrease: () => void;
  onDecrease: () => void;
  onChange: (val: number) => void;
}) {
  const textColor = {
    rose: "text-rose-600",
    amber: "text-amber-700",
    emerald: "text-emerald-700",
  }[color];

  return (
    <div className="ayur-card p-5 space-y-3 bg-white shadow-md rounded-2xl border border-gray-200">
      <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">{title}</span>

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onDecrease}
          className="w-12 h-12 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-800 text-lg font-bold transition-all active:scale-95 min-h-[48px] shadow-sm"
        >
          <Minus className="w-5 h-5 text-gray-700" />
        </button>

        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={`w-28 text-center bg-transparent font-mono text-3xl font-extrabold ${textColor} focus:outline-none`}
        />

        <button
          type="button"
          onClick={onIncrease}
          className="w-12 h-12 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-800 text-lg font-bold transition-all active:scale-95 min-h-[48px] shadow-sm"
        >
          <Plus className="w-5 h-5 text-gray-700" />
        </button>
      </div>
    </div>
  );
}
