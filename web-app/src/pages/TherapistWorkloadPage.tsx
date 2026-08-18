import { useState, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import {
  Activity,
  Clock,
  User,
  Search,
  ArrowRightLeft,
  Printer,
  X
} from "lucide-react";

export interface TherapistWorkload {
  id: string;
  name: string;
  gender: "MALE" | "FEMALE";
  specialty: string;
  shiftHours: number; // H_t
  allocatedHours: number; // H_a
  sessionsCount: number;
  assignedSuite: string;
  upcomingSessions: {
    id: string;
    patientName: string;
    therapy: string;
    time: string;
    durationMins: number;
  }[];
}

export default function TherapistWorkloadPage() {
  const [therapists, setTherapists] = useState<TherapistWorkload[]>([
    {
      id: "TH-01",
      name: "Ramesh Kumar (Sr. Lead Therapist)",
      gender: "MALE",
      specialty: "Abhyanga, Swedana & Vamana",
      shiftHours: 8,
      allocatedHours: 6.5,
      sessionsCount: 5,
      assignedSuite: "Suite 1 - Snehana Droni",
      upcomingSessions: [
        { id: "S-1", patientName: "Aarav Sharma", therapy: "Abhyanga & Swedana", time: "09:00 AM", durationMins: 60 },
        { id: "S-2", patientName: "Vikram Malhotra", therapy: "Sarvanga Snehana", time: "11:30 AM", durationMins: 45 },
        { id: "S-3", patientName: "Suresh Gupta", therapy: "Vamana Karma Assist", time: "02:00 PM", durationMins: 90 },
      ],
    },
    {
      id: "TH-02",
      name: "Sunita Verma (Sr. Lead Therapist)",
      gender: "FEMALE",
      specialty: "Shirodhara, Takradhara & Nasya",
      shiftHours: 8,
      allocatedHours: 7.0,
      sessionsCount: 6,
      assignedSuite: "Suite 2 - Shirodhara Droni",
      upcomingSessions: [
        { id: "S-4", patientName: "Priya Patel", therapy: "Shirodhara (Taila Dhara)", time: "10:30 AM", durationMins: 45 },
        { id: "S-5", patientName: "Ananya Roy", therapy: "Takradhara", time: "01:00 PM", durationMins: 45 },
        { id: "S-6", patientName: "Kavita Shah", therapy: "Mukha Abhyanga", time: "03:30 PM", durationMins: 30 },
      ],
    },
    {
      id: "TH-03",
      name: "Anil Joshi (Male Therapist)",
      gender: "MALE",
      specialty: "Kashaya Basti & Raktamokshana",
      shiftHours: 8,
      allocatedHours: 8.5, // W = 1.06 > 1.0 Overworked!
      sessionsCount: 7,
      assignedSuite: "Suite 3 - Basti Karma Unit",
      upcomingSessions: [
        { id: "S-7", patientName: "Deepak Verma", therapy: "Kashaya Basti Cycle", time: "08:30 AM", durationMins: 45 },
        { id: "S-8", patientName: "Rahul Saxena", therapy: "Anuvasana Basti", time: "11:00 AM", durationMins: 40 },
        { id: "S-9", patientName: "Gopal Krishna", therapy: "Janu Basti", time: "01:30 PM", durationMins: 40 },
        { id: "S-10", patientName: "Manish Tiwari", therapy: "Kati Basti", time: "04:00 PM", durationMins: 40 },
      ],
    },
    {
      id: "TH-04",
      name: "Meera Nair (Female Therapist)",
      gender: "FEMALE",
      specialty: "Abhyanga, Udvartana & Swedana",
      shiftHours: 8,
      allocatedHours: 5.0,
      sessionsCount: 4,
      assignedSuite: "Suite 1 - Snehana Droni",
      upcomingSessions: [
        { id: "S-11", patientName: "Sneha Reddy", therapy: "Udvartana Scrub", time: "09:30 AM", durationMins: 45 },
        { id: "S-12", patientName: "Pooja Hegde", therapy: "Bashpa Sweda", time: "02:30 PM", durationMins: 30 },
      ],
    },
  ]);

  const [filterStatus, setFilterStatus] = useState<"ALL" | "OPTIMAL" | "OVERWORKED">("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  // Rebalance Modal State
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [sourceTherapistId, setSourceTherapistId] = useState("TH-03");
  const [targetTherapistId, setTargetTherapistId] = useState("TH-01");
  const [transferHours, setTransferHours] = useState(1.5);

  // Statistics
  const stats = useMemo(() => {
    const total = therapists.length;
    const overworked = therapists.filter((t) => t.allocatedHours / t.shiftHours > 1.0).length;
    const totalAllocated = therapists.reduce((acc, t) => acc + t.allocatedHours, 0);
    const totalShift = therapists.reduce((acc, t) => acc + t.shiftHours, 0);
    const avgLoad = Number((totalAllocated / (totalShift || 1)).toFixed(2));
    return { total, overworked, totalAllocated, avgLoad };
  }, [therapists]);

  // Filtered Therapists
  const filteredTherapists = useMemo(() => {
    return therapists.filter((t) => {
      const ratio = t.allocatedHours / t.shiftHours;
      const matchStatus =
        filterStatus === "ALL" ||
        (filterStatus === "OVERWORKED" && ratio > 1.0) ||
        (filterStatus === "OPTIMAL" && ratio <= 1.0);
      const matchSearch =
        !searchTerm.trim() ||
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.specialty.toLowerCase().includes(searchTerm.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [therapists, filterStatus, searchTerm]);

  // Handle Load Balancing
  const handleRebalance = (e: React.FormEvent) => {
    e.preventDefault();
    if (sourceTherapistId === targetTherapistId) return;

    setTherapists((prev) =>
      prev.map((t) => {
        if (t.id === sourceTherapistId) {
          return {
            ...t,
            allocatedHours: Math.max(0, Number((t.allocatedHours - transferHours).toFixed(1))),
            sessionsCount: Math.max(0, t.sessionsCount - 1),
          };
        }
        if (t.id === targetTherapistId) {
          return {
            ...t,
            allocatedHours: Number((t.allocatedHours + transferHours).toFixed(1)),
            sessionsCount: t.sessionsCount + 1,
          };
        }
        return t;
      })
    );

    setShowReassignModal(false);
  };

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
              <Activity className="w-4 h-4 text-[#d4a373]" />
              <span>AyurSutra Clinical Roster • Workload Balancing Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#1b4332] tracking-tight">
              Therapist Workload Analytics & Ratio Guardrail (W ≤ 1.0)
            </h1>
            <p className="text-xs text-gray-600 font-medium">
              Zero-fatigue monitoring preventing over-allocation during intense Panchakarma procedures.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white hover:bg-gray-50 text-[#1b4332] text-xs font-bold border-2 border-[#1b4332]/20 shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#b45309]" />
              <span className="hidden sm:inline">Print Roster</span>
            </button>

            <button
              type="button"
              onClick={() => setShowReassignModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs font-black uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-[#1b4332]"
            >
              <ArrowRightLeft className="w-4 h-4 text-[#d4a373]" />
              <span>Rebalance Workload</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* KPI COUNTERS & CLINICAL LOAD FORMULA                                      */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4.5 rounded-2xl border-2 border-[#1b4332]/15 shadow-xs flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-lg border border-emerald-200 shadow-inner">
              {stats.total}
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-500 uppercase">Active Therapists</p>
              <p className="text-sm font-serif font-black text-[#1b4332]">On Duty Today</p>
            </div>
          </div>

          <div className="bg-white p-4.5 rounded-2xl border-2 border-amber-500/20 shadow-xs flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold text-lg border border-amber-200 shadow-inner">
              {stats.avgLoad}
            </div>
            <div>
              <p className="text-[11px] font-bold text-amber-700 uppercase">Avg Clinic Ratio</p>
              <p className="text-sm font-serif font-black text-[#1b4332]">W = H_a / H_t</p>
            </div>
          </div>

          <div className="bg-white p-4.5 rounded-2xl border-2 border-red-500/20 shadow-xs flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg border shadow-inner ${
              stats.overworked > 0 ? "bg-red-50 text-red-800 border-red-300 animate-pulse" : "bg-emerald-50 text-emerald-800 border-emerald-200"
            }`}>
              {stats.overworked}
            </div>
            <div>
              <p className="text-[11px] font-bold text-red-700 uppercase">Fatigue Alerts</p>
              <p className="text-sm font-serif font-black text-[#1b4332]">{stats.overworked > 0 ? "W > 1.0 Action Needed" : "All Roster Clear"}</p>
            </div>
          </div>

          <div className="bg-white p-4.5 rounded-2xl border-2 border-[#1b4332]/15 shadow-xs flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#faf6f1] text-[#1b4332] flex items-center justify-center font-bold text-lg border border-[#1b4332]/20 shadow-inner">
              {stats.totalAllocated}h
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-500 uppercase">Total Therapy Time</p>
              <p className="text-sm font-serif font-black text-[#1b4332]">Scheduled Hours</p>
            </div>
          </div>
        </div>

        {/* Workload Rule Guardrail Banner */}
        <div className="p-4 bg-emerald-50/80 rounded-2xl border-2 border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-950">
          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="font-medium">
              <strong>Classical Rest Protocol:</strong> Workload Ratio <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-emerald-300 font-bold">W = H_a / H_t ≤ 1.0</code>. Therapists must receive a 30-min herbal tea break between heavy Swedana & Vamana sessions.
            </span>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-700 text-white font-bold text-[10px] uppercase shrink-0">
            Shastra Active
          </span>
        </div>

        {/* ========================================================================= */}
        {/* FILTER & SEARCH CONTROLS                                                  */}
        {/* ========================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border-2 border-[#1b4332]/15 shadow-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFilterStatus("ALL")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-2 ${
                filterStatus === "ALL"
                  ? "bg-[#1b4332] text-white border-[#1b4332]"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200"
              }`}
            >
              All Staff ({therapists.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus("OPTIMAL")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-2 ${
                filterStatus === "OPTIMAL"
                  ? "bg-[#1b4332] text-white border-[#1b4332]"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200"
              }`}
            >
              Optimal Load (W ≤ 1.0)
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus("OVERWORKED")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-2 ${
                filterStatus === "OVERWORKED"
                  ? "bg-red-700 text-white border-red-700"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200"
              }`}
            >
              Overworked (W &gt; 1.0)
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search therapist or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-gray-200 focus:border-[#1b4332] focus:outline-none w-56 font-medium"
            />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* THERAPIST ROSTER CARDS                                                    */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTherapists.map((therapist) => {
            const ratio = Number((therapist.allocatedHours / therapist.shiftHours).toFixed(2));
            const isOverworked = ratio > 1.0;
            const percentage = Math.min(100, Math.round(ratio * 100));

            return (
              <div
                key={therapist.id}
                className={`bg-white p-6 rounded-3xl border-2 transition-all shadow-sm space-y-4 ${
                  isOverworked
                    ? "border-red-300 ring-2 ring-red-100"
                    : "border-[#1b4332]/15 hover:border-[#1b4332]/40"
                }`}
              >
                <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#1b4332] text-[#d4a373] flex items-center justify-center font-bold text-sm shadow-md">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-base text-[#1b4332]">{therapist.name}</h3>
                      <p className="text-xs text-gray-500 font-medium">{therapist.specialty}</p>
                      <p className="text-[10px] text-[#b45309] font-bold mt-0.5">{therapist.assignedSuite}</p>
                    </div>
                  </div>

                  <span
                    className={`text-xs px-3 py-1 rounded-full font-black uppercase border shrink-0 ${
                      isOverworked
                        ? "bg-red-50 text-red-800 border-red-300 animate-pulse"
                        : ratio >= 0.8
                        ? "bg-amber-50 text-amber-800 border-amber-300"
                        : "bg-emerald-50 text-emerald-800 border-emerald-300"
                    }`}
                  >
                    {isOverworked ? "Overworked (W > 1.0)" : `W = ${ratio} (Optimal)`}
                  </span>
                </div>

                {/* Ratio Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-gray-700">
                    <span>Workload Capacity</span>
                    <span>{therapist.allocatedHours}h of {therapist.shiftHours}h Shift ({percentage}%)</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-gray-100 overflow-hidden border border-gray-200">
                    <div
                      className={`h-full transition-all duration-500 ${
                        isOverworked ? "bg-red-600" : ratio >= 0.8 ? "bg-amber-500" : "bg-emerald-600"
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Upcoming Scheduled Sessions */}
                <div className="space-y-2 pt-1">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide block">
                    Today's Session Queue ({therapist.upcomingSessions.length} Sessions)
                  </span>
                  <div className="space-y-1.5">
                    {therapist.upcomingSessions.map((session) => (
                      <div key={session.id} className="p-2.5 bg-[#faf6f1] rounded-xl border border-[#1b4332]/10 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-[#1b4332]">{session.patientName}</p>
                          <p className="text-[10px] text-gray-600">{session.therapy}</p>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-[#b45309] bg-white px-2 py-0.5 rounded-lg border border-gray-200">
                          {session.time} ({session.durationMins}m)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* ========================================================================= */}
      {/* REASSIGN WORKLOAD MODAL                                                   */}
      {/* ========================================================================= */}
      {showReassignModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full p-6 sm:p-8 rounded-3xl border-2 border-[#1b4332]/20 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 text-[#1b4332]">
                <ArrowRightLeft className="w-5 h-5 text-[#d4a373]" />
                <h2 className="font-serif font-bold text-xl text-[#1b4332]">
                  Balance Therapist Workload
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowReassignModal(false)}
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRebalance} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Transfer From (Overloaded Therapist)</label>
                <select
                  value={sourceTherapistId}
                  onChange={(e) => setSourceTherapistId(e.target.value)}
                  className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl font-bold text-[#1b4332]"
                >
                  {therapists.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} (Load: {t.allocatedHours}h / {t.shiftHours}h)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Transfer To (Available Therapist)</label>
                <select
                  value={targetTherapistId}
                  onChange={(e) => setTargetTherapistId(e.target.value)}
                  className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl font-bold text-[#1b4332]"
                >
                  {therapists.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} (Load: {t.allocatedHours}h / {t.shiftHours}h)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Hours to Reallocate (Hrs)</label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="4"
                  value={transferHours}
                  onChange={(e) => setTransferHours(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl font-bold text-gray-900"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowReassignModal(false)}
                  className="px-5 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 font-bold hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-extrabold shadow-lg cursor-pointer"
                >
                  Confirm Reallocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
